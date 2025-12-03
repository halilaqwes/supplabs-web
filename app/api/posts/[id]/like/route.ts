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

        // Check if already liked
        const { data: existingLike } = await supabaseAdmin
            .from('likes')
            .select('*')
            .eq('user_id', userId)
            .eq('post_id', postId)
            .single();

        if (existingLike) {
            // Unlike
            const { error } = await supabaseAdmin
                .from('likes')
                .delete()
                .eq('user_id', userId)
                .eq('post_id', postId);

            if (error) {
                console.error('Unlike error:', error);
                return NextResponse.json(
                    { error: 'Beğeni kaldırılamadı' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { liked: false, message: 'Beğeni kaldırıldı' },
                { status: 200 }
            );
        } else {
            // Like
            const { error } = await supabaseAdmin
                .from('likes')
                .insert({
                    user_id: userId,
                    post_id: postId
                });

            if (error) {
                console.error('Like error:', error);
                return NextResponse.json(
                    { error: 'Beğenilemedi' },
                    { status: 500 }
                );
            }

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
                        type: 'like',
                        post_id: postId
                    });
            }

            return NextResponse.json(
                { liked: true, message: 'Beğenildi!' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Like/unlike error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
