
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
    try {
        const { userId, currentPassword, newPassword } = await request.json();

        if (!userId || !currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Eksik bilgi' },
                { status: 400 }
            );
        }

        // Get user's current password hash
        const { data: user, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('password_hash')
            .eq('id', userId)
            .single();

        if (fetchError || !user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Mevcut şifre yanlış' },
                { status: 401 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ password_hash: newPasswordHash })
            .eq('id', userId);

        if (updateError) {
            console.error('Update password error:', updateError);
            return NextResponse.json(
                { error: 'Şifre güncellenemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Şifre başarıyla güncellendi' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
