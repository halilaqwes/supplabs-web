"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Post as PostType } from "@/types";
import { Post } from "@/components/social/Post";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "posts" | "replies" | "media" | "likes";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username: rawUsername } = React.use(params);
    const username = decodeURIComponent(rawUsername);
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("posts");
    const [showFollowModal, setShowFollowModal] = useState<"followers" | "following" | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [likedPosts, setLikedPosts] = useState<PostType[]>([]);

    const isCurrentUser = user?.username === username;

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            // Fetch user profile
            // The param 'username' is actually the handle from the URL (without @)
            // We need to tell the API to search by handle OR username
            // Ideally we pass a query param or the API handles it.
            // Let's assume the API will be updated to search by handle if it starts with @ or just matches handle.
            // Since we removed @ from URL, we might want to add it back for search if we search by handle.
            // But let's update the API to be smart.
            const userRes = await fetch(`/api/users/${username}`);
            if (!userRes.ok) {
                if (userRes.status === 404) return null;
                throw new Error("Failed to fetch user");
            }
            const userData = await userRes.json();
            setProfileUser(userData.user);
            setFollowersCount(userData.user.followers || 0);
            setFollowingCount(userData.user.following || 0);

            // Check if following
            if (user && userData.user.id !== user.id) {
                // In a real app, we should have an endpoint to check this efficiently
                // For now, we rely on the user object's followingIds if available, 
                // or we could fetch the follow status. 
                // Let's assume user.followingIds is updated or we can check via API if needed.
                // Since we don't have a specific "check follow" endpoint, we'll rely on client side check if possible
                // or add an endpoint. For now, let's assume user.followingIds is accurate enough or 
                // we can fetch the relationship status.
                // Actually, let's just use the user context for now if available.
                setIsFollowing(user.followingIds?.includes(userData.user.id) || false);
            }

            // Fetch user posts
            const postsRes = await fetch(`/api/users/${username}/posts`);
            if (postsRes.ok) {
                const postsData = await postsRes.json();
                setPosts(postsData.posts);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [username, user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (activeTab === 'likes' && username) {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/users/${username}/likes`);
                    if (response.ok) {
                        const data = await response.json();
                        setLikedPosts(data.posts);
                    }
                } catch (error) {
                    console.error("Failed to fetch liked posts", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchLikedPosts();
    }, [activeTab, username]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!profileUser) return notFound();

    const handleFollowAction = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${username}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: user.id })
            });

            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.following);
                setFollowersCount(prev => data.following ? prev + 1 : prev - 1);

                // Update local user context if needed
                // updateUser({ followingIds: ... }) - this would require more complex logic
            }
        } catch (error) {
            console.error("Follow action failed:", error);
        }
    };

    const handleAvatarClick = () => {
        if (isCurrentUser) {
            fileInputRef.current?.click();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            // In real app, upload to server
            // For now just update local state via API
            // updateUser({ avatar: url });
            // We need an API to update profile
        }
    };

    const getFilteredPosts = () => {
        switch (activeTab) {
            case "posts":
                return posts;
            case "replies":
                return []; // We don't fetch replies yet
            case "media":
                return posts.filter(p => p.image || p.video);
            case "likes":
                return likedPosts;
            default:
                return [];
        }
    };

    const filteredPosts = getFilteredPosts();

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-bold text-xl flex items-center gap-1">
                        {profileUser.username}
                        {profileUser.isVerified && <VerifiedBadge size={16} />}
                    </h1>
                    <p className="text-gray-500 text-sm">{posts.length} gönderi</p>
                </div>
            </div>

            <div className="relative">
                <div className="h-32 bg-blue-500"></div>
                <div className="absolute -bottom-16 left-4">
                    <div className="relative group">
                        <img
                            src={profileUser.avatar}
                            alt={profileUser.username}
                            className={`w-32 h-32 rounded-full border-4 border-white object-cover bg-white ${isCurrentUser ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                            onClick={handleAvatarClick}
                        />
                        {isCurrentUser && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="text-white text-xs font-bold">Değiştir</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
                <div className="flex justify-end p-4">
                    {isCurrentUser ? (
                        <Link href="/settings" className="px-4 py-2 border border-gray-300 rounded-full font-bold hover:bg-gray-50 transition-colors">
                            Profili Düzenle
                        </Link>
                    ) : (
                        <button
                            onClick={handleFollowAction}
                            className={cn(
                                "px-4 py-2 rounded-full font-bold transition-colors",
                                isFollowing
                                    ? "border border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                                    : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {isFollowing ? "Takibi Bırak" : "Takip Et"}
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-16 px-4">
                <div className="flex items-center gap-1 mb-1">
                    <h2 className="font-bold text-xl">{profileUser.username}</h2>
                    {profileUser.isVerified && <VerifiedBadge />}
                </div>
                <p className="text-gray-500 mb-4">{profileUser.handle}</p>
                <p className="mb-4">{profileUser.bio || "Henüz biyografi eklenmemiş."}</p>

                <div className="flex gap-4 mb-6">
                    <button className="hover:underline">
                        <span className="font-bold">{followingCount}</span> <span className="text-gray-500"> Takip Edilen</span>
                    </button>
                    <button className="hover:underline">
                        <span className="font-bold">{followersCount}</span> <span className="text-gray-500"> Takipçi</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 border-b border-gray-200">
                <div className="flex">
                    {["posts", "replies", "media", "likes"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as Tab)}
                            className="flex-1 py-4 font-medium text-gray-500 hover:bg-gray-50 transition-colors relative capitalize"
                        >
                            <span className={cn(activeTab === tab && "font-bold text-black")}>
                                {tab === "posts" && "Gönderiler"}
                                {tab === "replies" && "Yanıtlar"}
                                {tab === "media" && "Medya"}
                                {tab === "likes" && "Beğeniler"}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Post key={post.id} post={post} onUpdate={fetchProfile} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        {activeTab === "posts" && "Henüz gönderi yok."}
                        {activeTab === "replies" && "Henüz yanıt yok."}
                        {activeTab === "media" && "Henüz medya yok."}
                        {activeTab === "likes" && "Henüz beğenilen gönderi yok."}
                    </div>
                )}
            </div>
        </div>
    );
}
