import { schedule } from '@netlify/functions';

export const handler = schedule('0 2 * * *', async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://supplabs.netlify.app';
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        console.error('CRON_SECRET is missing');
        return { statusCode: 500 };
    }

    try {
        const response = await fetch(`${appUrl}/api/cron/cleanup-posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cronSecret}`,
            },
        });

        const data = await response.json();
        console.log('Cleanup Cron Result:', data);

        return {
            statusCode: response.status,
        };
    } catch (error) {
        console.error('Cleanup Cron Error:', error);
        return { statusCode: 500 };
    }
});
