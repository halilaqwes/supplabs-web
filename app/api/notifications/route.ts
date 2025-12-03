import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        // Get notifications with from_user info
        const { data: notifications, error } = await supabaseAdmin
            .from('notifications')
            .select(`
                *,
                from_user:from_user_id (
                    id,
                    username,
                    handle,
                    avatar,
                    is_verified
                ),
                post:post_id (
                    id,
                    content
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Get notifications error:', error);
            return NextResponse.json(
                { error: 'Bildirimler alınamadı' },
                { status: 500 }
            );
        }

        const formattedNotifications = notifications.map(notif => ({
            id: notif.id,
            type: notif.type,
            read: notif.read,
            fromUser: {
                id: notif.from_user.id,
                username: notif.from_user.username,
                handle: notif.from_user.handle,
                avatar: notif.from_user.avatar,
                isVerified: notif.from_user.is_verified
            },
            post: notif.post ? {
                id: notif.post.id,
                content: notif.post.content
            } : null,
            timestamp: getTimeAgo(notif.created_at)
        }));

        return NextResponse.json({ notifications: formattedNotifications }, { status: 200 });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

function getTimeAgo(date: string): string {
    const now = new Date();
    const notifDate = new Date(date);
    const seconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s önce`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}dk önce`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}sa önce`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}g önce`;

    return notifDate.toLocaleDateString('tr-TR');
}
