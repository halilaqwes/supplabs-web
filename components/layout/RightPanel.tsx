"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrendingSection } from "@/components/social/TrendingSection";
import { SuggestionsSection } from "@/components/social/SuggestionsSection";

export function RightPanel() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="sticky top-0 h-screen w-[350px] hidden lg:flex flex-col gap-4 py-4 pl-8">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ara..."
                    className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </form>

            <TrendingSection />
            <SuggestionsSection />
        </div>
    );
}
