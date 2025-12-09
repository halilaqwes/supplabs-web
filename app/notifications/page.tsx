"use client";

import { useStore } from "@/context/StoreContext";
import { Heart, UserPlus, MessageCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useNotifications } from "@/context/NotificationContext";

export default function NotificationsPage() {
    const { notifications, markNotificationsRead, posts } = useStore();
    const { refreshUnreadCount } = useNotifications();
    const router = useRouter();

    useEffect(() => {
        const syncReadStatus = async () => {
            await markNotificationsRead();
            await refreshUnreadCount();
        };
        syncReadStatus();
    }, []);

    // Helper to check if a notification is a system announcement
    const isSystemAnnouncement = (notification: any) => {
        return notification.post?.content?.includes('[SYSTEM_HIDDEN]');
    };

    const getIcon = (notification: any) => {
        if (isSystemAnnouncement(notification)) {
            return <Megaphone className="text-red-500" size={20} />;
        }

        switch (notification.type) {
            case "like": return <Heart className="fill-red-500 text-red-500" size={20} />;
            case "follow": return <UserPlus className="text-blue-500" size={20} />;
            case "reply": return <MessageCircle className="text-green-500" size={20} />;
            default: return null;
        }
    };

    const getMessage = (notification: any) => {
        if (isSystemAnnouncement(notification)) {
            return "önemli bir duyuru yayınladı";
        }

        switch (notification.type) {
            case "like": return "gönderini beğendi";
            case "follow": return "seni takip etti";
            case "reply": return "gönderine yanıt verdi";
            default: return "";
        }
    };

    const handleNotificationClick = (notification: any) => {
        if (isSystemAnnouncement(notification)) {
            // Sistem bildirimleri için yönlendirme yapma (zaten içerik görünüyor)
            return;
        }

        if (notification.postId) {
            // Post varsa post sayfasına git
            const post = posts.find(p => p.id === notification.postId);
            if (post) {
                router.push(`/feed`); // Şimdilik feed'e gidiyor
            }
        } else {
            // Follow bildirimi ise profile sayfasına git
            router.push(`/profile/${notification.fromUser.username}`);
        }
    };

    return (
        <div className="pb-20">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h1 className="text-xl font-bold">Bildirimler</h1>
            </div>

            <div className="divide-y divide-gray-100">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/50" : ""}`}
                        >
                            <div className="mt-1">
                                {getIcon(notification)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src={notification.fromUser.avatar} alt={notification.fromUser.username} className="w-8 h-8 rounded-full" />
                                    <p className="text-sm">
                                        <span className="font-bold">
                                            {notification.fromUser.username}
                                        </span>{" "}
                                        {getMessage(notification)}
                                    </p>
                                </div>

                                {notification.post?.content && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        "{notification.post.content.replace('[SYSTEM_HIDDEN] ', '')}"
                                    </p>
                                )}

                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Henüz bildiriminiz yok.
                    </div>
                )}
            </div>
        </div>
    );
}
