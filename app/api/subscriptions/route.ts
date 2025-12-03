
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        // Update user verification status
        // In a real app, we would verify payment here
        const { error } = await supabaseAdmin
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);

        if (error) {
            console.error('Subscription error:', error);
            return NextResponse.json(
                { error: 'Abonelik işlemi başarısız' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Abonelik başarılı! Mavi tik eklendi.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
