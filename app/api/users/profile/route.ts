import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: NextRequest) {
    try {
        const { userId, bio, avatar } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        const updates: any = {};
        if (bio !== undefined) updates.bio = bio;
        if (avatar !== undefined) updates.avatar = avatar;
        updates.updated_at = new Date().toISOString();

        // Update user profile
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Update profile error:', error);
            return NextResponse.json(
                { error: 'Profil güncellenemedi' },
                { status: 500 }
            );
        }

        // Return user without password
        const { password_hash, ...userWithoutPassword } = user;

        return NextResponse.json(
            { user: userWithoutPassword, message: 'Profil güncellendi!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
