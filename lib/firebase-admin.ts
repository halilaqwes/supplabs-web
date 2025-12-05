import * as admin from 'firebase-admin';

// Firebase Admin SDK initialization
// You need to add FIREBASE_SERVICE_ACCOUNT_KEY to your environment variables
// Get it from Firebase Console > Project Settings > Service Accounts > Generate new private key

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
    if (firebaseApp) {
        return firebaseApp;
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
        console.warn('Firebase service account key not configured. Push notifications will not work.');
        // Return a dummy app that won't send notifications
        if (!admin.apps.length) {
            firebaseApp = admin.initializeApp();
        } else {
            firebaseApp = admin.apps[0]!;
        }
        return firebaseApp;
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);

        if (!admin.apps.length) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            firebaseApp = admin.apps[0]!;
        }

        return firebaseApp;
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        if (!admin.apps.length) {
            firebaseApp = admin.initializeApp();
        } else {
            firebaseApp = admin.apps[0]!;
        }
        return firebaseApp;
    }
}

export interface PushNotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

export async function sendPushNotification(
    tokens: string[],
    payload: PushNotificationPayload
): Promise<{ success: number; failure: number }> {
    if (!tokens.length) {
        return { success: 0, failure: 0 };
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.warn('Firebase not configured, skipping push notification');
        return { success: 0, failure: tokens.length };
    }

    try {
        const app = getFirebaseAdmin();
        const messaging = app.messaging();

        const message: admin.messaging.MulticastMessage = {
            tokens,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                }
            }
        };

        const response = await messaging.sendEachForMulticast(message);

        console.log(`Push notification sent: ${response.successCount} success, ${response.failureCount} failure`);

        return {
            success: response.successCount,
            failure: response.failureCount
        };
    } catch (error) {
        console.error('Failed to send push notification:', error);
        return { success: 0, failure: tokens.length };
    }
}

// Helper function to send notification to a specific user
export async function sendPushToUser(
    userId: string,
    payload: PushNotificationPayload,
    supabaseAdmin: any
): Promise<boolean> {
    try {
        // Get user's push tokens from database
        const { data: tokens } = await supabaseAdmin
            .from('push_tokens')
            .select('token')
            .eq('user_id', userId);

        if (!tokens || tokens.length === 0) {
            console.log(`No push tokens found for user ${userId}`);
            return false;
        }

        const tokenStrings = tokens.map((t: { token: string }) => t.token);
        const result = await sendPushNotification(tokenStrings, payload);

        return result.success > 0;
    } catch (error) {
        console.error(`Failed to send push to user ${userId}:`, error);
        return false;
    }
}
