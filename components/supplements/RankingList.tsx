
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface RankingItem {
    rank: number;
    name: string;
    description: string;
    image: string;
    price: string;
    servings: string;
    link: string;
    isExternal: boolean;
    note?: string;
}

const BALANCED_PRODUCTS: RankingItem[] = [
    {
        rank: 1,
        name: "HIQ Smash Pro",
        description: "Yüksek performanslı antrenman öncesi, dengeli içerik",
        image: "/images/smash-pro.png",
        price: "₺1.299,00",
        servings: "30 Servis",
        link: "https://takehiq.com/products/hiq-smash-pro?_pos=1&_psq=p&_ss=e&_v=1.0",
        isExternal: true
    },
    {
        rank: 2,
        name: "Kingsize Nutrition Beast Mode",
        description: "1000 Gr - Güçlü içerik",
        image: "/images/kingsize-beast.png",
        price: "₺1.249,00",
        servings: "60 Servis",
        link: "https://www.supplementler.com/urun/kingsize-nutrition-beast-mode-1000-gr-15454",
        isExternal: true
    },
    {
        rank: 3,
        name: "Grenade Pre-Workout",
        description: "330g - Yüksek Kafein",
        image: "/images/grenade-pre-workout.png",
        price: "₺1.649,00",
        servings: "33 Servis",
        link: "https://www.supplementler.com/urun/grenade-pre-workout-330-g-789",
        isExternal: true,
        note: "Yüksek fiyat dezavantajı"
    }
];

const BEST_OF_WEEK_PRODUCTS: RankingItem[] = [
    {
        rank: 1,
        name: "Olimp R-Weiler Shot 20 Ampul",
        description: "Hızlı emilim, pratik kullanım",
        image: "/images/olimp-r-weiler.png",
        price: "₺1.299,00",
        servings: "20 Servis",
        link: "https://www.supplementler.com/urun/olimp-r-weiler-shot-20-ampul-6741",
        isExternal: true
    },
    {
        rank: 2,
        name: "Kingsize Nutrition Beast Shot",
        description: "60 mL 20 Adet - Pratik Shot",
        image: "/images/kingsize-beast-shot.png",
        price: "₺1.249,00", // Using similar price as placeholder or based on previous
        servings: "20 Servis",
        link: "https://www.supplementler.com/urun/kingsize-nutrition-beast-shot-pre-workout-60-ml-20-adet-18264",
        isExternal: true
    },
    {
        rank: 3,
        name: "Big Joy Predator Shot",
        description: "60 mL 20 Ampul",
        image: "/images/bigjoy-predator.png",
        price: "₺1.149,00",
        servings: "20 Servis",
        link: "https://www.supplementler.com/urun/big-joy-predator-shot-60-ml-x-20-ampul-18067?ref=related",
        isExternal: true
    }
];

export function RankingList() {
    return (
        <div className="mb-8 px-4">
            {/* Table 1: Balanced */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Dengeli Pre-workout ürünleri</h2>
                    <p className="text-sm text-gray-500">
                        Beta Alanine, Betaine Anhydrous, Caffeine, Citrulline, Taurine ve Tyrosine içeriğine göre sıralanmıştır.
                    </p>
                </div>

                <div className="space-y-4">
                    {BALANCED_PRODUCTS.map((product) => (
                        <RankingCard key={product.rank} product={product} />
                    ))}
                </div>
            </div>

            {/* Spacer */}
            <div className="h-8"></div>

            {/* Table 2: Best of Week */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Haftanın en iyi pre-workout</h2>
                    <p className="text-sm text-gray-500">
                        Bu hafta en çok tercih edilen ve beğenilen ürünler.
                    </p>
                </div>

                <div className="space-y-4">
                    {BEST_OF_WEEK_PRODUCTS.map((product) => (
                        <RankingCard key={product.rank} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function RankingCard({ product }: { product: RankingItem }) {
    const getBorderColor = (rank: number) => {
        switch (rank) {
            // ... existing code ...
            case 1:
                return "border-yellow-500 shadow-yellow-100 ring-1 ring-yellow-500";
            case 2:
                return "border-gray-300 shadow-gray-100";
            case 3:
                return "border-orange-700 shadow-orange-100 ring-1 ring-orange-700";
            default:
                return "border-gray-200";
        }
    };

    const CardContent = (
        <>
            <div className={`relative flex items-center p-4 bg-white rounded-xl border-2 shadow-lg transition-transform hover:scale-[1.01] ${getBorderColor(product.rank)}`}>
                {/* Rank Number */}
                <div className="mr-4 text-2xl font-bold min-w-[30px] text-center">
                    {product.rank}.
                </div>

                {/* Image */}
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Info */}
                <div className="flex-grow">
                    <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.description}</p>
                </div>

                {/* Price & Servings - Hidden as per request */}
                {/* <div className="hidden sm:block text-right min-w-[100px]">
                <div className="font-bold text-green-600">{product.price}</div>
                <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <span className="inline-block w-3 h-3 bg-black rounded-sm relative top-[1px]"></span>
                    {product.servings}
                </div>
            </div> */}

                {/* Mobile price indicator if needed or kept simple */}
                {product.isExternal && (
                    <ExternalLink className="ml-2 w-4 h-4 text-gray-400" />
                )}
            </div>
            {
                product.note && (
                    <div className="mt-1 text-xs text-red-500 font-medium text-right px-2">
                        * {product.note}
                    </div>
                )
            }
        </>
    );

    if (product.isExternal) {
        return (
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="block">
                {CardContent}
            </a>
        );
    }

    return (
        <Link href={product.link} className="block">
            {CardContent}
        </Link>
    );
}
