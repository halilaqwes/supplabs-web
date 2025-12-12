"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Gift, Play, Clock } from 'lucide-react';
import Link from 'next/link';
import { AdmavenVideoPlayer } from '@/components/ads/AdmavenVideoPlayer';

export default function RewardsPage() {
    const { user, updateUser } = useAuth();
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [availableAds, setAvailableAds] = useState({ watched: 0, remaining: 3, canWatch: true });
    const [isLoading, setIsLoading] = useState(true);

    const fetchAvailableAds = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/ads/available?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableAds(data);
            }
        } catch (error) {
            console.error('Failed to fetch available ads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableAds();
    }, [user]);

    const handleVideoComplete = (tokensEarned: number, newBalance: number) => {
        // Update user tokens in context
        updateUser({ tokens: newBalance });
        // Refresh available ads
        fetchAvailableAds();
        setShowVideoPlayer(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Giriş yapmalısınız</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold">Ödüller</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Balance Card */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 animate-gradient-x"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>

                    <div className="relative rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <p className="text-sm font-medium opacity-90">Toplam Bakiye</p>
                                <p className="text-5xl font-black drop-shadow-lg">{(user.tokens || 0).toLocaleString()}</p>
                                <p className="text-sm opacity-75 mt-1">Jeton</p>
                            </div>
                            <Gift size={56} className="opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Daily Progress */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Günlük İlerleme</h2>
                        <div className="bg-blue-50 px-3 py-1 rounded-full">
                            <span className="text-sm font-bold text-blue-600">
                                {availableAds.watched}/3 İzlendi
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${(availableAds.watched / 3) * 100}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600">
                        {availableAds.remaining > 0
                            ? `${availableAds.remaining} video izleyerek ${availableAds.remaining * 5} jeton daha kazanabilirsiniz!`
                            : 'Bugünlükizleme limitiniz doldu! Yarın tekrar gelin.'}
                    </p>
                </div>

                {/* Watch Video Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                            <Play size={40} className="text-white ml-1" />
                        </div>

                        <div>
                            <h3 className="text-2xl font-black mb-2">Video İzle</h3>
                            <p className="text-gray-600 text-sm">
                                Her video için <span className="font-bold text-purple-600">5 Jeton</span> kazan!
                            </p>
                        </div>

                        {availableAds.canWatch ? (
                            <button
                                onClick={() => setShowVideoPlayer(true)}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? 'Yükleniyor...' : `🎬 Video İzle (${availableAds.remaining} Kaldı)`}
                            </button>
                        ) : (
                            <div className="bg-white rounded-2xl p-4 border border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                    <Clock size={20} />
                                    <span className="font-medium">Günlük limit doldu</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center">Yarın tekrar gelin!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-black text-blue-600">3</p>
                        <p className="text-xs text-gray-500 mt-1">Günlük Limit</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-black text-green-600">5</p>
                        <p className="text-xs text-gray-500 mt-1">Jeton/Video</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-black text-purple-600">15</p>
                        <p className="text-xs text-gray-500 mt-1">Max/Gün</p>
                    </div>
                </div>
            </div>

            {/* Video Player Modal */}
            {showVideoPlayer && (
                <AdmavenVideoPlayer
                    userId={user.id}
                    onComplete={handleVideoComplete}
                    onClose={() => setShowVideoPlayer(false)}
                />
            )}
        </div>
    );
}
