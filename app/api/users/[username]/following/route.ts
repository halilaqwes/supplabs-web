import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const params = await props.params;
        const username = decodeURIComponent(params.username);

        // Get user by username or handle
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .or(`username.ilike.${username},handle.ilike.${username},handle.ilike.@${username}`)
            .single();

        if (!user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Get following (people this user follows)
        const { data: following, error } = await supabaseAdmin
            .from('follows')
            .select(`
                following_id,
                users!follows_following_id_fkey (
                    id,
                    username,
                    handle,
                    avatar,
                    is_verified
                )
            `)
            .eq('follower_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Fetch following error:', error);
            return NextResponse.json(
                { error: 'Takip edilenler getirilemedi' },
                { status: 500 }
            );
        }

        // Transform data
        const followingList = (following || []).map((f: any) => ({
            id: f.users.id,
            username: f.users.username,
            handle: f.users.handle,
            avatar: f.users.avatar,
            isVerified: f.users.is_verified
        }));

        return NextResponse.json({ following: followingList }, { status: 200 });
    } catch (error) {
        console.error('Get following error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
