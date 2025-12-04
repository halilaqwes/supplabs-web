export interface User {
    id: string;
    username: string;
    handle: string;
    email: string;
    avatar: string;
    bio?: string;
    isVerified?: boolean;
    isOfficial?: boolean;
    role?: string;
    followers: number;
    following: number;
    followingIds?: string[];
    followerIds?: string[];
    subscriptionEndDate?: string;
    hasUsedTrial?: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    postId?: string;
    username: string;
    avatar: string;
    content: string;
    timestamp: string;
}

export interface Post {
    id: string;
    userId: string;
    username: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
    isOfficial?: boolean;
    content: string;
    image?: string;
    video?: string;
    likes: number;
    isLiked?: boolean;
    likedBy?: string[];
    reposts: number;
    repostedBy?: string[];
    comments: number;
    commentsList?: Comment[];
    timestamp: string;
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    rating: number;
    image: string;
    votes: number;
    description: string;
}

export interface Category {
    id: string;
    name: string;
    count: number;
    image: string;
}
