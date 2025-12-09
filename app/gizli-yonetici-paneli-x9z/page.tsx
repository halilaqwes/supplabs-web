"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { Users, Wifi, UserCheck, Clock } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface AdminStats {
    totalUsers: number;
    onlineUsers: number;
}

interface RecentUser {
    id: string;
    username: string;
    avatar: string;
    updated_at: string;
    is_verified: boolean;
    email: string;
}

export default function AdminDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            // Security Check
            // We check for handle '@supplabs' as shown in the user's screenshot
            if (!user || (user.handle !== "@supplabs" && user.username !== "SuppLabs Resmi")) {
                router.push("/feed");
                console.warn("Unauthorized access attempt");
                return;
            }

            fetchStats();
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/admin/stats");
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setRecentUsers(data.recentUsers);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || (isLoading && user?.username === "SuppLabs Resmi")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    // Authorized Content
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
                        <p className="text-gray-500 mt-1">Hoş geldin, {user?.username} 👋</p>
                    </div>
                    <Link href="/feed" className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Siteye Dön
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Online Users */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Çevrimiçi Kullanıcılar</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats?.onlineUsers || 0}</h3>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                <Wifi size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-green-600 font-medium">Canlı Takip</span>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Toplam Üye</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-blue-600 font-medium">
                            Veritabanı Kayıtları
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-gray-400" />
                            Son Aktif Kullanıcılar
                        </h2>
                        <button onClick={fetchStats} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                            Yenile
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Kullanıcı</th>
                                    <th className="px-6 py-4">Son Görülme</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                                        {u.username}
                                                        {u.is_verified && <VerifiedBadge size={14} />}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                                {new Date(u.updated_at).toLocaleString('tr-TR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date().getTime() - new Date(u.updated_at).getTime() < 5 * 60 * 1000 ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Çevrimiçi
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    Çevrimdışı
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                                            {u.id.slice(0, 8)}...
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
