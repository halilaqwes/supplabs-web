import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta/Kullanıcı adı ve şifre gereklidir' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find user by email or username
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${email}`)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Geçersiz kullanıcı adı/e-posta veya şifre' },
                { status: 401, headers: corsHeaders }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Geçersiz kullanıcı adı/e-posta veya şifre' },
                { status: 401, headers: corsHeaders }
            );
        }

        // Return user without password, mapped to User interface
        const {
            password_hash,
            is_verified,
            followers_count,
            following_count,
            ...userWithoutPassword
        } = user;

        const mappedUser = {
            ...userWithoutPassword,
            isVerified: is_verified,
            followers: followers_count,
            following: following_count
        };

        return NextResponse.json(
            {
                user: mappedUser,
                message: 'Giriş başarılı!'
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders
    });
}
