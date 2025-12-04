import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export function CategoryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
            {CATEGORIES.map((category) => (
                <Link
                    key={category.id}
                    href={`/supplements/${category.id}`}
                    className="group relative block rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                    <div className="bg-white rounded-2xl p-4 h-full flex items-center gap-6">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                                {category.name}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">
                                {category.count} ürün
                            </p>
                        </div>

                        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
