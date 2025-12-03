"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface PostComposerProps {
    onPostCreated?: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) return null;

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    content,
                }),
            });

            if (response.ok) {
                setContent("");
                if (onPostCreated) {
                    onPostCreated();
                }
            } else {
                console.error("Failed to create post");
                alert("Gönderi oluşturulurken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 border-b border-gray-200 flex gap-4">
            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Salonda neler oluyor?"
                    className="w-full resize-none border-none focus:ring-0 text-xl placeholder-gray-500 min-h-[100px] bg-transparent text-black"
                    disabled={isSubmitting}
                />

                <div className="flex justify-end items-center border-t border-gray-100 pt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                </div>
            </div>
        </div>
    );
}
