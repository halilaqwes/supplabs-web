"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Post as PostType } from "@/types";
import { Post } from "@/components/social/Post";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { OfficialBadge } from "@/components/ui/OfficialBadge";
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "posts" | "replies" | "media" | "likes";

interface FollowUser {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
}

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
    const [followersList, setFollowersList] = useState<FollowUser[]>([]);
    const [followingList, setFollowingList] = useState<FollowUser[]>([]);

    const isCurrentUser = user?.id === profileUser?.id;

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            // Fetch user profile
            const userRes = await fetch(`/api/users/${username}`);
            if (!userRes.ok) {
                if (userRes.status === 404) return null;
                throw new Error("Failed to fetch user");
            }
            const userData = await userRes.json();
            setProfileUser(userData.user);
            setFollowersCount(userData.user.followers || 0);
            setFollowingCount(userData.user.following || 0);

            // Check follow status from API
            if (user && userData.user.id !== user.id) {
                const statusRes = await fetch(`/api/users/${username}/follow-status?userId=${user.id}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    setIsFollowing(statusData.isFollowing);
                }
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

    // Fetch followers list
    useEffect(() => {
        const fetchFollowers = async () => {
            if (showFollowModal === 'followers') {
                try {
                    const response = await fetch(`/api/users/${username}/followers`);
                    if (response.ok) {
                        const data = await response.json();
                        setFollowersList(data.followers);
                    }
                } catch (error) {
                    console.error("Failed to fetch followers", error);
                }
            }
        };
        fetchFollowers();
    }, [showFollowModal, username]);

    // Fetch following list
    useEffect(() => {
        const fetchFollowing = async () => {
            if (showFollowModal === 'following') {
                try {
                    const response = await fetch(`/api/users/${username}/following`);
                    if (response.ok) {
                        const data = await response.json();
                        setFollowingList(data.following);
                    }
                } catch (error) {
                    console.error("Failed to fetch following", error);
                }
            }
        };
        fetchFollowing();
    }, [showFollowModal, username]);

    if (isLoading && !profileUser) {
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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Lütfen bir resim dosyası seçin');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        try {
            setIsLoading(true);

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.id);

            // Upload to API
            const response = await fetch('/api/users/upload-avatar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            // Update local state
            if (profileUser) {
                setProfileUser({ ...profileUser, avatar: data.avatar });
            }

            // Update user context
            updateUser({ avatar: data.avatar });

            alert('Profil resmi güncellendi!');

        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('Resim yüklenemedi. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    const getFilteredPosts = () => {
        switch (activeTab) {
            case "posts":
                return posts;
            case "replies":
                return [];
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
                        {profileUser.isOfficial && <OfficialBadge size={18} />}
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
                    {profileUser.isOfficial && <OfficialBadge size={22} />}
                </div>
                <p className="text-gray-500 mb-4">{profileUser.handle}</p>
                <div className="mb-4">
                    {profileUser.bio ? (
                        profileUser.bio.split(/(\bhttps?:\/\/[^\s]+)/g).map((part, index) => {
                            if (part.match(/^https?:\/\//)) {
                                return (
                                    <a
                                        key={index}
                                        href={part}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {part}
                                    </a>
                                );
                            }
                            return <span key={index}>{part}</span>;
                        })
                    ) : (
                        <span className="text-gray-500">Henüz biyografi eklenmemiş.</span>
                    )}
                </div>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => {
                            if (profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id) {
                                return; // Block for official accounts (non-admin)
                            }
                            setShowFollowModal('following');
                        }}
                        className={profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id ? '' : 'hover:underline'}
                    >
                        <span className="font-bold">
                            {profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id ? '-' : followingCount}
                        </span>
                        <span className="text-gray-500"> Takip Edilen</span>
                    </button>
                    <button
                        onClick={() => {
                            if (profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id) {
                                return; // Block for official accounts (non-admin)
                            }
                            setShowFollowModal('followers');
                        }}
                        className={profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id ? '' : 'hover:underline'}
                    >
                        <span className="font-bold">
                            {profileUser.isOfficial && user?.role !== 'admin' && user?.id !== profileUser.id ? '-' : followersCount}
                        </span>
                        <span className="text-gray-500"> Takipçi</span>
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

            {/* Follow Modal */}
            {showFollowModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFollowModal(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {showFollowModal === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
                            </h2>
                            <button
                                onClick={() => setShowFollowModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                            {(showFollowModal === 'followers' ? followersList : followingList).length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {(showFollowModal === 'followers' ? followersList : followingList).map((followUser) => (
                                        <Link
                                            key={followUser.id}
                                            href={`/profile/${followUser.username}`}
                                            onClick={() => setShowFollowModal(null)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <img
                                                src={followUser.avatar}
                                                alt={followUser.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold truncate">{followUser.username}</span>
                                                    {followUser.isVerified && <VerifiedBadge size={16} />}
                                                </div>
                                                <p className="text-gray-500 text-sm truncate">{followUser.handle}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {showFollowModal === 'followers'
                                        ? 'Henüz takipçi yok.'
                                        : 'Henüz kimse takip edilmiyor.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
