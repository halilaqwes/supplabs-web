"use client";

import { useAuth } from "@/context/AuthContext";
import { Post } from "./Post";
import { PostComposer } from "./PostComposer";
import { TrendingSection } from "./TrendingSection";
import { SuggestionsSection } from "./SuggestionsSection";
import { useState, useEffect, useCallback, useRef } from "react";
import { Post as PostType } from "@/types";

const POSTS_PER_PAGE = 10;

export function Feed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);

    // İlk yükleme
    const fetchInitialPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            const url = user
                ? `/api/posts?userId=${user.id}&limit=${POSTS_PER_PAGE}&offset=0`
                : `/api/posts?limit=${POSTS_PER_PAGE}&offset=0`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                // Filter to only show SuppLabs official posts
                const suppLabsPosts = data.posts.filter((post: PostType) =>
                    post.handle === '@supplabs' || post.username.toLowerCase().includes('supplabs')
                );
                setPosts(suppLabsPosts);
                setOffset(POSTS_PER_PAGE);
                setHasMore(data.posts.length === POSTS_PER_PAGE);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Daha fazla post yükleme
    const loadMorePosts = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);
            const url = user
                ? `/api/posts?userId=${user.id}&limit=${POSTS_PER_PAGE}&offset=${offset}`
                : `/api/posts?limit=${POSTS_PER_PAGE}&offset=${offset}`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                // Filter to only show SuppLabs official posts
                const suppLabsPosts = data.posts.filter((post: PostType) =>
                    post.handle === '@supplabs' || post.username.toLowerCase().includes('supplabs')
                );

                setPosts(prev => [...prev, ...suppLabsPosts]);
                setOffset(prev => prev + POSTS_PER_PAGE);
                setHasMore(data.posts.length === POSTS_PER_PAGE);
            }
        } catch (error) {
            console.error("Failed to load more posts", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [user, offset, isLoadingMore, hasMore]);

    // IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, isLoading, loadMorePosts]);

    useEffect(() => {
        fetchInitialPosts();
    }, [fetchInitialPosts]);

    const handlePostCreated = () => {
        fetchInitialPosts();
        setOffset(0);
        setHasMore(true);
    };

    return (
        <div className="pb-24" id="top-of-feed">
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
                    <>
                        {posts.map((post) => (
                            <Post key={post.id} post={post} onUpdate={fetchInitialPosts} />
                        ))}

                        {/* Sentinel Element for IntersectionObserver */}
                        {hasMore && (
                            <div ref={observerRef} className="flex justify-center p-4">
                                {isLoadingMore && (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                )}
                            </div>
                        )}

                        {/* End of feed message */}
                        {!hasMore && posts.length > 0 && (
                            <div className="text-center p-8 text-gray-500">
                                Tüm gönderileri gördünüz 🎉
                            </div>
                        )}

                        {/* No posts message */}
                        {!hasMore && posts.length === 0 && (
                            <div className="text-center p-8 text-gray-500">
                                Henüz gönderi yok
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
