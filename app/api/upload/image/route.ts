import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        if (!file || !userId) {
            return NextResponse.json(
                { error: 'File and userId required' },
                { status: 400 }
            );
        }

        // File size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Upload to Supabase Storage using admin client
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from('media')
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json(
                { error: 'Upload failed', details: error.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('media')
            .getPublicUrl(filePath);

        return NextResponse.json({
            url: publicUrl,
            message: 'Upload successful'
        }, { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
