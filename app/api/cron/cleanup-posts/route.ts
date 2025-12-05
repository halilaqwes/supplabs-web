import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (Vercel Cron sends this)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find posts older than 24 hours with images
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data: oldPosts, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('id, image')
            .not('image', 'is', null)
            .lt('created_at', twentyFourHoursAgo.toISOString());

        if (fetchError) {
            console.error('Fetch error:', fetchError);
            throw fetchError;
        }

        if (!oldPosts || oldPosts.length === 0) {
            return NextResponse.json({
                message: 'No posts to cleanup',
                count: 0
            });
        }

        console.log(`Found ${oldPosts.length} posts to cleanup`);

        // Delete images from storage
        const deletedImages: string[] = [];
        for (const post of oldPosts) {
            if (post.image) {
                try {
                    // Extract path from URL
                    // Example URL: https://xxx.supabase.co/storage/v1/object/public/media/posts/filename.jpg
                    const url = new URL(post.image);
                    const pathParts = url.pathname.split('/');
                    // Get everything after 'public/'
                    const publicIndex = pathParts.indexOf('public');
                    if (publicIndex >= 0) {
                        const filePath = pathParts.slice(publicIndex + 2).join('/'); // media/posts/filename.jpg
                        const pathInBucket = pathParts.slice(publicIndex + 3).join('/'); // posts/filename.jpg

                        const { error: deleteError } = await supabaseAdmin.storage
                            .from('media')
                            .remove([pathInBucket]);

                        if (!deleteError) {
                            deletedImages.push(pathInBucket);
                            console.log(`Deleted image: ${pathInBucket}`);
                        } else {
                            console.error(`Failed to delete ${pathInBucket}:`, deleteError);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing image ${post.image}:`, error);
                }
            }
        }

        // Delete posts from database
        const postIds = oldPosts.map(p => p.id);
        const { error: deleteError } = await supabaseAdmin
            .from('posts')
            .delete()
            .in('id', postIds);

        if (deleteError) {
            console.error('Delete posts error:', deleteError);
            throw deleteError;
        }

        console.log(`Cleanup completed: ${postIds.length} posts, ${deletedImages.length} images`);

        return NextResponse.json({
            success: true,
            message: 'Cleanup successful',
            deletedPosts: postIds.length,
            deletedImages: deletedImages.length,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Cleanup failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
