"use client";

import { useSearchParams } from "next/navigation";
import { Post } from "@/components/social/Post";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useEffect, useState } from "react";
import { Post as PostType, User } from "@/types";

import { Suspense } from "react";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [posts, setPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setPosts([]);
                setUsers([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts || []);
                    setUsers(data.users || []);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-4 flex items-center gap-4">
                <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Arama Sonuçları</h1>
                    <p className="text-gray-500 text-sm">"{query}" için sonuçlar</p>
                </div>
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {users.length > 0 && (
                            <div className="mb-8">
                                <h2 className="font-bold text-lg mb-4">Kullanıcılar</h2>
                                <div className="space-y-4">
                                    {users.map(user => (
                                        <Link key={user.id} href={`/profile/${user.username}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                            <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold">{user.username}</span>
                                                    {user.isVerified && <VerifiedBadge size={16} />}
                                                </div>
                                                <span className="text-gray-500 text-sm">{user.handle}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="font-bold text-lg mb-4">Gönderiler</h2>
                            {posts.length > 0 ? (
                                <div className="border rounded-xl overflow-hidden">
                                    {posts.map(post => (
                                        <Post key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {users.length === 0 && <p>Sonuç bulunamadı.</p>}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
