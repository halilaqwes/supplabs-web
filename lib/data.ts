export const CATEGORIES = [
    {
        id: "pre-workout",
        name: "Pre-Workout",
        count: 127,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Antrenman öncesi enerji ve performans"
    },
    {
        id: "protein-powder",
        name: "Protein Tozları",
        count: 156,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Whey, kazein ve bitkisel protein"
    },
    {
        id: "creatine",
        name: "Kreatin",
        count: 45,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Güç ve kas artışı için kreatin monohydrate"
    },
    {
        id: "bcaa",
        name: "BCAA & Amino Asitler",
        count: 89,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Kas koruması ve toparlanma"
    },
    {
        id: "mass-gainer",
        name: "Kilo Alıcılar",
        count: 38,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Yüksek kalorili kas kütlesi artırıcılar"
    },
    {
        id: "fat-burners",
        name: "Yağ Yakıcılar",
        count: 67,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Metabolizma hızlandırıcı ve yağ yakıcı"
    },
    {
        id: "vitamins",
        name: "Vitaminler & Mineraller",
        count: 203,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Genel sağlık ve bağışıklık desteği"
    },
    {
        id: "protein-bars",
        name: "Protein Barları",
        count: 74,
        image: "https://images.unsplash.com/photo-1526081715774-4b6246f4c7f8?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Pratik protein kaynağı"
    },
    {
        id: "energy-drinks",
        name: "Enerji İçecekleri",
        count: 52,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Hızlı enerji ve odaklanma"
    },
    {
        id: "electrolytes",
        name: "Elektrolit & Hidrasyon",
        count: 41,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600&h=400",
        description: "Egzersiz sırasında hidrasyon desteği"
    }
];

export const PRODUCTS = [
    // Pre-Workout
    {
        id: "1",
        name: "C4 Original Pre-Workout",
        brand: "Cellucor",
        category: "pre-workout",
        price: 899,
        rating: 9.2,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 245,
        description: "Enerji, odaklanma ve pump için gelişmiş Pre-Workout"
    },
    {
        id: "2",
        name: "Gold Standard Pre-Workout",
        brand: "Optimum Nutrition",
        category: "pre-workout",
        price: 1249,
        rating: 9.5,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 312,
        description: "Premium pre-workout formülü"
    },
    {
        id: "3",
        name: "Evogen EVP-3D",
        brand: "Evogen",
        category: "pre-workout",
        price: 1599,
        rating: 9.3,
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 189,
        description: "Premium 3D pump matrix"
    },

    // Protein Tozları
    {
        id: "4",
        name: "Gold Standard 100% Whey",
        brand: "Optimum Nutrition",
        category: "protein-powder",
        price: 1899,
        rating: 9.8,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 567,
        description: "Dünya'nın en çok satan whey proteini - 24g protein"
    },
    {
        id: "5",
        name: "Iso 100 Hydrolyzed",
        brand: "Dymatize",
        category: "protein-powder",
        price: 2199,
        rating: 9.6,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 423,
        description: "Hidrolize protein izolat - Ultra hızlı emilim"
    },
    {
        id: "6",
        name: "Nitro-Tech Whey Gold",
        brand: "MuscleTech",
        category: "protein-powder",
        price: 1699,
        rating: 9.1,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 298,
        description: "Premium whey protein ve kreatin karışımı"
    },

    // Kreatin
    {
        id: "7",
        name: "Micronized Creatine Powder",
        brand: "Optimum Nutrition",
        category: "creatine",
        price: 549,
        rating: 9.7,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 501,
        description: "Mikronize kreatin monohydrat - 5g porsiyon"
    },
    {
        id: "8",
        name: "Platinum 100% Creatine",
        brand: "MuscleTech",
        category: "creatine",
        price: 599,
        rating: 9.4,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 387,
        description: "Ultra-saf kreatin monohydrat"
    },

    // BCAA
    {
        id: "9",
        name: "Xtend Original BCAA",
        brand: "Scivation",
        category: "bcaa",
        price: 899,
        rating: 9.5,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 445,
        description: "2:1:1 BCAA oranı ve elektrolitler"
    },
    {
        id: "10",
        name: "Amino X",
        brand: "BSN",
        category: "bcaa",
        price: 749,
        rating: 9.2,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 312,
        description: "BCAA ve amino asit karışımı"
    },

    // Mass Gainer
    {
        id: "11",
        name: "Serious Mass",
        brand: "Optimum Nutrition",
        category: "mass-gainer",
        price: 2499,
        rating: 9.3,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 389,
        description: "1250 kalori, 50g protein yüksek kalorili gainer"
    },
    {
        id: "12",
        name: "Mass-Tech Extreme 2000",
        brand: "MuscleTech",
        category: "mass-gainer",
        price: 2199,
        rating: 9.1,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 267,
        description: "2000 kalori, 80g protein massı artırıcı"
    },

    // Fat Burners
    {
        id: "13",
        name: "Hydroxycut Hardcore Elite",
        brand: "MuscleTech",
        category: "fat-burners",
        price: 899,
        rating: 8.9,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 256,
        description: "Güçlü termojenik yağ yakıcı"
    },
    {
        id: "14",
        name: "Lipo-6 Black",
        brand: "Nutrex",
        category: "fat-burners",
        price: 799,
        rating: 8.7,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 198,
        description: "Ultra konsantre yağ yakıcı formül"
    },

    // Vitaminler
    {
        id: "15",
        name: "Opti-Men Multivitamin",
        brand: "Optimum Nutrition",
        category: "vitamins",
        price: 649,
        rating: 9.6,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 512,
        description: "Erkekler için 75+ bileşenli multivitamin"
    },
    {
        id: "16",
        name: "Animal Pak",
        brand: "Universal Nutrition",
        category: "vitamins",
        price: 799,
        rating: 9.7,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 478,
        description: "Atletler için vitamin paketi"
    },

    // Protein Barları
    {
        id: "17",
        name: "Quest Protein Bar",
        brand: "Quest Nutrition",
        category: "protein-bars",
        price: 89,
        rating: 9.4,
        image: "https://images.unsplash.com/photo-1526081715774-4b6246f4c7f8?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 634,
        description: "20g protein, düşük şeker protein bar"
    },
    {
        id: "18",
        name: "Carb Killa Bar",
        brand: "Grenade",
        category: "protein-bars",
        price: 79,
        rating: 9.2,
        image: "https://images.unsplash.com/photo-1526081715774-4b6246f4c7f8?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 445,
        description: "23g protein, düşük karbonhidrat"
    },

    // Energy Drinks
    {
        id: "19",
        name: "Bang Energy Drink",
        brand: "VPX",
        category: "energy-drinks",
        price: 45,
        rating: 9.0,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 389,
        description: "300mg kafein, sıfır kalori enerji içeceği"
    },
    {
        id: "20",
        name: "Reign Total Body Fuel",
        brand: "Monster",
        category: "energy-drinks",
        price: 42,
        rating: 8.8,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 301,
        description: "300mg kafein, BCAA ve CoQ10"
    },

    // Electrolytes
    {
        id: "21",
        name: "Xtend Hydration",
        brand: "Scivation",
        category: "electrolytes",
        price: 749,
        rating: 9.3,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 267,
        description: "BCAA ve elektrolit karışımı"
    },
    {
        id: "22",
        name: "Intra-Workout",
        brand: "Transparent Labs",
        category: "electrolytes",
        price: 849,
        rating: 9.1,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300",
        votes: 198,
        description: "İdeal elektrolit dengesi"
    }
];

