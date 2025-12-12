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
    const [storeProducts, setStoreProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [purchasingProductId, setPurchasingProductId] = useState<string | null>(null);
    const [availableAds, setAvailableAds] = useState({ watched: 0, remaining: 3, canWatch: true });
    const [isWatchingAd, setIsWatchingAd] = useState(false);

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

    // Fetch store products when store view is opened
    useEffect(() => {
        const fetchProducts = async () => {
            if (view !== 'store') return;

            setIsLoadingProducts(true);
            try {
                const response = await fetch('/api/store/products');
                if (response.ok) {
                    const data = await response.json();
                    setStoreProducts(data.products || []);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [view]);

    // Fetch available ads
    useEffect(() => {
        const fetchAvailableAds = async () => {
            if (!user || view !== 'store') return;

            try {
                const response = await fetch(`/api/ads/available?userId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableAds(data);
                }
            } catch (error) {
                console.error('Failed to fetch available ads:', error);
            }
        };

        fetchAvailableAds();
    }, [user, view]);

    const handleWatchAd = async () => {
        if (!user || isWatchingAd) return;

        setIsWatchingAd(true);

        // Load Admaven Pop ad
        const script = document.createElement('script');
        script.src = `//dcbbwymp1bhlf.cloudfront.net/?wbbcd=${process.env.NEXT_PUBLIC_ADMAVEN_POP_ZONE_ID || 'PENDING_POP_ZONE_ID'}`;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');

        document.body.appendChild(script);

        // Wait 10 seconds then claim reward
        setTimeout(async () => {
            try {
                const response = await fetch('/api/ads/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        watchDuration: 10000
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`✅ ${data.message}\n\nYeni bakiyeniz: ${data.newTokenBalance} jeton`);
                    updateUser({ tokens: data.newTokenBalance });
                    // Refresh available ads
                    const adsResponse = await fetch(`/api/ads/available?userId=${user.id}`);
                    if (adsResponse.ok) {
                        const adsData = await adsResponse.json();
                        setAvailableAds(adsData);
                    }
                } else {
                    alert(`❌ ${data.error || 'Bir hata oluştu'}`);
                }
            } catch (error) {
                console.error('Watch ad error:', error);
                alert('❌ Bir hata oluştu.');
            } finally {
                setIsWatchingAd(false);
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            }
        }, 5000); // 5 seconds
    };

    const handlePurchase = async (productId: string, productName: string, price: number) => {
        if (!user) return;

        if ((user.tokens || 0) < price) {
            alert(`Yetersiz jeton! Bu ürün için ${price} jetona ihtiyacınız var.`);
            return;
        }

        if (!confirm(`${productName} ürününü ${price} jetona satın almak istediğinize emin misiniz?`)) {
            return;
        }

        setPurchasingProductId(productId);
        try {
            const response = await fetch('/api/store/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`\u2705 ${data.message}\n\nYeni bakiyeniz: ${data.newTokenBalance} jeton`);
                // Update user tokens in context
                updateUser({ tokens: data.newTokenBalance });
                // Refresh products list to update stock
                const refreshResponse = await fetch('/api/store/products');
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    setStoreProducts(refreshData.products || []);
                }
            } else {
                alert(`\u274c ${data.error || 'Satın alma başarısız'}`);
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setPurchasingProductId(null);
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
                    {/* Token Balance Card - Premium */}
                    <div className="relative overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>

                        <div className="relative rounded-3xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-white/90 tracking-wide">Jeton Bakiyeniz</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-5xl font-black text-white drop-shadow-lg">
                                            {(user?.tokens || 0).toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-md">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></div>
                                            <span className="text-xs font-bold text-white">JETON</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                                    <div className="relative bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            className="w-10 h-10 text-yellow-300 drop-shadow-lg animate-pulse"
                                        >
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
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

                    {/* Video Ad Rewards */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Reklam İzle & Kazan</h2>
                            <div className="bg-purple-100 px-3 py-1 rounded-full">
                                <span className="text-sm font-bold text-purple-600">
                                    {availableAds.watched}/3 İzlendi
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Video reklamları izleyerek günde 3 kez, her seferinde <span className="font-bold text-purple-600">5 jeton</span> kazanabilirsiniz!
                        </p>

                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                style={{ width: `${(availableAds.watched / 3) * 100}%` }}
                            ></div>
                        </div>

                        {availableAds.canWatch ? (
                            <button
                                onClick={handleWatchAd}
                                disabled={isWatchingAd}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {isWatchingAd ? '🎬 Reklam açılıyor...' : `🎬 Reklam İzle (${availableAds.remaining} Kaldı)`}
                            </button>
                        ) : (
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
                                <p className="text-gray-500 font-medium">⏰ Günlük limit doldu</p>
                                <p className="text-xs text-gray-400 mt-1">Yarın tekrar gelin!</p>
                            </div>
                        )}
                    </div>

                    {/* Store Products */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Ürünler</h2>

                        {isLoadingProducts ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : storeProducts.length > 0 ? (
                            <div className="space-y-4">
                                {storeProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                    >
                                        {/* Premium Badge */}
                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                            Premium
                                        </div>

                                        <div className="p-5 flex gap-4">
                                            {/* Product Image - Smaller */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-contain rounded-xl bg-white p-2 shadow-sm"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg mb-1 text-gray-900">{product.name}</h3>
                                                {product.description && (
                                                    <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                                                )}

                                                <div className="flex items-center justify-between gap-3 mt-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                {product.price.toLocaleString()}
                                                            </span>
                                                            <span className="text-sm font-semibold text-gray-500">Jeton</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                                                            <span className="text-xs font-medium text-gray-600">
                                                                {product.stock > 0 ? `${product.stock} adet` : 'Stokta yok'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handlePurchase(product.id, product.name, product.price)}
                                                        disabled={purchasingProductId === product.id || (user?.tokens || 0) < product.price}
                                                        className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${purchasingProductId === product.id
                                                            ? 'bg-gray-300 text-gray-500'
                                                            : (user?.tokens || 0) < product.price
                                                                ? 'bg-gray-200 text-gray-400'
                                                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                                            }`}
                                                    >
                                                        {purchasingProductId === product.id ? 'Alınıyor...' : 'Satın Al'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed border-gray-300 rounded-2xl">
                                <Store className="mx-auto mb-3 text-gray-300" size={48} />
                                <h3 className="font-bold text-gray-600 mb-1">Ürün Stokta Yok</h3>
                                <p className="text-sm text-gray-500">Şu anda satın alınabilir ürün bulunmuyor.</p>
                            </div>
                        )}
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
