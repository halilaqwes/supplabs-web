"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Sparkles } from "lucide-react";

export function NewYearCountdown() {
    const { user } = useAuth();
    const [brandName, setBrandName] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const voted = localStorage.getItem('hasVoted2026');
        if (voted) setHasVoted(true);

        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date("2026-01-01T00:00:00");
            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleVote = async () => {
        if (!user) {
            alert('Oy kullanmak için giriş yapmalısınız');
            return;
        }
        if (!brandName.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/campaigns/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, brandName })
            });

            if (response.ok) {
                setHasVoted(true);
                localStorage.setItem('hasVoted2026', 'true');
            } else {
                alert('Bir hata oluştu, lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Vote error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] p-1 shadow-2xl mb-8 group ring-1 ring-white/10">
            {/* Animated Border Gradient/Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />

            <div className="relative bg-[#1a1b2e]/60 backdrop-blur-xl rounded-[22px] p-4 md:p-8 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-purple-500/30 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-blue-500/30 rounded-full blur-[80px]" />
                    {/* Stars */}
                    <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-[pulse_3s_infinite]" />
                    <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-[pulse_2s_infinite]" />
                </div>

                {/* Content Container - Vertical Layout for better spacing */}
                <div className="relative z-10 flex flex-col items-center gap-6 text-center">

                    {/* Header & Countdown */}
                    <div className="w-full">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="text-yellow-300 animate-spin-slow" size={20} />
                            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-purple-200">
                                    2026'ya Geri Sayım
                                </span>
                            </h2>
                            <Sparkles className="text-yellow-300 animate-spin-slow" size={20} />
                        </div>

                        <div className="flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative bg-[#0f172a] rounded-xl border border-white/10 p-2 sm:p-5 min-w-[60px] sm:min-w-[90px] shadow-2xl">
                                            <span className="block text-2xl sm:text-4xl font-bold text-white font-mono shadow-black drop-shadow-lg">
                                                {String(value).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-purple-200 uppercase mt-2 tracking-[0.2em] relative z-10 bg-[#1a1b2e]/80 px-2 py-0.5 rounded-full">
                                        {unit === 'days' ? 'Gün' : unit === 'hours' ? 'Saat' : unit === 'minutes' ? 'Dk' : 'Sn'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Survey Section */}
                    <div className="w-full max-w-lg">
                        {hasVoted ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md animate-fade-in transform transition-all hover:scale-[1.02]">
                                <div className="text-4xl mb-3">🎉</div>
                                <h3 className="text-xl font-bold text-white mb-2">Teşekkürler!</h3>
                                <p className="text-purple-200">2026'nın en favori supplement markası oylamasına katıldığın için teşekkürler.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <label className="text-base sm:text-lg text-blue-100 font-medium">
                                    Sizce <span className="text-yellow-400 font-bold">En İyi Supplement</span> Markası Hangisi?
                                </label>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        placeholder="Marka adını buraya yazın..."
                                        className="w-full bg-[#0f172a]/80 border border-purple-500/30 text-white placeholder-gray-500 rounded-xl px-4 py-3 sm:py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner text-sm sm:text-lg"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        onClick={handleVote}
                                        disabled={!brandName.trim() || isSubmitting}
                                        className="absolute right-2 top-2 bottom-2 bg-gradient-to-tr from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg px-3 sm:px-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send size={18} className="sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>
                                {!user && (
                                    <p className="text-[10px] sm:text-xs text-center text-red-300/80">
                                        * Oy vermek için giriş yapmalısınız
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
