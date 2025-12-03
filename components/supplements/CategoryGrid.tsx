import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export function CategoryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {CATEGORIES.map((category) => (
                <Link
                    key={category.id}
                    href={`/supplements/${category.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                >
                    <div className="aspect-[4/3] overflow-hidden">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 group-hover:opacity-95 transition-opacity" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-400 transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2 opacity-90">
                            {category.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                {category.count} Ürün
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
