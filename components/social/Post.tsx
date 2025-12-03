

import { Post as PostType } from "@/types";
import { Heart, MessageCircle, Repeat, Share, Send, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import Link from "next/link";
import { useState } from "react";

interface PostProps {
    post: PostType;
    onUpdate?: () => void;
}

export function Post({ post, onUpdate }: PostProps) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [comments, setComments] = useState(post.commentsList || []);
    const [commentCount, setCommentCount] = useState(post.comments || 0);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [repostCount, setRepostCount] = useState(post.reposts || 0);
    const [isLiked, setIsLiked] = useState(post.isLiked || false);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/posts/${post.id}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !user) return;

        try {
            setIsSubmittingComment(true);
            const response = await fetch(`/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, content: commentText })
            });

            if (response.ok) {
                setCommentText("");
                fetchComments(); // Refresh comments list
                setCommentCount(prev => prev + 1); // Optimistically update count
                // onUpdate is removed to prevent full feed reload
            }
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || !confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) return;

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (response.ok) {
                if (onUpdate) onUpdate(); // We still want to update on delete to remove the post
            } else {
                alert("Gönderi silinemedi.");
            }
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (!response.ok) {
                // Revert if failed
                setIsLiked(!newIsLiked);
                setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error("Failed to like post", error);
            setIsLiked(!newIsLiked);
            setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleRepost = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        // Optimistic update
        setRepostCount(prev => prev + 1);

        try {
            const response = await fetch(`/api/posts/${post.id}/repost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (!response.ok) {
                setRepostCount(prev => prev - 1);
            }
        } catch (error) {
            console.error("Failed to repost", error);
            setRepostCount(prev => prev - 1);
        }
    };

    const getProfileLink = () => {
        // Use handle without @ for profile links if available, otherwise username
        const slug = post.handle ? post.handle.replace('@', '') : post.username;
        return `/profile/${slug}`;
    };

    const toggleComments = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowComments(!showComments);
        // Always fetch comments when opening if we don't have them or to refresh
        if (!showComments) {
            fetchComments();
        }
    };

    return (
        <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex gap-3">
                <Link href={getProfileLink()} onClick={(e) => e.stopPropagation()}>
                    <img
                        src={post.avatar}
                        alt={post.username}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:opacity-80 transition-opacity"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-500 text-sm flex-1 min-w-0">
                            <Link href={getProfileLink()} onClick={(e) => e.stopPropagation()} className="font-bold text-black truncate hover:underline">
                                {post.username}
                            </Link>
                            {post.isVerified && <VerifiedBadge size={16} />}
                            <span className="truncate">{post.handle}</span>
                            <span>·</span>
                            <span>{post.timestamp}</span>
                        </div>

                        {user?.id === post.userId && (
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                title="Gönderiyi sil"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{post.content}</p>

                    {post.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                            <img src={post.image} alt="Post content" className="w-full h-auto" />
                        </div>
                    )}

                    {post.video && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                            <video controls className="w-full h-auto">
                                <source src={post.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    <div className="flex justify-between mt-3 text-gray-500 max-w-md">
                        <button
                            onClick={toggleComments}
                            className="flex items-center gap-2 group hover:text-blue-500 transition-colors"
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">{commentCount > 0 && commentCount}</span>
                        </button>

                        <button
                            onClick={handleRepost}
                            className="flex items-center gap-2 group hover:text-green-500 transition-colors"
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-50">
                                <Repeat size={18} />
                            </div>
                            <span className="text-sm">{repostCount > 0 && repostCount}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                        >
                            <div className={`p-2 rounded-full ${isLiked ? 'bg-pink-50' : 'group-hover:bg-pink-50'}`}>
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </div>
                            <span className="text-sm">{likeCount > 0 && likeCount}</span>
                        </button>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="mt-4 pl-14" onClick={(e) => e.stopPropagation()}>
                    {user && (
                        <form onSubmit={handleComment} className="flex gap-2 mb-4">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Yanıtını gönder"
                                    className="w-full bg-gray-100 rounded-full py-2 px-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isSubmittingComment}
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmittingComment}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={comment.avatar} alt={comment.username} className="w-8 h-8 rounded-full" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{comment.username}</span>
                                        <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-800">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
