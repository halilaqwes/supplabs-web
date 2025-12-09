"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, CATEGORIES } from "@/lib/blog-data";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KnowledgePage() {
    const [selectedCategory, setSelectedCategory] = useState("Tümü");

    const filteredPosts = selectedCategory === "Tümü"
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    // Get the latest post for the hero section
    const heroPost = BLOG_POSTS[0];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                            Bilgi Kütüphanesi
                            <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Supplementler, antrenman bilimi ve beslenme hakkında en güncel ve bilimsel verilerle hazırlanmış rehberler.
                        </p>
                    </div>

                    {/* Featured Hero Post */}
                    <div className="max-w-6xl mx-auto relative group cursor-pointer rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                        <Link href={`/knowledge/${heroPost.slug}`} className="block relative h-[500px] w-full">
                            <Image
                                src={heroPost.coverImage}
                                alt={heroPost.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {heroPost.category}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                                    {heroPost.title}
                                </h2>
                                <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                                    {heroPost.excerpt}
                                </p>
                                <div className="flex items-center gap-3">
                                    {/* Date removed */}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                selectedCategory === category
                                    ? "bg-black text-white border-black shadow-lg scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/knowledge/${post.slug}`}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Date and ReadTime removed */}
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                        DEVAMINI OKU <ChevronRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Bu kategoride henüz yazı bulunmuyor.</p>
                        <button
                            onClick={() => setSelectedCategory("Tümü")}
                            className="text-blue-600 font-medium mt-2 hover:underline"
                        >
                            Tüm yazıları gör
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
