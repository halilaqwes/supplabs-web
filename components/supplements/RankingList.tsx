
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
    trend?: 'up' | 'down';
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
        note: "Yüksek fiyat dezavantajı",
        trend: 'down'
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
        isExternal: true,
        trend: 'up'
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

const WHEY_PRODUCTS: RankingItem[] = [
    {
        rank: 1,
        name: "Supplementler.com Whey Protein",
        description: "Yüksek hammadde kalitesi, lezzetli aroma ve fiyat/performans",
        image: "/images/supplementler-whey.png",
        price: "₺999,00",
        servings: "33 Servis",
        link: "https://www.supplementler.com/urun/supplementlercom-whey-protein-1000-gr-8349",
        isExternal: true
    },
    {
        rank: 2,
        name: "HIQ High Pro+",
        description: "İzole ve konsantre whey karışımı, sindirim enzimli",
        image: "/images/hiq-high-pro.png",
        price: "₺1.490,00",
        servings: "30 Servis",
        link: "https://takehiq.com/collections/protein-tozu/products/hiq-hi-pro-900g",
        isExternal: true
    },
    {
        rank: 3,
        name: "Optimum Gold Standard Whey Protein",
        description: "Dünyanın en çok tercih edilen, izole & konsantre whey karışımı",
        image: "/images/optimum-gold-standard.png",
        price: "₺2.499,00",
        servings: "74 Servis",
        link: "https://www.supplementler.com/urun/optimum-gold-standard-whey-2273-gr-608",
        isExternal: true
    },
    {
        rank: 4,
        name: "Big Joy Big Whey Classic",
        description: "Yüksek servis sayısı ve zengin amino asit profili",
        image: "/images/bigjoy-big-whey.png",
        price: "₺1.899,00",
        servings: "72 Servis",
        link: "https://www.supplementler.com/urun/big-joy-big-whey-classic-whey-protein-2376-gr-9968",
        isExternal: true
    },
    {
        rank: 5,
        name: "Nutrever Whey Isolate",
        description: "%100 İzole whey içeriği ile hızlı emilim",
        image: "/images/nutrever-whey-isolate.png",
        price: "₺1.999,00",
        servings: "60 Servis",
        link: "https://www.supplementler.com/urun/nutrever-whey-isolate-protein-900-gr-13454",
        isExternal: true
    },
    {
        rank: 6,
        name: "Scitec Whey Protein Professional",
        description: "Ekstra sindirim enzimleri ve üstün lezzet",
        image: "/images/scitec-whey-professional.png",
        price: "₺2.299,00",
        servings: "78 Servis",
        link: "https://www.supplementler.com/urun/scitec-whey-professional-whey-protein-2350-gr-6436",
        isExternal: true
    },
    {
        rank: 7,
        name: "Multipower Whey Protein Shake",
        description: "Alman kalitesi, yüksek BCAA ve vitamin takviyeli",
        image: "/images/multipower-whey-shake.png",
        price: "₺2.399,00",
        servings: "66 Servis",
        link: "https://www.supplementler.com/urun/multipower-whey-protein-shake-2000-gr-6087",
        isExternal: true
    },
    {
        rank: 8,
        name: "Olimp Whey Protein Complex",
        description: "CFM teknolojisi ile üretilmiş izole ve konsantre whey",
        image: "/images/olimp-whey-complex.png",
        price: "₺1.799,00",
        servings: "50 Servis",
        link: "https://www.supplementler.com/urun/olimp-whey-protein-1800-gr-20354",
        isExternal: true
    },
    {
        rank: 9,
        name: "Kingsize Nutrition All In One",
        description: "Özellikle hacim isteyen insanlar için kompleks protein içeriği",
        image: "/images/kingsize-all-in-one.png",
        price: "₺1.599,00",
        servings: "66 Servis",
        link: "https://www.supplementler.com/urun/kingsize-nutrition-all-in-one-5000-gr-22922",
        isExternal: true
    },
    {
        rank: 10,
        name: "Weider Premium Whey",
        description: "Mikro filtrasyon teknolojisi ve %20 izole whey oranı",
        image: "/images/weider-premium-whey.png",
        price: "₺2.899,00",
        servings: "76 Servis",
        link: "https://www.supplementler.com/urun/weider-premium-whey-protein-2300-gr-855",
        isExternal: true
    }
];

