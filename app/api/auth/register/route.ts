import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, surname } = await request.json();

        // Validate input
        if (!email || !password || !name || !surname) {
            return NextResponse.json(
                { error: 'Tüm alanlar zorunludur' },
                { status: 400 }
            );
        }

        // Check if user exists
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

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const username = `${name} ${surname}`;
        // Create unique handle
        let handle = `@${email.split('@')[0]}`;
        let isHandleUnique = false;
        let attempt = 0;

        while (!isHandleUnique && attempt < 5) {
            const checkHandle = attempt === 0 ? handle : `${handle}${Math.floor(Math.random() * 1000)}`;

            const { data: existingHandle } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('handle', checkHandle)
                .single();

            if (!existingHandle) {
                handle = checkHandle;
                isHandleUnique = true;
            }
            attempt++;
        }

        if (!isHandleUnique) {
            handle = `${handle}${Date.now()}`; // Fallback to timestamp if loop fails
        }

        const { data: newUser, error } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                username,
                handle,
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
