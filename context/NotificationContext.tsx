"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshUnreadCount = useCallback(async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            const response = await fetch(`/api/notifications/unread-count?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error("Failed to fetch notification count", error);
        }
    }, [user]);

    useEffect(() => {
        refreshUnreadCount();

        // Optional: Poll every minute or set up realtime subscription if needed later
        // For now, simple polling ensuring it stays fresh enough
        const interval = setInterval(refreshUnreadCount, 60000); // 1 minute
        return () => clearInterval(interval);
    }, [refreshUnreadCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
