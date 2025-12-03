import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const notificationId = params.id;

        // Mark notification as read
        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) {
            console.error('Mark notification as read error:', error);
            return NextResponse.json(
                { error: 'Bildirim güncellenemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Bildirim okundu olarak işaretlendi' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Mark notification as read error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
