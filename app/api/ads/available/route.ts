import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID gerekli' }, { status: 400 });
        }

        // Get today's ad views for this user
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: todayViews, error } = await supabase
            .from('ad_views')
            .select('id')
            .eq('user_id', userId)
            .gte('viewed_at', today.toISOString())
            .eq('video_completed', true);

        if (error) {
            console.error('Fetch ad views error:', error);
            return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
        }

        const watchedToday = todayViews?.length || 0;
        const maxDaily = 3;
        const remaining = Math.max(0, maxDaily - watchedToday);

        return NextResponse.json({
            watched: watchedToday,
            remaining,
            maxDaily,
            canWatch: remaining > 0
        });

    } catch (error) {
        console.error('Available ads API error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
