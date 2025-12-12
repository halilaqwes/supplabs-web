"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AdmavenVideoPlayerProps {
    userId: string;
    onComplete: (tokensEarned: number, newBalance: number) => void;
    onClose: () => void;
}

export function AdmavenVideoPlayer({ userId, onComplete, onClose }: AdmavenVideoPlayerProps) {
    const [watchTime, setWatchTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [canClaim, setCanClaim] = useState(false);
    const watchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    const MIN_WATCH_TIME = 15; // 15 seconds minimum

    useEffect(() => {
        // Start watch timer
        startTimeRef.current = Date.now();

        watchTimerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setWatchTime(elapsed);

            if (elapsed >= MIN_WATCH_TIME) {
                setCanClaim(true);
            }
        }, 1000);

        // Load Admaven Interstitial script
        const script = document.createElement('script');
        script.src = `//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1230036`;
        script.async = true;
        document.body.appendChild(script);

        script.setAttribute('data-cfasync', 'false');

        return () => {
            if (watchTimerRef.current) {
                clearInterval(watchTimerRef.current);
            }
            document.body.removeChild(script);
        };
    }, []);

    const handleClaimReward = async () => {
        if (!canClaim || isProcessing) return;

        setIsProcessing(true);
        const totalWatchTime = Date.now() - startTimeRef.current;

        try {
            const response = await fetch('/api/ads/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    watchDuration: totalWatchTime
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ ${data.message}\n\nYeni bakiyeniz: ${data.newBalance} jeton`);
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

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between text-white">
                    <div>
                        <h3 className="font-bold text-lg">Video Reklam</h3>
                        <p className="text-sm opacity-90">
                            {canClaim ? '✅ Ödül almaya hazır!' : `⏱️ ${watchTime}/${MIN_WATCH_TIME}s`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Video Container */}
                <div className="relative bg-black aspect-video flex items-center justify-center">
                    {/* Admaven Ad Placeholder */}
                    <div id="admaven-video-container" className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                            <p className="text-lg font-medium">Reklam Yükleniyor...</p>
                            <p className="text-sm opacity-75 mt-2">Lütfen bekleyin</p>
                        </div>
                    </div>
                </div>

                {/* Progress & Claim */}
                <div className="p-6 space-y-4">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">İzleme İlerlemesi</span>
                            <span className="font-bold text-purple-600">
                                {Math.min(100, (watchTime / MIN_WATCH_TIME) * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                style={{ width: `${Math.min(100, (watchTime / MIN_WATCH_TIME) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Claim Button */}
                    <button
                        onClick={handleClaimReward}
                        disabled={!canClaim || isProcessing}
                        className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${canClaim && !isProcessing
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                İşleniyor...
                            </span>
                        ) : canClaim ? (
                            '🎁 5 Jeton Al'
                        ) : (
                            `⏳ ${MIN_WATCH_TIME - watchTime} saniye daha izleyin`
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        Ödülü alabilmek için videoyu en az {MIN_WATCH_TIME} saniye izlemelisiniz
                    </p>
                </div>
            </div>
        </div>
    );
}

// Extend Window type for Admaven
declare global {
    interface Window {
        atOptions: any;
    }
}
