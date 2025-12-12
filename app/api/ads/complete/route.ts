import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TOKENS_PER_VIDEO = 5;
const MAX_DAILY_VIDEOS = 3;

export async function POST(request: NextRequest) {
    try {
        const { userId, watchDuration } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID gerekli' }, { status: 400 });
        }

        // Anti-cheat: Minimum watch duration (reduced for testing)
        const MIN_WATCH_DURATION = 5000; // 5 seconds in ms
        if (!watchDuration || watchDuration < MIN_WATCH_DURATION) {
            return NextResponse.json({
                error: 'Video tam olarak izlenmedi',
                required: MIN_WATCH_DURATION,
                watched: watchDuration
            }, { status: 400 });
        }

        // Check daily limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: todayViews, error: viewsError } = await supabase
            .from('ad_views')
            .select('id')
            .eq('user_id', userId)
            .gte('viewed_at', today.toISOString())
            .eq('video_completed', true);

        if (viewsError) {
            console.error('Check views error:', viewsError);
            return NextResponse.json({ error: 'Kontrol hatası' }, { status: 500 });
        }

        const watchedToday = todayViews?.length || 0;
        if (watchedToday >= MAX_DAILY_VIDEOS) {
            return NextResponse.json({
                error: 'Günlük limit aşıldı',
                limit: MAX_DAILY_VIDEOS,
                watched: watchedToday
            }, { status: 429 });
        }

        // Get user's current tokens
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('tokens')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const newTokenBalance = (user.tokens || 0) + TOKENS_PER_VIDEO;

        // Update user tokens
        const { error: updateError } = await supabase
            .from('users')
            .update({ tokens: newTokenBalance })
            .eq('id', userId);

        if (updateError) {
            console.error('Token update error:', updateError);
            return NextResponse.json({ error: 'Token güncellenemedi' }, { status: 500 });
        }

        // Record ad view
        const { error: recordError } = await supabase
            .from('ad_views')
            .insert({
                user_id: userId,
                ad_network: 'admaven',
                video_completed: true,
                tokens_earned: TOKENS_PER_VIDEO
            });

        if (recordError) {
            console.error('Record ad view error:', recordError);
            // Continue anyway - user already got tokens
        }

        return NextResponse.json({
            success: true,
            message: `+${TOKENS_PER_VIDEO} jeton kazandınız!`,
            tokensEarned: TOKENS_PER_VIDEO,
            newBalance: newTokenBalance,
            remainingVideos: MAX_DAILY_VIDEOS - (watchedToday + 1)
        });

    } catch (error) {
        console.error('Complete ad API error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
