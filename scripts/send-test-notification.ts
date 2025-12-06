// Script to send test push notification
// Usage: npx tsx scripts/send-test-notification.ts [userId]

import { sendPushNotification } from '../lib/firebase-admin';
import { supabaseAdmin } from '../lib/supabase-admin';

async function sendTestNotification(userId?: string) {
    try {
        console.log('🔔 SuppLabs Test Notification Sender\n');

        let tokens: any[] = [];

        if (userId) {
            // Send to specific user
            console.log(`Fetching push tokens for user: ${userId}`);
            const { data, error } = await supabaseAdmin
                .from('push_tokens')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('❌ Error fetching tokens:', error);
                return;
            }

            tokens = data || [];
        } else {
            // Send to all registered devices
            console.log('Fetching all registered push tokens...');
            const { data, error } = await supabaseAdmin
                .from('push_tokens')
                .select('*');

            if (error) {
                console.error('❌ Error fetching tokens:', error);
                return;
            }

            tokens = data || [];
        }

        if (tokens.length === 0) {
            console.log('⚠️  No push tokens found!');
            console.log('Make sure the mobile app is installed and has registered for notifications.');
            return;
        }

        console.log(`\n📱 Found ${tokens.length} registered device(s):`);
        tokens.forEach((t, i) => {
            console.log(`  ${i + 1}. User: ${t.user_id} | Platform: ${t.platform} | Updated: ${new Date(t.updated_at).toLocaleString('tr-TR')}`);
        });

        // Send test notification
        const tokenStrings = tokens.map(t => t.token);

        console.log('\n📤 Sending test notification...');

        const result = await sendPushNotification(tokenStrings, {
            title: '🎉 SuppLabs Test Bildirimi',
            body: 'Tebrikler! Push notification sisteminiz çalışıyor. Bu bir test mesajıdır.',
            data: {
                type: 'test',
                timestamp: new Date().toISOString(),
                message: 'Test notification from SuppLabs'
            }
        });

        console.log('\n✅ Notification sent!');
        console.log(`   Success: ${result.success} device(s)`);
        console.log(`   Failure: ${result.failure} device(s)`);

        if (result.success > 0) {
            console.log('\n🎊 Check your mobile device for the notification!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Get userId from command line argument
const userId = process.argv[2];

if (userId && userId !== 'all') {
    sendTestNotification(userId);
} else {
    sendTestNotification();
}
