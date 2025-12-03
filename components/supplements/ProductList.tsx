"use client";

import { Product } from "@/types";
import { Star, ThumbsUp } from "lucide-react";

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    return (
        <div className="divide-y divide-gray-200">
            {products.map((product, index) => (
                <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-4">
                    <div className="flex-shrink-0 relative">
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                            #{index + 1}
                        </div>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-contain bg-white rounded-lg border border-gray-100"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">{product.brand}</p>
                                <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-lg">${product.price}</span>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-0.5 rounded-full text-sm">
                                    <Star size={14} fill="currentColor" />
                                    {product.rating}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>

                        <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <ThumbsUp size={16} />
                                <span>{product.votes} votes</span>
                            </button>
                            <button className="text-blue-500 hover:underline">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
