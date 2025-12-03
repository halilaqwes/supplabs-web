"use client";

import { useAuth } from "@/context/AuthContext";
import { Post } from "./Post";
import { PostComposer } from "./PostComposer";
import { TrendingSection } from "./TrendingSection";
import { SuggestionsSection } from "./SuggestionsSection";
import { useState, useEffect, useCallback } from "react";
import { Post as PostType } from "@/types";

export function Feed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("foryou");

    const fetchPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = user ? `/api/posts?userId=${user.id}` : '/api/posts';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = () => {
        fetchPosts();
    };

    const getFilteredPosts = () => {
        if (activeTab === "following" && user) {
            // In a real app, this should be a separate API endpoint
            // For now, we'll filter client-side if we have the data, 
            // but since we only fetch global posts, this might be empty if we don't follow anyone who posted recently
            return posts.filter(post => user.followingIds?.includes(post.userId) || post.userId === user.id);
        }
        return posts;
    };

    const filteredPosts = getFilteredPosts();

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("foryou")}
                        className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors relative ${activeTab === "foryou" ? "text-black" : "text-gray-500"
                            }`}
                    >
                        Sizin İçin
                        {activeTab === "foryou" && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("following")}
                        className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors relative ${activeTab === "following" ? "text-black" : "text-gray-500"
                            }`}
                    >
                        Takip Edilenler
                        {activeTab === "following" && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            <PostComposer onPostCreated={handlePostCreated} />

            {/* Mobile/Tablet Trending and Suggestions - Only visible below lg breakpoint */}
            <div className="lg:hidden px-4 py-4 space-y-4">
                <TrendingSection />
                <SuggestionsSection />
            </div>

            <div>
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <Post key={post.id} post={post} onUpdate={fetchPosts} />
                    ))
                )}
            </div>
        </div>
    );
}
