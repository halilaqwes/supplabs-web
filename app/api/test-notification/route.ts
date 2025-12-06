import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendPushNotification } from '@/lib/firebase-admin';

// Test endpoint to send push notification
export async function POST(request: NextRequest) {
    try {
        const { userId, title, body } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get all push tokens for this user
        const { data: tokens, error: tokenError } = await supabaseAdmin
            .from('push_tokens')
            .select('token')
            .eq('user_id', userId);

        if (tokenError) {
            console.error('Failed to get push tokens:', tokenError);
            return NextResponse.json(
                { error: 'Failed to get push tokens' },
                { status: 500 }
            );
        }

        if (!tokens || tokens.length === 0) {
            return NextResponse.json(
                { error: 'No push tokens found for this user. Make sure the mobile app is registered.' },
                { status: 404 }
            );
        }

        // Send notification
        const tokenStrings = tokens.map((t: { token: string }) => t.token);
        const result = await sendPushNotification(tokenStrings, {
            title: title || '🔔 Test Bildirimi',
            body: body || 'Bu bir test bildirimidir. SuppLabs bildirim sistemi çalışıyor! 🎉',
            data: {
                type: 'test',
                timestamp: new Date().toISOString()
            }
        });

        return NextResponse.json({
            success: true,
            message: `Notification sent to ${result.success} device(s)`,
            details: {
                successCount: result.success,
                failureCount: result.failure,
                totalTokens: tokenStrings.length
            }
        });
    } catch (error) {
        console.error('Test notification error:', error);
        return NextResponse.json(
            { error: 'Server error', details: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to check registered devices
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const { data: tokens, error } = await supabaseAdmin
            .from('push_tokens')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Failed to get push tokens:', error);
            return NextResponse.json(
                { error: 'Failed to get push tokens' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            userId,
            deviceCount: tokens?.length || 0,
            devices: tokens || []
        });
    } catch (error) {
        console.error('Error checking devices:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
