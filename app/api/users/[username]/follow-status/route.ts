import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const params = await props.params;
        const username = decodeURIComponent(params.username);
        const { searchParams } = new URL(request.url);
        const currentUserId = searchParams.get('userId');

        if (!currentUserId) {
            return NextResponse.json(
                { isFollowing: false },
                { status: 200 }
            );
        }

        // Get profile user by username or handle
        const { data: profileUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .or(`username.ilike.${username},handle.ilike.${username},handle.ilike.@${username}`)
            .single();

        if (!profileUser) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Check if current user follows profile user
        const { data: followRelation } = await supabaseAdmin
            .from('follows')
            .select('*')
            .eq('follower_id', currentUserId)
            .eq('following_id', profileUser.id)
            .single();

        return NextResponse.json(
            { isFollowing: !!followRelation },
            { status: 200 }
        );
    } catch (error) {
        console.error('Follow status check error:', error);
        return NextResponse.json(
            { isFollowing: false },
            { status: 200 }
        );
    }
}
