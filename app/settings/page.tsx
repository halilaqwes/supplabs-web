"use client";

import { useAuth } from "@/context/AuthContext";
import { BadgeCheck, Shield, User, Bell, ChevronRight, ArrowLeft, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useRouter } from "next/navigation";

type SettingsView = "main" | "account" | "security";

export default function SettingsPage() {
    const { user, isLoading, updateUser, startSubscription, logout } = useAuth();
    const router = useRouter();
    const [view, setView] = useState<SettingsView>("main");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            setIsSubscribed(user.isVerified || false);
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    if (isLoading || !user) {
        return null; // Or a loading spinner
    }

    const handleSubscribe = async () => {
        if (!user) return;
        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (response.ok) {
                startSubscription(); // Update local context
                setIsSubscribed(true);
                alert("Tebrikler! Artık SuppLabs'in onaylı bir üyesisiniz.");
            } else {
                alert("Abonelik işlemi başarısız oldu.");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Bir hata oluştu.");
        }
    };

    const handleSaveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser({ username, email }); // Email update might need backend support if we want to change auth email too
            alert("Hesap bilgileri güncellendi!");
            setView("main");
        } catch (error) {
            alert("Güncelleme başarısız oldu.");
        }
    };

    const handleSaveSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (newPassword.length < 6) {
            alert("Yeni şifre en az 6 karakter olmalıdır.");
            return;
        }

        try {
            const response = await fetch('/api/auth/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Şifreniz başarıyla değiştirildi!");
                setView("main");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                alert(data.error || "Şifre değiştirilemedi.");
            }
        } catch (error) {
            console.error("Password change error:", error);
            alert("Bir hata oluştu.");
        }
    };

    if (view === "account") {
        return (
            <div className="pb-20">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                    <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Hesap Bilgileri</h1>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSaveAccount} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
                            <textarea
                                defaultValue={user?.bio || ''}
                                onChange={(e) => {
                                    // Just update local input, not global state yet
                                }}
                                onBlur={(e) => {
                                    // Update when user finishes typing (loses focus)
                                    if (e.target.value.length <= 160) {
                                        updateUser({ bio: e.target.value });
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Kendinizden bahsedin..."
                                rows={3}
                                maxLength={160}
                            />
                            <p className="text-xs text-gray-500 mt-1">Maksimum 160 karakter</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-full hover:bg-blue-600 transition-colors">
                            Kaydet
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (view === "security") {
        return (
            <div className="pb-20">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                    <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Güvenlik ve Erişim</h1>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSaveSecurity} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-full hover:bg-blue-600 transition-colors">
                            Şifreyi Değiştir
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h1 className="text-xl font-bold">Ayarlar</h1>
            </div>

            <div className="p-4 space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <VerifiedBadge />
                        Onaylı Hesap Al
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Mavi tik almak, yanıtlarınızı öne çıkarmak ve platformu desteklemek için SuppLabs Premium'a abone olun.
                    </p>
                    {isSubscribed ? (
                        <button disabled className="w-full bg-green-500 text-white font-bold py-3 rounded-full opacity-80 cursor-default">
                            Hesabınız Onaylı!
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            className="w-full bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Ücretsiz Dene!
                        </button>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-lg px-2 mb-2">Hesap</h3>
                    <button onClick={() => setView("account")} className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <User className="text-gray-500" />
                            <div>
                                <p className="font-medium">Hesap Bilgileri</p>
                                <p className="text-sm text-gray-500">Hesap verilerinizi görüntüleyin</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600" />
                    </button>
                    <button onClick={() => setView("security")} className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <Shield className="text-gray-500" />
                            <div>
                                <p className="font-medium">Güvenlik ve Erişim</p>
                                <p className="text-sm text-gray-500">Güvenliğinizi yönetin</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <div className="mt-6 px-2">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-500 font-semibold">
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