export const MOCK_POSTS = [
    {
        id: "p1",
        userId: "u2",
        username: "GymRat99",
        handle: "@gymrat99",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        content: "Yeni Ghost pre-workout'u denedim. Pump inanılmaz! 💪 #gymlife #supplements",
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=500&h=300",
        likes: 45,
        likedBy: [],
        reposts: 12,
        repostedBy: [],
        comments: 5,
        timestamp: "2s önce"
    },
    {
        id: "p2",
        userId: "u3",
        username: "SarahFit",
        handle: "@sarahfit",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        content: "Herkesin favori protein barı hangisi? Tebeşir gibi tadı olmayan bir şeye ihtiyacım var. 🤢",
        likes: 89,
        likedBy: [],
        reposts: 3,
        repostedBy: [],
        comments: 24,
        timestamp: "4s önce"
    },
    {
        id: "p3",
        userId: "u1",
        username: "SuppLabs Resmi",
        handle: "@supplabs",
        isVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuppLabs",
        content: "SuppLabs'a hoş geldiniz! Supplement incelemeleri bulmak ve diğer sporcularla bağlantı kurmak için en iyi yer. 🚀",
        likes: 1200,
        likedBy: [],
        reposts: 400,
        repostedBy: [],
        comments: 102,
        timestamp: "1g önce"
    }
];

export const USERS = [
    {
        id: "u1",
        username: "SuppLabs Resmi",
        handle: "@supplabs",
        email: "admin@supplabs.com",
        password: "password123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuppLabs",
        isVerified: true,
        bio: "Resmi SuppLabs hesabı.",
        followers: 1200,
        following: 5,
        followingIds: [],
        followerIds: []
    },
    {
        id: "u2",
        username: "GymRat99",
        handle: "@gymrat99",
        email: "gymrat@example.com",
        password: "password123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        isVerified: false,
        bio: "No pain no gain.",
        followers: 450,
        following: 120,
        followingIds: [],
        followerIds: []
    },
    {
        id: "u3",
        username: "SarahFit",
        handle: "@sarahfit",
        email: "sarah@example.com",
        password: "password123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        isVerified: false,
        bio: "Fitness & Lifestyle.",
        followers: 890,
        following: 300,
        followingIds: [],
        followerIds: []
    },
    {
        id: "u4",
        username: "FitnessPro",
        handle: "@fitnesspro",
        email: "pro@example.com",
        password: "password123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessPro",
        isVerified: true,
        bio: "Certified Trainer.",
        followers: 5000,
        following: 10,
        followingIds: [],
        followerIds: []
    },
    {
        id: "u5",
        username: "SuppReviewer",
        handle: "@suppreview",
        email: "reviewer@example.com",
        password: "password123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuppReviewer",
        isVerified: false,
        bio: "Dürüst incelemeler.",
        followers: 200,
        following: 50,
        followingIds: [],
        followerIds: []
    }
];
