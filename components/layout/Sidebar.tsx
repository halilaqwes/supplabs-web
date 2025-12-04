"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, User, Settings, Dumbbell, LogOut, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

const NAV_ITEMS = [
    { label: "Anasayfa", href: "/feed", icon: Home },
    { label: "Supplementler", href: "/supplements", icon: Dumbbell },
    { label: "Bildirimler", href: "/notifications", icon: Bell },
    { label: "Profil", href: "/profile", icon: User },
    { label: "Ayarlar", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-screen sticky top-0 px-4 py-6 border-r border-gray-200 w-[275px]">
                <div className="mb-8 px-4">
                    <Link href="/feed">
                        <img src="/logo.jpg" alt="SuppLabs Logo" className="w-12 h-12 object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.filter(item => {
                        // Hide Bildirimler and Ayarlar if user is not logged in
                        if (!user && (item.label === "Bildirimler" || item.label === "Ayarlar")) {
                            return false;
                        }
                        return true;
                    }).map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        // Handle Profile link dynamically if user is logged in
                        const href = item.label === "Profil"
                            ? (user ? `/profile/${encodeURIComponent(user.username)}` : "/login")
                            : item.href;

                        return (
                            <Link
                                key={item.href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 text-xl rounded-full transition-colors hover:bg-gray-100",
                                    isActive ? "font-bold" : "font-medium"
                                )}
                            >
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 z-50">
                {/* Left Side Items */}
                <div className="flex gap-8">
                    {NAV_ITEMS.slice(0, 2).map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1",
                                    isActive ? "text-blue-500" : "text-gray-500"
                                )}
                            >
                                <Icon size={24} className={cn(isActive && "fill-current")} />
                            </Link>
                        );
                    })}
                </div>

                {/* Center FAB */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <button className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                        <PlusSquare size={24} />
                    </button>
                </div>

                {/* Right Side Items */}
                <div className="flex gap-8">
                    {NAV_ITEMS.slice(2).filter(item => {
                        // Hide Bildirimler and Ayarlar if user is not logged in
                        if (!user && (item.label === "Bildirimler" || item.label === "Ayarlar")) {
                            return false;
                        }
                        return true;
                    }).map((item) => {
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
                                    "flex flex-col items-center gap-1",
                                    isActive ? "text-blue-500" : "text-gray-500"
                                )}
                            >
                                <Icon size={24} className={cn(isActive && "fill-current")} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
