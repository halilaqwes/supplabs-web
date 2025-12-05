import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendPushToUser } from '@/lib/firebase-admin';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const { followerId } = await request.json();
        const params = await props.params;
        const username = decodeURIComponent(params.username);

        if (!followerId) {
            return NextResponse.json(
                { error: 'Follower ID gereklidir' },
                { status: 400 }
            );
        }

        // Get user by username or handle (case insensitive)
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .or(`username.ilike.${username},handle.ilike.${username},handle.ilike.@${username}`)
            .single();

        if (!user) {
            return NextResponse.json(
                { error: 'Kullan\u0131c\u0131 bulunamad\u0131' },
                { status: 404 }
            );
        }

        const followingId = user.id;

        // Can't follow yourself
        if (followerId === followingId) {
            return NextResponse.json(
                { error: 'Kendinizi takip edemezsiniz' },
                { status: 400 }
            );
        }

        // Check if already following
        const { data: existingFollow } = await supabaseAdmin
            .from('follows')
            .select('*')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single();

        if (existingFollow) {
            // Unfollow
            const { error } = await supabaseAdmin
                .from('follows')
                .delete()
                .eq('follower_id', followerId)
                .eq('following_id', followingId);

            if (error) {
                console.error('Unfollow error:', error);
                return NextResponse.json(
                    { error: 'Takipten çıkılamadı' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { following: false, message: 'Takipten çıkıldı' },
                { status: 200 }
            );
        } else {
            // Follow
            const { error } = await supabaseAdmin
                .from('follows')
                .insert({
                    follower_id: followerId,
                    following_id: followingId
                });

            if (error) {
                console.error('Follow error:', error);
                return NextResponse.json(
                    { error: 'Takip edilemedi' },
                    { status: 500 }
                );
            }

            // Create notification
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: followingId,
                    from_user_id: followerId,
                    type: 'follow'
                });

            // Get follower info for push notification
            const { data: followerInfo } = await supabaseAdmin
                .from('users')
                .select('username')
                .eq('id', followerId)
                .single();

            // Send push notification
            if (followerInfo) {
                sendPushToUser(followingId, {
                    title: 'Yeni Takipçi 🎉',
                    body: `${followerInfo.username} seni takip etmeye başladı`,
                    data: {
                        type: 'follow',
                        fromUserId: followerId
                    }
                }, supabaseAdmin).catch(err => console.error('Push notification error:', err));
            }

            return NextResponse.json(
                { following: true, message: 'Takip edildi!' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Follow/unfollow error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
