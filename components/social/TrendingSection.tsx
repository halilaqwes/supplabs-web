"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/context/StoreContext";

interface HashtagData {
    tag: string;
    count: number;
}

export function TrendingSection() {
    const { posts } = useStore();

    // Extract and count hashtags from posts
    const trendingHashtags = useMemo((): HashtagData[] => {
        const hashtagMap = new Map<string, number>();

        posts.forEach(post => {
            const hashtags = post.content.match(/#[\wığüşöçĞÜŞİÖÇ]+/gi) || [];
            hashtags.forEach(tag => {
                const normalizedTag = tag.toLowerCase();
                const count = hashtagMap.get(normalizedTag) || 0;
                hashtagMap.set(normalizedTag, count + 1);
            });
        });

        return Array.from(hashtagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [posts]);

    if (trendingHashtags.length === 0) return null;

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h2 className="font-bold text-xl mb-4">Supplementlerde Gündem</h2>
            <div className="space-y-4">
                {trendingHashtags.map((item, index) => (
                    <Link
                        key={item.tag}
                        href={`/search?q=${encodeURIComponent(item.tag)}`}
                        className="block hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
                    >
                        <p className="text-xs text-gray-500">Gündem · #{index + 1}</p>
                        <p className="font-bold">{item.tag}</p>
                        <p className="text-xs text-gray-500">
                            {item.count} {item.count === 1 ? 'gönderi' : 'gönderi'}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
