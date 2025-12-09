import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Update the updated_at column to current timestamp
        // This acts as a "Last Seen" indicator
        const { error } = await supabaseAdmin
            .from('users')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            console.error('Ping error:', error);
            return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ping server error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
