"use client";

import { useState } from "react";
import { Upload, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AIAnalysisPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Lütfen geçerli bir resim dosyası seçin');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setError(null);
                setAnalysis(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setError(null);
                setAnalysis(null);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Lütfen geçerli bir resim dosyası seçin');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setAnalyzing(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/analyze-supplement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: selectedImage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analiz sırasında bir hata oluştu');
            }

            setAnalysis(data.analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        } finally {
            setAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setAnalysis(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Ana Sayfaya Dön
                    </Link>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        AI Supplement Analizi
                    </h1>
                    <p className="text-gray-600">
                        Supplement ürününüzün etiket fotoğrafını yükleyin, yapay zeka ile profesyonel analiz alın
                    </p>
                </div>

                {/* Upload Area */}
                {!selectedImage && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm hover:border-purple-500 transition-all duration-300 cursor-pointer group"
                    >
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full group-hover:scale-110 transition-transform">
                                    <Upload size={48} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-700 mb-2">
                                        Supplement Etiketi Yükleyin
                                    </p>
                                    <p className="text-gray-500">
                                        Tıklayın veya dosyayı sürükleyip bırakın
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>
                )}

                {/* Image Preview */}
                {selectedImage && !analysis && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <img
                            src={selectedImage}
                            alt="Selected supplement"
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-md mb-6"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={analyzeImage}
                                disabled={analyzing}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Analiz Ediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        AI ile Analiz Et
                                    </>
                                )}
                            </button>
                            <button
                                onClick={resetAnalysis}
                                disabled={analyzing}
                                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                )}

                {/* Analysis Result */}
                {analysis && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-100">
                            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
                                <Sparkles size={24} className="text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">AI Analiz Sonucu</h2>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {analysis}
                            </div>
                        </div>

                        <button
                            onClick={resetAnalysis}
                            className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Yeni Analiz Yap
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-semibold">⚠️ Hata</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
