import { CategoryGrid } from "@/components/supplements/CategoryGrid";

export default function SupplementsPage() {
    return (
        <div className="pb-20">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <h1 className="text-3xl font-bold mb-2">Supplement Kategorileri</h1>
                <p className="text-gray-600">En popüler supplement kategorilerini keşfedin ve karşılaştırın</p>
            </div>
            <CategoryGrid />
        </div>
    );
}
