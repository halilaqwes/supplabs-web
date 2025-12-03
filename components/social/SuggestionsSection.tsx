"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";

export function SuggestionsSection() {
    const { user } = useAuth();
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [following, setFollowing] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user) return;

            try {
                // Fetch all users from the API
                const response = await fetch('/api/search?q=');
                if (response.ok) {
                    const data = await response.json();
                    // Filter out current user and get random 3
                    const otherUsers = data.users
                        .filter((u: User) => u.id !== user.id)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3);
                    setSuggestedUsers(otherUsers);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        fetchSuggestions();
    }, [user]);

    const handleFollowClick = async (username: string) => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${username}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: user.id })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.following) {
                    setFollowing(prev => new Set(prev).add(username));
                } else {
                    setFollowing(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(username);
                        return newSet;
                    });
                }
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    if (suggestedUsers.length === 0) return null;

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h2 className="font-bold text-xl mb-4">Kimi takip etmeli</h2>
            <div className="space-y-4">
                {suggestedUsers.map(suggestedUser => (
                    <div key={suggestedUser.id} className="flex items-center gap-3">
                        <img
                            src={suggestedUser.avatar}
                            alt={suggestedUser.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/profile/${encodeURIComponent(suggestedUser.username)}`}
                                className="font-bold hover:underline cursor-pointer block truncate"
                            >
                                {suggestedUser.username}
                            </Link>
                            <p className="text-gray-500 text-sm truncate">{suggestedUser.handle}</p>
                        </div>
                        <button
                            onClick={() => handleFollowClick(suggestedUser.username)}
                            className={`${following.has(suggestedUser.username)
                                    ? 'bg-gray-200 text-black'
                                    : 'bg-black text-white'
                                } px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-80 transition-all`}
                        >
                            {following.has(suggestedUser.username) ? 'Takip Ediliyor' : 'Takip Et'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
