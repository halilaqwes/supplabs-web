import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const params = await props.params;
        const username = decodeURIComponent(params.username);

        // Get user by username or handle (case insensitive)
        // We check if the param matches username OR handle (with or without @)
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .or(`username.ilike.${username},handle.ilike.${username},handle.ilike.@${username}`)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Return user without password and map to User interface
        const {
            password_hash,
            is_verified,
            is_official,
            followers_count,
            following_count,
            ...userWithoutPassword
        } = user;

        const mappedUser = {
            ...userWithoutPassword,
            isVerified: is_verified,
            isOfficial: is_official,
            followers: followers_count,
            following: following_count
        };

        return NextResponse.json({ user: mappedUser }, { status: 200 });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
