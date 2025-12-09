import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        const { count, error } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) {
            console.error('Get unread count error:', error);
            return NextResponse.json(
                { error: 'Bildirim sayısı alınamadı' },
                { status: 500 }
            );
        }

        return NextResponse.json({ count: count || 0 }, { status: 200 });
    } catch (error) {
        console.error('Get unread count error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
