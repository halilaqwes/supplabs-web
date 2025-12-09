"use client";

import { useAuth } from "@/context/AuthContext";
import { BadgeCheck, Shield, User, Bell, ChevronRight, ArrowLeft, LogOut, Store } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useRouter } from "next/navigation";

type SettingsView = "main" | "account" | "security" | "admin_bulk" | "store";

export default function SettingsPage() {
    const { user, isLoading, updateUser, startSubscription, logout, claimDailyToken } = useAuth();
    const router = useRouter();
    const [view, setView] = useState<SettingsView>("main");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    // Store view states
    const [isClaiming, setIsClaiming] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

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

    // Store view helper functions
    const canClaimToken = () => {
        if (!user?.lastTokenClaim) return true;
        const lastClaim = new Date(user.lastTokenClaim);
        const now = new Date();
        const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
        return hoursSince >= 24;
    };

    const getTimeRemaining = () => {
        if (!user?.lastTokenClaim) return null;
        const lastClaim = new Date(user.lastTokenClaim);
        const now = new Date();
        const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
        const diff = nextClaim.getTime() - now.getTime();

        if (diff <= 0) return null;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} saat ${minutes} dakika`;
    };

    // Update countdown every minute for store view
    useEffect(() => {
        if (view !== 'store') return;

        const updateTimer = () => {
            setTimeRemaining(getTimeRemaining());
        };
        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [user?.lastTokenClaim, view]);

    const handleClaimToken = async () => {
        if (!user || !canClaimToken()) return;

        setIsClaiming(true);
        try {
            const result = await claimDailyToken();
            if (result.success) {
                alert(`✅ ${result.message}\n\nMevcut bakiyeniz: ${result.tokens} jeton`);
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsClaiming(false);
        }
    };

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

    if (view === "store") {
        return (
            <div className="pb-20">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                    <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Mağaza</h1>
                </div>
                <div className="p-4 space-y-6">
                    {/* Token Balance Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Jeton Bakiyeniz</p>
                                <p className="text-4xl font-bold mt-1">{user?.tokens || 0}</p>
                            </div>
                            <Store size={48} className="opacity-50" />
                        </div>
                    </div>

                    {/* Daily Token Claim */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold mb-2">Günlük Jeton</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Her gün 1 ücretsiz jeton kazanın ve mağazada ürün satın alın!
                        </p>

                        {canClaimToken() ? (
                            <button
                                onClick={handleClaimToken}
                                disabled={isClaiming}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-full transition-colors"
                            >
                                {isClaiming ? 'Alınıyor...' : '🎁 Günlük Jetonunu Al'}
                            </button>
                        ) : (
                            <div className="text-center">
                                <button
                                    disabled
                                    className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-full cursor-not-allowed"
                                >
                                    Zaten Aldınız
                                </button>
                                {timeRemaining && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        ⏰ Bir sonraki jeton: {timeRemaining}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Coming Soon Products */}
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-2xl">
                        <Store className="mx-auto mb-3 text-gray-300" size={48} />
                        <h3 className="font-bold text-gray-600 mb-1">Ürünler Yakında!</h3>
                        <p className="text-sm text-gray-500">Jetonlarınızla satın alabileceğiniz ürünler çok yakında ekleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (view === "admin_bulk") {
        return (
            <div className="pb-20">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                    <button onClick={() => setView("main")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-red-600">Toplu Bildirim Gönder</h1>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                        <strong>Lütfen Dikkat:</strong> Buradan göndereceğiniz mesaj, platformdaki <u>tüm kullanıcılara</u> bildirim olarak iletilecektir. Bu işlem geri alınamaz.
                    </p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

                        if (!message.trim()) return;
                        if (!confirm('Bu bildirimi TÜM kullanıcılara göndermek istediğinizden emin misiniz?')) return;

                        try {
                            const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                            btn.disabled = true;
                            btn.textContent = 'Gönderiliyor...';

                            const response = await fetch('/api/admin/bulk-notification', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user?.id, content: message })
                            });

                            const data = await response.json();

                            if (response.ok) {
                                alert(`Bildirim başarıyla ${data.sentCount} kullanıcıya gönderildi!`);
                                form.reset();
                                setView('main');
                            } else {
                                alert(data.error || 'Bir hata oluştu.');
                            }
                        } catch (error) {
                            console.error(error);
                            alert('İşlem başarısız.');
                        } finally {
                            const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                            if (btn) {
                                btn.disabled = false;
                                btn.textContent = 'Bildirimi Herkese Gönder';
                            }
                        }
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bildirim Mesajı</label>
                            <textarea
                                name="message"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none min-h-[120px]"
                                placeholder="Tüm kullanıcılara gidecek bildirimi yazın..."
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors">
                            Bildirimi Herkese Gönder
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
                    <button onClick={() => setView("store")} className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <Store className="text-gray-500" />
                            <div>
                                <p className="font-medium">Mağaza</p>
                                <p className="text-sm text-gray-500">Supplement satın al</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600" />
                    </button>

                    {/* Admin Panel Link - Only for Admin */}
                    {user && (user.handle === "@supplabs" || user.username === "SuppLabs Resmi") && (
                        <div className="pt-4 border-t border-gray-100 mt-4">
                            <h3 className="font-bold text-lg px-2 mb-2 text-red-500">Yönetici</h3>
                            <Link href="/gizli-yonetici-paneli-x9z" className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors text-left group mb-1">
                                <div className="flex items-center gap-4">
                                    <Shield className="text-red-500" />
                                    <div>
                                        <p className="font-medium text-red-600">Yönetici Paneli</p>
                                        <p className="text-sm text-red-400">Site istatistiklerini görüntüle</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-red-400 group-hover:text-red-600" />
                            </Link>

                            <button onClick={() => setView("admin_bulk")} className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors text-left group">
                                <div className="flex items-center gap-4">
                                    <Bell className="text-red-500" />
                                    <div>
                                        <p className="font-medium text-red-600">Toplu Bildirim</p>
                                        <p className="text-sm text-red-400">Herkese bildirim gönder</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-red-400 group-hover:text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-lg px-2 mb-2">Diğer</h3>
                    <Link href="/legal" className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <Shield className="text-gray-500" />
                            <div>
                                <p className="font-medium">Yasal Bilgilendirme</p>
                                <p className="text-sm text-gray-500">Kullanıcı sözleşmesi ve KVKK</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600" />
                    </Link>
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
