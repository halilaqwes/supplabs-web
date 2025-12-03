import { ProductList } from "@/components/supplements/ProductList";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categoryId } = await params;
    const category = CATEGORIES.find(c => c.id === categoryId);

    if (!category) {
        notFound();
    }

    const categoryProducts = PRODUCTS.filter(p => p.category === categoryId);

    return (
        <div className="pb-20">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center gap-4">
                <Link href="/supplements" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">{category.name} Rankings</h1>
                    <p className="text-gray-500 text-sm">{categoryProducts.length} Products Ranked</p>
                </div>
            </div>

            {categoryProducts.length > 0 ? (
                <ProductList products={categoryProducts} />
            ) : (
                <div className="p-8 text-center text-gray-500">
                    No products found in this category yet.
                </div>
            )}
        </div>
    );
}
