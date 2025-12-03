"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    login: (userData: { email: string; password: string }) => Promise<void>;
    register: (userData: { email: string; password: string; name: string; surname: string; username: string; handle: string }) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    startSubscription: () => void;
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
                followerIds: []
            };

            setUser(normalizedUser);
            localStorage.setItem("supplabs_user", JSON.stringify(normalizedUser));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: { email: string; password: string; name: string; surname: string; username: string; handle: string }) => {
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
                followerIds: []
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

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, startSubscription, isLoading }}>
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
