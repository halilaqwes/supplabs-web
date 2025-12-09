import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, content } = await request.json();

        if (!userId || !content) {
            return NextResponse.json(
                { error: 'Kullanıcı ID ve mesaj içeriği gereklidir' },
                { status: 400 }
            );
        }

        // Verify admin permissions
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('role, username, handle')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Kullanıcı doğrulanamadı' },
                { status: 401 }
            );
        }

        const isAdmin = user.role === 'admin' ||
            user.handle === '@supplabs' ||
            user.username === 'SuppLabs Resmi';

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 403 }
            );
        }

        // 1. Create a System Post first
        // We use a special prefix to hide this from the main feed while keeping the content accessible
        const HIDDEN_PREFIX = '[SYSTEM_HIDDEN] ';
        const { data: post, error: postError } = await supabaseAdmin
            .from('posts')
            .insert({
                user_id: userId,
                content: HIDDEN_PREFIX + content,
            })
            .select('id')
            .single();

        if (postError || !post) {
            console.error('Create system post error:', postError);
            return NextResponse.json(
                { error: 'Duyuru gönderisi oluşturulamadı: ' + (postError?.message || 'Bilinmeyen hata') },
                { status: 500 }
            );
        }

        // 2. Get all user IDs
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('id');

        if (usersError) {
            console.error('Fetch users error:', usersError);
            return NextResponse.json(
                { error: 'Kullanıcı listesi alınamadı' },
                { status: 500 }
            );
        }

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'Gönderilecek kullanıcı bulunamadı' }, { status: 200 });
        }

        // 3. Prepare notifications linked to the Post
        const notifications = users.map(u => ({
            user_id: u.id,
            from_user_id: userId,
            type: 'reply',
            post_id: post.id, // Link to the new post
            read: false
            // Note: removed 'content' field as it caused schema error
        }));

        // 4. Bulk Insert
        const BATCH_SIZE = 100;
        let successCount = 0;
        let lastError: any = null;

        for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
            const batch = notifications.slice(i, i + BATCH_SIZE);
            const { error: insertError } = await supabaseAdmin
                .from('notifications')
                .insert(batch);

            if (insertError) {
                console.error(`Batch insert error at index ${i}:`, insertError);
                lastError = insertError;
            } else {
                successCount += batch.length;
            }
        }

        if (successCount === 0 && lastError) {
            return NextResponse.json({
                error: 'Bildirim gönderilemedi. Hata detayı: ' + (lastError.message || JSON.stringify(lastError)),
                details: lastError
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Bildirimler gönderiliyor',
            totalUsers: users.length,
            sentCount: successCount
        }, { status: 200 });

    } catch (error) {
        console.error('Bulk notification error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
