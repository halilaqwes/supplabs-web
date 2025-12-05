// Test script to generate 5 bot posts
const CRON_SECRET = '2A+6Yhkx+LPyMgXB3dSmMBBfPr1Xg6tB978pPwMn7tw=';
const API_URL = 'http://localhost:3000/api/cron/supplement-bot';

async function generateBotPost() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CRON_SECRET}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Post created:', data.postId);
            console.log('📝 Content:', data.content);
            console.log('---');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ Error:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Failed:', error);
        return false;
    }
}

async function generateMultiplePosts(count) {
    console.log(`🤖 Generating ${count} bot posts...\n`);

    for (let i = 1; i <= count; i++) {
        console.log(`Post ${i}/${count}:`);
        await generateBotPost();

        // Wait 2 seconds between posts to avoid rate limiting
        if (i < count) {
            console.log('⏳ Waiting 2 seconds...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('\n🎉 All posts generated!');
    console.log('📱 Check your feed now!');
}

// Generate 5 posts
generateMultiplePosts(5);
