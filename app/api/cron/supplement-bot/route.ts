import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize lazily inside handler to prevent build crashes
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create bot user
        let { data: botUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('username', 'Supp Bilgi Botu')
            .single();

        if (!botUser) {
            return NextResponse.json(
                { error: 'Bot user (Supp Bilgi Botu) not found. Please create it first.' },
                { status: 404 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Generate supplement tip from Gemini AI
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                maxOutputTokens: 200,
            }
        });

        const prompt = `Supplement hakkında ilginç, kısa ve öğretici bir bilgi ver. 
        Türkçe olsun, 2-3 cümle olsun. 
        Bilimsel ama anlaşılır olsun.
        Protein, kreatin, BCAA, vitamin, mineral gibi popüler supplementler hakkında olabilir.
        Emoji kullanabilirsin ancak abartma.
        Her seferinde farklı bir supplement konusu seç.
        Yararlı ipuçları ver.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const supplementTip = response.text();

        // Create post as bot
        const { data: post, error } = await supabaseAdmin
            .from('posts')
            .insert({
                user_id: botUser.id,
                content: supplementTip,
                image: null
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create bot post:', error);
            return NextResponse.json(
                { error: 'Failed to create post', details: error.message },
                { status: 500 }
            );
        }

        console.log('Bot post created:', post.id);

        return NextResponse.json({
            success: true,
            message: 'Supplement tip posted successfully',
            postId: post.id,
            content: supplementTip,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Supplement bot error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Supplement bot failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
