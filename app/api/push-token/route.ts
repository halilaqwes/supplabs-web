import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// API to register/update push notification token
export async function POST(request: NextRequest) {
    try {
        const { userId, token, platform } = await request.json();

        if (!userId || !token) {
            return NextResponse.json(
                { error: 'User ID and token are required' },
                { status: 400 }
            );
        }

        // Upsert the token (update if exists, insert if not)
        const { error } = await supabaseAdmin
            .from('push_tokens')
            .upsert(
                {
                    user_id: userId,
                    token: token,
                    platform: platform || 'android',
                    updated_at: new Date().toISOString()
                },
                {
                    onConflict: 'user_id,token'
                }
            );

        if (error) {
            console.error('Failed to save push token:', error);
            return NextResponse.json(
                { error: 'Failed to save token' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Token registered successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Push token registration error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}

// API to remove push token (on logout)
export async function DELETE(request: NextRequest) {
    try {
        const { userId, token } = await request.json();

        if (!userId || !token) {
            return NextResponse.json(
                { error: 'User ID and token are required' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('push_tokens')
            .delete()
            .eq('user_id', userId)
            .eq('token', token);

        if (error) {
            console.error('Failed to delete push token:', error);
            return NextResponse.json(
                { error: 'Failed to delete token' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Token removed successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Push token deletion error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
