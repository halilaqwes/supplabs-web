import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const params = await props.params;
        const username = decodeURIComponent(params.username);

        // First get user id from username
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .or(`username.ilike.${username},handle.ilike.${username},handle.ilike.@${username}`)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get liked posts
        const { data: likes, error } = await supabaseAdmin
            .from('likes')
            .select(`
                post_id,
                posts:post_id (
                    *,
                    users:user_id (
                        id,
                        username,
                        handle,
                        avatar,
                        is_verified
                    )
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get liked posts error:', error);
            return NextResponse.json({ error: 'Failed to fetch liked posts' }, { status: 500 });
        }

        // Format posts
        const formattedPosts = likes
            .filter((like: any) => like.posts) // Filter out deleted posts
            .map((like: any) => {
                const post = like.posts;
                return {
                    id: post.id,
                    userId: post.user_id,
                    username: post.users.username,
                    handle: post.users.handle,
                    avatar: post.users.avatar,
                    isVerified: post.users.is_verified,
                    content: post.content,
                    image: post.image,
                    video: post.video,
                    likes: post.likes_count,
                    reposts: post.reposts_count,
                    comments: post.comments_count,
                    timestamp: new Date(post.created_at).toLocaleDateString('tr-TR'),
                    isLiked: true, // Since we are fetching liked posts, it is liked
                    likedBy: [],
                    repostedBy: [],
                    commentsList: []
                };
            });

        return NextResponse.json({ posts: formattedPosts }, { status: 200 });
    } catch (error) {
        console.error('Get liked posts error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
