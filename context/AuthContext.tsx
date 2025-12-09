"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    login: (userData: { email: string; password: string }) => Promise<void>;
    register: (userData: { email: string; password: string; username: string }) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    startSubscription: () => void;
    claimDailyToken: () => Promise<{ success: boolean; message: string; tokens?: number }>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("supplabs_user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.subscriptionEndDate) {
                    const endDate = new Date(parsedUser.subscriptionEndDate);
                    if (new Date() > endDate) {
                        parsedUser.isVerified = false;
                        parsedUser.subscriptionEndDate = undefined;
                        localStorage.setItem("supplabs_user", JSON.stringify(parsedUser));
                    }
                }
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        setIsLoading(false);
    }, []);

    // Heartbeat System: Update online status every 5 minutes
    useEffect(() => {
        if (!user) return;

        const sendPing = async () => {
            try {
                await fetch('/api/auth/ping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
            } catch (error) {
                // Silently fail for heartbeat
                console.warn('Heartbeat failed', error);
            }
        };

        // Initial ping on login/load
        sendPing();

        // Ping every 5 minutes
        const intervalId = setInterval(sendPing, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [user]);

    const login = async (userData: { email: string; password: string }) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Giriş başarısız');
            }

            const normalizedUser: User = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.username,
                handle: data.user.handle,
                avatar: data.user.avatar,
                bio: data.user.bio || '',
                isVerified: data.user.isVerified || false,
                followers: data.user.followers || 0,
                following: data.user.following || 0,
                followingIds: [],
                followerIds: [],
                tokens: data.user.tokens || 0,
                lastTokenClaim: data.user.last_token_claim
            };

            setUser(normalizedUser);
            localStorage.setItem("supplabs_user", JSON.stringify(normalizedUser));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: { email: string; password: string; username: string }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kayıt başarısız');
            }

            const normalizedUser: User = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.username,
                handle: data.user.handle,
                avatar: data.user.avatar,
                bio: data.user.bio || '',
                isVerified: data.user.is_verified || false,
                followers: 0,
                following: 0,
                followingIds: [],
                followerIds: [],
                tokens: data.user.tokens || 0,
                lastTokenClaim: data.user.last_token_claim
            };

            setUser(normalizedUser);
            localStorage.setItem("supplabs_user", JSON.stringify(normalizedUser));
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("supplabs_user");
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...updates })
            });

            if (response.ok) {
                const updatedUser = { ...user, ...updates };
                setUser(updatedUser);
                localStorage.setItem("supplabs_user", JSON.stringify(updatedUser));
            } else {
                console.error("Failed to update profile");
                throw new Error("Profil güncellenemedi");
            }
        } catch (error) {
            console.error("Update user error:", error);
            throw error;
        }
    };

    const startSubscription = () => {
        if (!user) return;

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const updatedUser = {
            ...user,
            isVerified: true,
            subscriptionEndDate: endDate.toISOString()
        };

        setUser(updatedUser);
        localStorage.setItem("supplabs_user", JSON.stringify(updatedUser));
    };

    const claimDailyToken = async () => {
        if (!user) return { success: false, message: 'Kullanıcı bulunamadı' };

        try {
            const response = await fetch('/api/tokens/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            const data = await response.json();

            if (response.ok) {
                // Update user with new token balance
                const updatedUser = {
                    ...user,
                    tokens: data.tokens,
                    lastTokenClaim: data.lastTokenClaim
                };
                setUser(updatedUser);
                localStorage.setItem("supplabs_user", JSON.stringify(updatedUser));
                return { success: true, message: data.message, tokens: data.tokens };
            } else {
                return { success: false, message: data.error || 'Jeton alınamadı' };
            }
        } catch (error) {
            console.error('Token claim error:', error);
            return { success: false, message: 'Bir hata oluştu' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, startSubscription, claimDailyToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
