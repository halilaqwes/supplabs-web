import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json();

        // Validate input
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: 'Kullanıcı adı, e-posta ve şifre zorunludur' },
                { status: 400 }
            );
        }

        // Check if user exists by email
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu e-posta adresi zaten kayıtlı!' },
                { status: 400 }
            );
        }

        // Check if username exists
        const { data: existingUsername } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUsername) {
            return NextResponse.json(
                { error: 'Bu kullanıcı adı zaten kullanılıyor!' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Auto-generate handle from username
        const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`;

        const { data: newUser, error } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                username,
                handle,
                name: username,
                surname: '',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            })
            .select()
            .single();

        if (error) {
            console.error('Register error:', error);
            return NextResponse.json(
                { error: 'Kayıt başarısız oldu' },
                { status: 500 }
            );
        }

        // Return user without password
        const { password_hash, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            {
                user: userWithoutPassword,
                message: 'Kayıt başarılı!'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