const WHEY_WEEKLY_PRODUCTS: RankingItem[] = [
    {
        rank: 1,
        name: "HIQ High Pro+",
        description: "İzole ve konsantre whey karışımı, sindirim enzimli",
        image: "/images/hiq-high-pro.png",
        price: "₺1.490,00",
        servings: "30 Servis",
        link: "https://takehiq.com/collections/protein-tozu/products/hiq-hi-pro-900g",
        isExternal: true,
        trend: 'up'
    },
    {
        rank: 2,
        name: "Supplementler.com Whey Protein",
        description: "Yüksek hammadde kalitesi, lezzetli aroma ve fiyat/performans",
        image: "/images/supplementler-whey.png",
        price: "₺999,00",
        servings: "33 Servis",
        link: "https://www.supplementler.com/urun/supplementlercom-whey-protein-1000-gr-8349",
        isExternal: true,
        trend: 'down'
    },
    {
        rank: 3,
        name: "Big Joy Big Whey Classic",
        description: "Yüksek servis sayısı ve zengin amino asit profili",
        image: "/images/bigjoy-big-whey.png",
        price: "₺1.899,00",
        servings: "72 Servis",
        link: "https://www.supplementler.com/urun/big-joy-big-whey-classic-whey-protein-2376-gr-9968",
        isExternal: true
    },
    {
        rank: 4,
        name: "Scitec Whey Protein Professional",
        description: "Ekstra sindirim enzimleri ve üstün lezzet",
        image: "/images/scitec-whey-professional.png",
        price: "₺2.299,00",
        servings: "78 Servis",
        link: "https://www.supplementler.com/urun/scitec-whey-professional-whey-protein-2350-gr-6436",
        isExternal: true
    },
    {
        rank: 5,
        name: "Kingsize Nutrition All In One",
        description: "Özellikle hacim isteyen insanlar için kompleks protein içeriği",
        image: "/images/kingsize-all-in-one.png",
        price: "₺1.599,00",
        servings: "66 Servis",
        link: "https://www.supplementler.com/urun/kingsize-nutrition-all-in-one-5000-gr-22922",
        isExternal: true
    }
];

export function RankingList({ category = "pre-workout" }: { category?: string }) {
    const isPreWorkout = category === "pre-workout";
    const isWhey = category === "protein-powder";

    let products1: RankingItem[] = [];
    let products2: RankingItem[] = [];
    let title1 = "";
    let desc1 = "";
    let title2 = "";
    let desc2 = "";

    if (isPreWorkout) {
        products1 = BALANCED_PRODUCTS;
        title1 = "Dengeli Pre-workout ürünleri";
        desc1 = "Beta Alanine, Betaine Anhydrous, Caffeine, Citrulline, Taurine ve Tyrosine içeriğine göre sıralanmıştır.";
        products2 = BEST_OF_WEEK_PRODUCTS;
        title2 = "Haftanın en iyi pre-workout";
        desc2 = "Bu hafta en çok tercih edilen ve beğenilen ürünler.";
    } else if (isWhey) {
        products1 = WHEY_PRODUCTS;
        title1 = "En Çok Satılan Whey Proteinler";
        desc1 = "Türkiye'de en çok tercih edilen 10 whey protein markası.";
        products2 = WHEY_WEEKLY_PRODUCTS;
        title2 = "Haftanın En İyi Whey Proteinleri";
        desc2 = "Kullanıcı puanlarına ve satış verilerine göre haftanın öne çıkanları.";
    } else {
        return null;
    }

    return (
        <div className="mb-8 px-4">
            {/* Table 1 */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">{title1}</h2>
                    <p className="text-sm text-gray-500">{desc1}</p>
                </div>

                <div className="space-y-4">
                    {products1.map((product) => (
                        <RankingCard key={product.rank} product={product} />
                    ))}
                </div>
            </div>

            {/* Spacer */}
            <div className="h-8"></div>

            {/* Table 2 */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">{title2}</h2>
                    <p className="text-sm text-gray-500">{desc2}</p>
                </div>

                <div className="space-y-4">
                    {products2.map((product) => (
                        <RankingCard key={`${product.rank}-week`} product={product} />
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
                    <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                        {product.name}
                        {product.trend === 'up' && (
                            <span className="text-green-600 text-sm font-bold flex items-center">
                                ▲ 1
                            </span>
                        )}
                        {product.trend === 'down' && (
                            <span className="text-red-600 text-sm font-bold flex items-center">
                                ▼ 1
                            </span>
                        )}
                    </h3>
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
