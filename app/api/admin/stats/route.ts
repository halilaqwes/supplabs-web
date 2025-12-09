import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 1. Get Total Users Count
        const { count: totalUsers, error: countError } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            throw countError;
        }

        // 2. Get Recent Users (Last 10 active)
        const { data: recentUsers, error: recentError } = await supabaseAdmin
            .from('users')
            .select('id, username, avatar, updated_at, is_verified, email')
            .order('updated_at', { ascending: false })
            .limit(10);

        if (recentError) {
            throw recentError;
        }

        // 3. Calculate "Online" Users
        // Users active in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        // Note: supabaseAdmin.from('users').select('*', { count: 'exact' }).gt('updated_at', fiveMinutesAgo) 
        // implies we can just count them.

        const { count: onlineCount, error: onlineError } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gt('updated_at', fiveMinutesAgo);

        if (onlineError) {
            throw onlineError;
        }

        return NextResponse.json({
            stats: {
                totalUsers: totalUsers || 0,
                onlineUsers: onlineCount || 0,
            },
            recentUsers: recentUsers || []
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
