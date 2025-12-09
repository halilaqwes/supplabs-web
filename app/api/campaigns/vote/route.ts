import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, brandName } = await request.json();

        if (!userId || !brandName) {
            return NextResponse.json(
                { error: 'Eksik bilgi' },
                { status: 400 }
            );
        }

        // 1. Find the Campaign Post
        // We look for a post with the specific campaign tag
        const CAMPAIGN_TAG = '[SYSTEM_CAMPAIGN_2026]';
        // Also ensure it is hidden from feed
        const HIDDEN_PREFIX = '[SYSTEM_HIDDEN] ';

        const SEARCH_PATTERN = `%${CAMPAIGN_TAG}%`;

        let { data: post, error: searchError } = await supabaseAdmin
            .from('posts')
            .select('id')
            .ilike('content', SEARCH_PATTERN)
            .single();

        // 2. If not found, create it
        if (!post) {
            console.log('Campaign post not found, creating new one...');

            // Try to find a suitable system user to be the author
            const { data: systemUser } = await supabaseAdmin
                .from('users')
                .select('id')
                .or('username.eq.SuppLabs Resmi,handle.eq.@supplabs,role.eq.admin')
                .limit(1)
                .single();

            const authorId = systemUser?.id || userId; // Fallback to current user if system user not found (should be rare)

            const { data: newPost, error: createError } = await supabaseAdmin
                .from('posts')
                .insert({
                    user_id: authorId,
                    content: `${HIDDEN_PREFIX}${CAMPAIGN_TAG} 2026 En Sevilen Supplement Markası Anketi. Oylar yorumlardadır.`
                })
                .select('id')
                .single();

            if (createError || !newPost) {
                console.error('Failed to create campaign post:', createError);
                return NextResponse.json({ error: 'Sistem hatası: Anket başlatılamadı' }, { status: 500 });
            }
            post = newPost;
        }

        // 3. Add Vote as Comment
        // We prefix the comment to easily parse later if needed
        const voteContent = `[VOTE] ${brandName.trim()}`;

        const { error: commentError } = await supabaseAdmin
            .from('comments')
            .insert({
                post_id: post.id,
                user_id: userId,
                content: voteContent
            });

        if (commentError) {
            console.error('Failed to cast vote:', commentError);
            return NextResponse.json({ error: 'Oy kaydedilemedi' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Oyunuz kaydedildi!' }, { status: 200 });

    } catch (error) {
        console.error('Vote API Error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
