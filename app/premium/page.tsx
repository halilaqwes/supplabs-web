"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Shield, Compass, Star } from "lucide-react";

export default function PremiumPage() {
    const { user, login, updateUser, startSubscription } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(user?.isVerified || false);

    const handleSubscribe = () => {
        if (user?.hasUsedTrial) {
            alert("Deneme sürenizi zaten kullandınız.");
            return;
        }
        startSubscription();
        setIsSubscribed(true);
        alert("Mavi tik başarıyla aktif edildi! (30 Gün Ücretsiz)");
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">SuppLabs Premium</h1>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-center mb-6">
                    <CheckCircle size={64} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Mavi Tik Rozeti</h2>
                <p className="text-center text-blue-100 mb-8">Hesabınızı doğrulayın ve ayrıcalıkların tadını çıkarın.</p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Shield size={20} />
                        </div>
                        <p>Maksimum hesap güvenliği</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Star size={20} />
                        </div>
                        <p>Supplement doktorum ile birebir iletişim</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Compass size={20} />
                        </div>
                        <p>Keşfet önceliği</p>
                    </div>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={isSubscribed}
                    className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    {isSubscribed ? "Aktif" : "Ücretsiz Dene!"}
                </button>
                <p className="text-center text-xs text-blue-200 mt-4">30 gün boyunca ücretsiz, sonra iptal edebilirsiniz.</p>
            </div>
        </div>
    );
}
