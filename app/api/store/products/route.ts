import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data: products, error } = await supabase
            .from('store_products')
            .select('*')
            .gt('stock', 0) // Only show products with stock
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch products error:', error);
            return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
        }

        return NextResponse.json({ products: products || [] });

    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
