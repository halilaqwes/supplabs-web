import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ChevronLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Yazı Bulunamadı - SuppLabs",
        };
    }

    return {
        title: `${post.title} | SuppLabs Bilgi Kütüphanesi`,
        description: post.metaDescription, // SEO Updated
        openGraph: {
            title: post.title,
            description: post.metaDescription, // SEO Updated
            images: [post.coverImage],
            type: "article",
            publishedTime: post.date,
            // authors: [post.author.name], // Removed author info previously
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Get related posts (same category, excluding current)
    const relatedPosts = BLOG_POSTS
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            {/* Reading Progress Bar (could be implemented with state/scroll listener) */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
                <div className="h-full bg-blue-600 w-0" id="progress-bar"></div>
            </div>

            {/* Header / Hero */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 max-w-4xl">
                    <Link
                        href="/knowledge"
                        className="text-white/80 hover:text-white mb-8 flex items-center gap-2 transition-colors w-fit"
                    >
                        <ChevronLeft size={20} />
                        Kütüphaneye Dön
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/20">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-t border-white/20 pt-8 mt-auto md:mt-0">
                        <div className="flex items-center gap-4">
                            {/* Date removed */}
                        </div>

                        {/* Social Share (Visual Only) */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors">
                                <Bookmark size={20} />
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">

                {/* Main Content - Centered Single Column */}
                <article className="max-w-3xl mx-auto">
                    <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-2xl prose-strong:text-gray-900">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>

                {/* Related Posts - Bottom Section */}
                {relatedPosts.length > 0 && (
                    <div className="max-w-5xl mx-auto mt-24 border-t border-gray-200 pt-16">
                        <h3 className="font-bold text-2xl text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                            İlginizi Çekebilir
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map(related => (
                                <Link key={related.id} href={`/knowledge/${related.slug}`} className="group block bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={related.coverImage}
                                            fill
                                            alt={related.title}
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {related.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {related.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
