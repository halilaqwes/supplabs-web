import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const params = await props.params;
        const username = decodeURIComponent(params.username);
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get user by username
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .ilike('username', username)
            .single();

        if (!user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Get user's posts
        const { data: posts, error } = await supabaseAdmin
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
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Get user posts error:', error);
            return NextResponse.json(
                { error: 'Gönderiler alınamadı' },
                { status: 500 }
            );
        }

        const formattedPosts = posts.map(post => ({
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
            timestamp: getTimeAgo(post.created_at),
            likedBy: [],
            repostedBy: [],
            commentsList: []
        }));

        return NextResponse.json({ posts: formattedPosts }, { status: 200 });
    } catch (error) {
        console.error('Get user posts error:', error);
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
