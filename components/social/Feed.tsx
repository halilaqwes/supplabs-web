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

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
                <div className="flex">
                    <div className="flex-1 py-4 font-bold text-black text-center relative">
                        Anasayfa
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
                    </div>
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
                    posts.map((post) => (
                        <Post key={post.id} post={post} onUpdate={fetchPosts} />
                    ))
                )}
            </div>
        </div>
    );
}
