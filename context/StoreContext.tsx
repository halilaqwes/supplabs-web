"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { MOCK_POSTS } from "@/lib/data";
import { Post, User } from "@/types";
import { useAuth } from "./AuthContext";
import { USERS } from "@/lib/data";

export interface Notification {
    id: string;
    type: 'follow' | 'like' | 'reply' | 'repost';
    read: boolean;
    fromUser: {
        id: string;
        username: string;
        handle: string;
        avatar: string;
        isVerified: boolean;
    };
    post?: {
        id: string;
        content: string;
    };
    timestamp: string;
}

interface StoreContextType {
    posts: Post[];
    notifications: Notification[];
    users: User[];
    addPost: (content: string, image?: string, video?: string) => Promise<void>;
    likePost: (postId: string) => void;
    repostPost: (postId: string) => void;
    addComment: (postId: string, content: string) => void;
    followUser: (username: string) => void;
    unfollowUser: (targetId: string) => void;
    markNotificationsRead: () => void;
    deletePost: (postId: string) => void;
    fetchNotifications: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [users, setUsers] = useState<User[]>(USERS);
    const { user, updateUser } = useAuth();

    // Load posts from API
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await fetch('/api/posts?limit=50');
                if (response.ok) {
                    const data = await response.json();
                    if (data.posts && Array.isArray(data.posts)) {
                        setPosts(data.posts);
                    }
                }
            } catch (error) {
                console.error("Error loading posts:", error);
            }
        };
        loadPosts();
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`/api/notifications?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const addPost = async (content: string, image?: string, video?: string) => {
        if (!user) return;
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, content, image, video })
            });
            if (response.ok) {
                const data = await response.json();
                setPosts([data.post, ...posts]);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const markNotificationsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        const unreadNotifications = notifications.filter(n => !n.read);
        for (const notification of unreadNotifications) {
            try {
                await fetch(`/api/notifications/${notification.id}/read`, { method: 'PUT' });
            } catch (error) {
                console.error(`Error marking notification ${notification.id} as read:`, error);
            }
        }
    };

    const likePost = async (postId: string) => {
        if (!user) return;
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const isLiked = post.likedBy?.includes(user.id);
                return {
                    ...post,
                    likes: isLiked ? post.likes - 1 : post.likes + 1,
                    likedBy: isLiked ? post.likedBy?.filter(id => id !== user.id) : [...(post.likedBy || []), user.id]
                };
            }
            return post;
        }));
        try {
            await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const repostPost = async (postId: string) => {
        if (!user) return;
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const isReposted = post.repostedBy?.includes(user.id);
                return {
                    ...post,
                    reposts: isReposted ? post.reposts - 1 : post.reposts + 1,
                    repostedBy: isReposted ? post.repostedBy?.filter(id => id !== user.id) : [...(post.repostedBy || []), user.id]
                };
            }
            return post;
        }));
        try {
            await fetch(`/api/posts/${postId}/repost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
        } catch (error) {
            console.error("Error reposting post:", error);
        }
    };

    const addComment = async (postId: string, content: string) => {
        if (!user) return;
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, content })
            });
            if (response.ok) {
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, comments: post.comments + 1 } : post
                ));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const followUser = async (username: string) => {
        if (!user) return;
        try {
            await fetch(`/api/users/${username}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: user.id })
            });
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const unfollowUser = async (targetId: string) => {
        if (!user) return;
        const targetUser = users.find(u => u.id === targetId);
        if (targetUser) {
            try {
                await fetch(`/api/users/${targetUser.username}/follow`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ followerId: user.id })
                });
            } catch (error) {
                console.error("Error unfollowing user:", error);
            }
        }
    };

    const deletePost = async (postId: string) => {
        if (!user) return;
        const post = posts.find(p => p.id === postId);
        if (!post || post.userId !== user.id) return;
        setPosts(posts.filter(p => p.id !== postId));
        try {
            await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <StoreContext.Provider value={{ posts, notifications, users, addPost, likePost, repostPost, addComment, followUser, unfollowUser, markNotificationsRead, deletePost, fetchNotifications }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
