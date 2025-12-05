// Manuel AI Bot Trigger - Gemini 2.0 Flash Exp
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateAndPostSupplementTip() {
    try {
        console.log('🤖 Starting AI bot...');

        // 1. Get bot user
        const { data: botUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('username', 'Supp Bilgi Botu')
            .single();

        if (userError || !botUser) {
            console.error('❌ Bot user not found:', userError);
            return;
        }

        console.log('✅ Bot user found:', botUser.id);

        // 2. Generate AI content
        console.log('🧠 Calling Gemini 2.0 Flash Exp...');

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

        console.log('✅ AI Content Generated:');
        console.log('📝', supplementTip);
        console.log('');

        // 3. Create post
        console.log('💾 Saving to database...');

        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                user_id: botUser.id,
                content: supplementTip,
                image: null
            })
            .select()
            .single();

        if (postError) {
            console.error('❌ Failed to create post:', postError);
            return;
        }

        console.log('✅ Post created successfully!');
        console.log('🆔 Post ID:', post.id);
        console.log('⏰ Created at:', post.created_at);
        console.log('');
        console.log('🎉 Check your feed now!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run
generateAndPostSupplementTip();
