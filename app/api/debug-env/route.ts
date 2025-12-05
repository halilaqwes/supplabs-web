import { NextResponse } from 'next/server';

export async function GET() {
    // Check if environment variables are being read
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey,
        urlLength: supabaseUrl?.length || 0,
        anonKeyLength: anonKey?.length || 0,
        serviceKeyLength: serviceKey?.length || 0,
        // Show first 10 chars of URL (safe to show)
        urlPrefix: supabaseUrl?.substring(0, 30) || 'MISSING',
        // Show if keys start with expected prefix
        anonKeyPrefix: anonKey?.substring(0, 10) || 'MISSING',
        serviceKeyPrefix: serviceKey?.substring(0, 10) || 'MISSING',
    }, { status: 200 });
}
