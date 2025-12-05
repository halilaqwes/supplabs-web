"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { ImageIcon, X } from "lucide-react";

interface PostComposerProps {
    onPostCreated?: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Max 5MB check
            if (file.size > 5 * 1024 * 1024) {
                alert('Görsel boyutu 5MB\'dan küçük olmalıdır');
                return;
            }

            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert('Lütfen bir görsel dosyası seçin');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadToServer = async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.id);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Server upload error:', error);
                return null;
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);

            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadToServer(selectedImage);
                if (!imageUrl) {
                    alert('Görsel yüklenemedi. Lütfen tekrar deneyin.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    content,
                    image: imageUrl
                }),
            });

            if (response.ok) {
                setContent("");
                removeImage();
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

                {/* Image preview */}
                {imagePreview && (
                    <div className="relative mt-2 mb-2">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="rounded-xl max-h-96 w-full object-cover border border-gray-200"
                        />
                        <button
                            onClick={removeImage}
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50"
                            title="Görseli kaldır"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting || !!selectedImage}
                            className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Görsel ekle"
                        >
                            <ImageIcon size={20} />
                        </button>
                    </div>

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
