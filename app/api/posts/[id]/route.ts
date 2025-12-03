import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(
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

        // Check if user owns the post
        const { data: post } = await supabaseAdmin
            .from('posts')
            .select('user_id')
            .eq('id', postId)
            .single();

        if (!post) {
            return NextResponse.json(
                { error: 'Gönderi bulunamadı' },
                { status: 404 }
            );
        }

        if (post.user_id !== userId) {
            return NextResponse.json(
                { error: 'Bu gönderiyi silme yetkiniz yok' },
                { status: 403 }
            );
        }

        // Delete post
        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Delete post error:', error);
            return NextResponse.json(
                { error: 'Gönderi silinemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Gönderi silindi!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
