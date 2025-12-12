"use client";

import { useState, useEffect, useRef } from 'react';

interface AdmavenPopAdProps {
    userId: string;
    onComplete: (tokensEarned: number, newBalance: number) => void;
    onAdOpened?: () => void;
}

export function AdmavenPopAd({ userId, onComplete, onAdOpened }: AdmavenPopAdProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const popupRef = useRef<Window | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, []);

    const handleWatchAd = () => {
        if (isProcessing) return;

        // Load Admaven Pop script and trigger
        const script = document.createElement('script');
        script.src = `//dcbbwymp1bhlf.cloudfront.net/?wbbcd=${process.env.NEXT_PUBLIC_ADMAVEN_POP_ZONE_ID || 'YOUR_POP_ZONE_ID'}`;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');

        script.onload = () => {
            onAdOpened?.();
            // Start watching for popup close
            startWatchingPopup();
        };

        document.body.appendChild(script);

        // Clean up script after load
        setTimeout(() => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }, 5000);
    };

    const startWatchingPopup = () => {
        setIsProcessing(true);

        // Check popup status every second
        checkIntervalRef.current = setInterval(async () => {
            // After 10 seconds, assume ad was watched (user saw popup)
            // This is a simplified approach - better would be Admaven callback
            clearInterval(checkIntervalRef.current!);
            await claimReward();
        }, 10000); // 10 seconds minimum
    };

    const claimReward = async () => {
        try {
            const response = await fetch('/api/ads/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    watchDuration: 10000 // 10 seconds
                })
            });

            const data = await response.json();

            if (response.ok) {
                onComplete(data.tokensEarned, data.newBalance);
            } else {
                alert(`❌ ${data.error || 'Bir hata oluştu'}`);
            }
        } catch (error) {
            console.error('Claim reward error:', error);
            alert('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        handleWatchAd,
        isProcessing
    };
}
