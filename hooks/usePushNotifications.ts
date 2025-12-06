"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Check if running in Capacitor
const isCapacitor = () => {
    return typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
};

export function usePushNotifications() {
    const { user } = useAuth();

    useEffect(() => {
        if (!isCapacitor() || !user) return;

        const setupPushNotifications = async () => {
            try {
                const { PushNotifications } = await import('@capacitor/push-notifications');

                // Request permission
                const permResult = await PushNotifications.requestPermissions();

                if (permResult.receive === 'granted') {
                    // Register for push
                    await PushNotifications.register();

                    // Listen for registration
                    await PushNotifications.addListener('registration', async (token) => {
                        console.log('Push registration success, token: ' + token.value);

                        // Send token to backend
                        try {
                            await fetch('/api/push-token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userId: user.id,
                                    token: token.value,
                                    platform: 'android'
                                })
                            });
                        } catch (error) {
                            console.error('Failed to register push token:', error);
                        }
                    });

                    // Listen for push notifications
                    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                        console.log('Push notification received: ', notification);
                    });

                    // Listen for notification actions
                    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                        console.log('Push notification action performed', notification.actionId, notification.inputValue);
                    });
                } else {
                    console.log('Push notification permission denied');
                }
            } catch (error) {
                console.error('Error setting up push notifications:', error);
            }
        };

        setupPushNotifications();

        // Cleanup listeners on unmount
        return () => {
            if (isCapacitor()) {
                import('@capacitor/push-notifications').then(({ PushNotifications }) => {
                    PushNotifications.removeAllListeners();
                });
            }
        };
    }, [user]);
}
