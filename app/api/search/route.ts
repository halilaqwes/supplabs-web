
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ users: [], posts: [] }, { status: 200 });
        }

        // Search Users (username or handle)
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('id, username, handle, avatar, is_verified')
            .or(`username.ilike.%${query}%,handle.ilike.%${query}%`)
            .limit(10);

        if (usersError) {
            console.error('Search users error:', usersError);
        }

        // Search Posts (content)
        const { data: posts, error: postsError } = await supabaseAdmin
            .from('posts')
            .select(`
                *,
                users:user_id (
                    id,
                    username,
                    handle,
                    avatar,
                    is_verified
                )
            `)
            .ilike('content', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20);

        if (postsError) {
            console.error('Search posts error:', postsError);
        }

        // Format posts
        const formattedPosts = posts?.map(post => ({
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
            likedBy: [],
            repostedBy: [],
            commentsList: []
        })) || [];

        return NextResponse.json({
            users: users || [],
            posts: formattedPosts
        }, { status: 200 });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
