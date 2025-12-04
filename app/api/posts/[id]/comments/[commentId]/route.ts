import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; commentId: string }> }
) {
    try {
        const { id: postId, commentId } = await params;
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        // Get user role
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        // Get comment owner
        const { data: comment } = await supabaseAdmin
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (!comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        // Check if user is admin OR comment owner
        const isAdmin = user?.role === 'admin';
        const isOwner = comment.user_id === userId;

        if (!isAdmin && !isOwner) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Delete comment
        const { error: deleteError } = await supabaseAdmin
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (deleteError) {
            console.error('Delete comment error:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete comment' },
                { status: 500 }
            );
        }

        // Note: Comment count should be handled by trigger, but we'll skip manual decrement
        // The trigger on comments table should handle this automatically

        return NextResponse.json(
            { message: 'Comment deleted' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete comment error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
