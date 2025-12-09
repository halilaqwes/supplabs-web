"use client";

import { useState, useEffect } from "react";
import { X, Cookie as CookieIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Show after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-blue-100 p-3 rounded-full hidden md:block">
                        <CookieIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Çerez Kullanımı</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Sizlere daha iyi hizmet sunabilmek, site trafiğini analiz etmek ve deneyiminizi kişiselleştirmek için çerezler (cookies) kullanıyoruz.
                            Gezintiyie devam ederek çerez kullanımını kabul etmiş olursunuz.
                            <a href="/legal/" className="text-blue-600 hover:underline ml-1 font-medium">
                                Detaylı Bilgi
                            </a>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        Reddet
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-lg"
                    >
                        Kabul Et
                    </button>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
