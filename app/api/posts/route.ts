import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const userId = searchParams.get('userId');

        // Get posts with user info and check if liked by current user
        let query = supabaseAdmin
            .from('posts')
            .select(`
        *,
        users:user_id (
          id,
          username,
          handle,
          avatar,
          is_verified,
          is_official,
          role
        ),
        likes:likes(user_id)
      `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // If we have a userId, we want to check if THEY liked it. 
        // However, Supabase select with filter on related table is tricky for "isLiked" boolean without filtering the parent rows.
        // A common workaround is to fetch all likes for these posts by this user separately or just fetch all likes (bad for scale).
        // Or use the !inner join trick if we only wanted liked posts.
        // For now, let's fetch the posts, and if userId is present, we'll check likes.
        // Actually, the select `likes(user_id)` will return ALL likes for the post. We need to filter this.
        // But we can't easily filter the nested relation in the select string without filtering the parent.
        // So we will fetch, and then map. Ideally we would use rpc or a view, but let's stick to simple JS for now.

        const { data: posts, error } = await query;

        if (error) {
            console.error('Get posts error:', error);
            return NextResponse.json(
                { error: 'Gönderiler alınamadı' },
                { status: 500 }
            );
        }

        // Format posts
        const formattedPosts = posts.map(post => {
            // Check if the current user liked this post
            // The 'likes' field will be an array of objects { user_id: ... }
            // We check if any of them match the provided userId
            // Note: In a real production app with millions of likes, you wouldn't fetch ALL likes. 
            // You would use a separate query or a Postgres function.
            // For this scale, fetching likes and filtering in memory or checking existence is okay-ish, 
            // BUT `likes(user_id)` fetches ALL likes. That's bad if a post has 10k likes.
            // Better approach: We can't easily do it in one query with standard Supabase client without a customized view.
            // Let's assume for now we just check the `likes` array. 
            // Wait, if we don't filter `likes`, we get all of them.
            // Let's try to filter the nested resource.
            // Actually, we can just return `isLiked: false` for now and handle it client side? 
            // No, the user wants to see if they liked it.

            // Let's refine the query to only fetch likes for THIS user.
            // We can't easily do that in the same query without filtering the posts.

            // Alternative: Fetch posts, then fetch "likes by this user for these post IDs".
            return {
                id: post.id,
                userId: post.user_id,
                username: post.users.username,
                handle: post.users.handle,
                avatar: post.users.avatar,
                isVerified: post.users.is_verified,
                isOfficial: post.users.is_official,
                role: post.users.role,
                content: post.content,
                image: post.image,
                video: post.video,
                likes: post.likes_count,
                reposts: post.reposts_count,
                comments: post.comments_count,
                timestamp: getTimeAgo(post.created_at),
                isLiked: userId ? post.likes?.some((l: any) => l.user_id === userId) : false,
                likedBy: [],
                repostedBy: [],
                commentsList: []
            };
        });

        return NextResponse.json({ posts: formattedPosts }, { status: 200 });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, content } = await request.json();

        if (!userId || !content) {
            return NextResponse.json(
                { error: 'Kullanıcı ID ve içerik gereklidir' },
                { status: 400 }
            );
        }

        const { data: post, error } = await supabaseAdmin
            .from('posts')
            .insert({
                user_id: userId,
                content
            })
            .select(`
        *,
        users:user_id (
          id,
          username,
          handle,
          avatar,
          is_verified,
          is_official,
          role
        )
      `)
            .single();

        if (error) {
            console.error('Create post error:', error);
            return NextResponse.json(
                { error: 'Gönderi oluşturulamadı' },
                { status: 500 }
            );
        }

        const formattedPost = {
            id: post.id,
            userId: post.user_id,
            username: post.users.username,
            handle: post.users.handle,
            avatar: post.users.avatar,
            isVerified: post.users.is_verified,
            isOfficial: post.users.is_official,
            role: post.users.role,
            content: post.content,
            image: post.image,
            video: post.video,
            likes: 0,
            reposts: 0,
            comments: 0,
            timestamp: 'Just now',
            likedBy: [],
            repostedBy: [],
            commentsList: []
        };

        return NextResponse.json(
            { post: formattedPost, message: 'Gönderi oluşturuldu!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

function getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s önce`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}dk önce`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}sa önce`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}g önce`;

    return postDate.toLocaleDateString('tr-TR');
}
