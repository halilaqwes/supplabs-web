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

    return (
        <>
            {trendingHashtags.length > 0 && (
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
            )}

            {/* AI Analysis Button - Always visible */}
            <Link
                href="/supplements/ai-analysis"
                className={`${trendingHashtags.length > 0 ? 'mt-4' : ''} block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center`}
            >
                <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22l-.394-1.433a2.25 2.25 0 00-1.423-1.423L13.25 19l1.433-.394a2.25 2.25 0 001.423-1.423L16.5 16l.394 1.183a2.25 2.25 0 001.423 1.423L19.75 19l-1.433.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    AI Supplement Analizi
                </span>
            </Link>
        </>
    );
}
