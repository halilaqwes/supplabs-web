import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const postId = params.id;

        // Get comments with user info
        const { data: comments, error } = await supabaseAdmin
            .from('comments')
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
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Get comments error:', error);
            return NextResponse.json(
                { error: 'Yorumlar alınamadı' },
                { status: 500 }
            );
        }

        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            userId: comment.user_id,
            username: comment.users.username,
            handle: comment.users.handle,
            avatar: comment.users.avatar,
            isVerified: comment.users.is_verified,
            timestamp: getTimeAgo(comment.created_at)
        }));

        return NextResponse.json({ comments: formattedComments }, { status: 200 });
    } catch (error) {
        console.error('Get comments error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId, content } = await request.json();
        const params = await props.params;
        const postId = params.id;

        if (!userId || !content) {
            return NextResponse.json(
                { error: 'Kullanıcı ID ve içerik gereklidir' },
                { status: 400 }
            );
        }

        // Add comment
        const { data: comment, error } = await supabaseAdmin
            .from('comments')
            .insert({
                post_id: postId,
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
                    is_verified
                )
            `)
            .single();

        if (error) {
            console.error('Create comment error:', error);
            return NextResponse.json(
                { error: 'Yorum eklenemedi' },
                { status: 500 }
            );
        }

        // Update comments count handled by trigger
        // await supabaseAdmin.rpc('increment_comments_count', { post_id: postId });

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
                    type: 'reply',
                    post_id: postId
                });
        }

        const formattedComment = {
            id: comment.id,
            content: comment.content,
            userId: comment.user_id,
            username: comment.users.username,
            handle: comment.users.handle,
            avatar: comment.users.avatar,
            isVerified: comment.users.is_verified,
            timestamp: 'Şimdi'
        };

        return NextResponse.json(
            { comment: formattedComment, message: 'Yorum eklendi!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create comment error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

function getTimeAgo(date: string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s önce`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}dk önce`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}sa önce`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}g önce`;

    return commentDate.toLocaleDateString('tr-TR');
}
