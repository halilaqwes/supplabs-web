"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Post } from "@/components/social/Post";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function HashtagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = React.use(params);
    const decodedTag = decodeURIComponent(tag);
    const [posts, setPosts] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                // In a real app, you'd have a dedicated endpoint or filter parameter
                // For now, let's fetch all posts and filter client-side or use a search endpoint
                // Ideally: /api/posts?hashtag=tag
                // But let's use the search endpoint if available or just fetch all for now as per previous logic
                // Actually, let's try to use the search API if it supports hashtags, or just fetch all and filter

                const response = await fetch('/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    const hashtagPosts = data.posts.filter((post: any) =>
                        post.content.toLowerCase().includes(`#${decodedTag.toLowerCase()}`)
                    );
                    setPosts(hashtagPosts);
                }
            } catch (error) {
                console.error("Failed to fetch hashtag posts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [decodedTag]);

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-4 flex items-center gap-4">
                <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">#{decodedTag}</h1>
                    <p className="text-gray-500 text-sm">{posts.length} gönderi</p>
                </div>
            </div>

            <div>
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        Bu etiketle henüz hiç gönderi paylaşılmamış.
                    </div>
                )}
            </div>
        </div>
    );
}
