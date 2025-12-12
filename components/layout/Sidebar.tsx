"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, User, Settings, Dumbbell, LogOut, PlusSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useNotifications } from "@/context/NotificationContext";

const NAV_ITEMS = [
    { label: "Anasayfa", href: "/feed", icon: Home },
    { label: "Ara", href: "/search", icon: Search },
    { label: "Supplementler", href: "/supplements", icon: Dumbbell },
    { label: "Bildirimler", href: "/notifications", icon: Bell },
    { label: "Profil", href: "/profile", icon: User },
    { label: "Ayarlar", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();

    // Mobile Bottom Nav Items (Max 5)
    // Anasayfa - Ara - Supplementler - Bildirimler - Profil
    const MOBILE_NAV_LABELS = ["Anasayfa", "Ara", "Supplementler", "Bildirimler", "Profil"];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-screen sticky top-0 px-4 py-6 border-r border-gray-200 w-[275px]">
                <div className="mb-8 px-4">
                    <Link href="/feed">
                        <img src="/logo-icon.png" alt="SuppLabs Logo" className="w-12 h-12 object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        // Desktop Specific: Hide "Ara" because it exists in top-right
                        if (item.label === "Ara") return null;

                        // Hide Bildirimler and Ayarlar if user is not logged in
                        if (!user && (item.label === "Bildirimler" || item.label === "Ayarlar")) {
                            return null;
                        }

                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        // Handle Profile link dynamically
                        const href = item.label === "Profil"
                            ? (user ? `/profile/${encodeURIComponent(user.username)}` : "/login")
                            : item.href;

                        return (
                            <Link
                                key={item.href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 text-xl rounded-full transition-colors hover:bg-gray-100 relative",
                                    isActive ? "font-bold" : "font-medium"
                                )}
                            >
                                {item.label === "Bildirimler" && unreadCount > 0 && (
                                    <span className="absolute left-7 top-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white z-10 pointer-events-none">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                                <Icon className={cn("w-7 h-7", isActive && "fill-current")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {user && (
                        <button
                            onClick={logout}
                            className="flex items-center gap-4 px-4 py-3 text-xl rounded-full transition-colors hover:bg-red-50 text-red-500 font-medium mt-2"
                        >
                            <LogOut className="w-7 h-7" />
                            <span>Çıkış Yap</span>
                        </button>
                    )}
                </nav>

                {user && (
                    <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 cursor-pointer group relative">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <p className="font-bold truncate">{user.username}</p>
                                {user.isVerified && <VerifiedBadge size={16} />}
                            </div>
                            <p className="text-gray-500 truncate text-sm">{user.handle}</p>
                        </div>
                        <div className="absolute bottom-full left-0 w-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-xl border p-2">
                            <button onClick={logout} className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg text-red-500">
                                <LogOut size={18} />
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-between items-center px-4 py-3 z-50 safe-area-bottom">
                {NAV_ITEMS.filter(item => MOBILE_NAV_LABELS.includes(item.label)).map((item) => {
                    const Icon = item.icon;
                    // Strict active check for home to avoid highlighting on sub-pages if not desired, or use startsWith
                    const isActive = pathname === item.href;

                    // Handle Profile link dynamically
                    const href = item.label === "Profil"
                        ? (user ? `/profile/${encodeURIComponent(user.username)}` : "/login")
                        : item.href;

                    // Hide Notifications if not logged in
                    if (!user && item.label === "Bildirimler") return null;

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                                isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <div className="relative">
                                {item.label === "Bildirimler" && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white z-10 pointer-events-none">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                                <Icon size={26} className={cn(isActive && "fill-current")} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
