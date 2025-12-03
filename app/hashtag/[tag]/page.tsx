"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Post } from "@/components/social/Post";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function HashtagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = React.use(params);
    const { posts } = useStore();
    const decodedTag = decodeURIComponent(tag);

    const hashtagPosts = posts.filter(post =>
        post.content.toLowerCase().includes(`#${decodedTag.toLowerCase()}`)
    );

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-4 flex items-center gap-4">
                <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">#{decodedTag}</h1>
                    <p className="text-gray-500 text-sm">{hashtagPosts.length} gönderi</p>
                </div>
            </div>

            <div>
                {hashtagPosts.length > 0 ? (
                    hashtagPosts.map((post) => (
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
