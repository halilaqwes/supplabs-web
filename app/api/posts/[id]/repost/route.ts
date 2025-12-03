import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await request.json();
        const params = await props.params;
        const postId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        // Check if already reposted
        const { data: existingRepost } = await supabaseAdmin
            .from('reposts')
            .select('*')
            .eq('user_id', userId)
            .eq('post_id', postId)
            .single();

        if (existingRepost) {
            // Un-repost
            const { error } = await supabaseAdmin
                .from('reposts')
                .delete()
                .eq('user_id', userId)
                .eq('post_id', postId);

            if (error) {
                console.error('Un-repost error:', error);
                return NextResponse.json(
                    { error: 'Repost geri alınamadı' },
                    { status: 500 }
                );
            }

            // Update reposts count handled by trigger
            // await supabaseAdmin.rpc('decrement_reposts_count', { post_id: postId });

            return NextResponse.json(
                { reposted: false, message: 'Repost geri alındı' },
                { status: 200 }
            );
        } else {
            // Repost
            const { error } = await supabaseAdmin
                .from('reposts')
                .insert({
                    user_id: userId,
                    post_id: postId
                });

            if (error) {
                console.error('Repost error:', error);
                return NextResponse.json(
                    { error: 'Repost yapılamadı' },
                    { status: 500 }
                );
            }

            // Update reposts count handled by trigger
            // await supabaseAdmin.rpc('increment_reposts_count', { post_id: postId });

            // Create notification for post owner
            const { data: post } = await supabaseAdmin
                .from('posts')
                .select('user_id')
                .eq('id', postId)
                .single();

            if (post && post.user_id !== userId) {
                await supabaseAdmin
                    .from('notifications')
                    .insert({
                        user_id: post.user_id,
                        from_user_id: userId,
                        type: 'repost',
                        post_id: postId
                    });
            }

            return NextResponse.json(
                { reposted: true, message: 'Repost yapıldı!' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Repost error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
