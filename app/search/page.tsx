"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Post } from "@/components/social/Post";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useEffect, useState } from "react";
import { Post as PostType, User } from "@/types";

import { Suspense } from "react";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = require("next/navigation").useRouter(); // using require inside to ensure client side execution context usually but here import is fine? usePathname is imported. Let's stick to adding useRouter to imports. Actually let's just use window location or standard component state for input.
    // Better: Add useRouter to top imports.

    const initialQuery = searchParams.get("q") || "";
    const [searchTerm, setSearchTerm] = useState(initialQuery);

    // Sync local state with URL param
    useEffect(() => {
        setSearchTerm(initialQuery);
    }, [initialQuery]);

    const [posts, setPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Perform search when initialQuery changes (URL changes)
    useEffect(() => {
        const fetchResults = async () => {
            if (!initialQuery.trim()) {
                setPosts([]);
                setUsers([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(initialQuery)}`);
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

        fetchResults();
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-4 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">Arama</h1>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Kullanıcı veya gönderi ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </form>
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
                            {initialQuery && <h2 className="font-bold text-lg mb-4">Gönderiler</h2>}

                            {posts.length > 0 ? (
                                <div className="border rounded-xl overflow-hidden">
                                    {posts.map(post => (
                                        <Post key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {initialQuery ? (
                                        users.length === 0 && <p>Sonuç bulunamadı.</p>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <Search size={48} />
                                            <p>Arama yapmak için yukarıya bir şeyler yazın.</p>
                                        </div>
                                    )}
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
