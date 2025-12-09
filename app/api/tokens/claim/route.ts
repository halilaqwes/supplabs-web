import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID gerekli' }, { status: 400 });
        }

        // Get user from Supabase
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('tokens, last_token_claim')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const now = new Date();
        const lastClaim = user.last_token_claim ? new Date(user.last_token_claim) : null;

        // Check if 24 hours have passed
        if (lastClaim) {
            const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastClaim < 24) {
                const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
                return NextResponse.json(
                    { error: `Bir sonraki jeton ${hoursRemaining} saat sonra alınabilir` },
                    { status: 429 }
                );
            }
        }

        // Update user: increment tokens and update last claim time
        const newTokens = (user.tokens || 0) + 1;
        const { error: updateError } = await supabase
            .from('users')
            .update({
                tokens: newTokens,
                last_token_claim: now.toISOString()
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Token update error:', updateError);
            return NextResponse.json({ error: 'Jeton güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Günlük jetonunuz hesabınıza eklendi!',
            tokens: newTokens,
            lastTokenClaim: now.toISOString()
        });

    } catch (error) {
        console.error('Token claim error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
