import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: 'Kullanıcı ve ürün ID gerekli' }, { status: 400 });
        }

        // 1. Get user's current token balance
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('tokens')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // 2. Get product details
        const { data: product, error: productError } = await supabase
            .from('store_products')
            .select('*')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        // 3. Check if product is in stock
        if (product.stock <= 0) {
            return NextResponse.json({ error: 'Ürün stokta yok' }, { status: 400 });
        }

        // 4. Check if user has enough tokens
        const currentTokens = user.tokens || 0;
        if (currentTokens < product.price) {
            return NextResponse.json({
                error: 'Yetersiz jeton bakiyesi',
                required: product.price,
                current: currentTokens
            }, { status: 400 });
        }

        // 5. Execute purchase transaction
        const newTokenBalance = currentTokens - product.price;
        const newStock = product.stock - 1;

        // Update user tokens
        const { error: tokenError } = await supabase
            .from('users')
            .update({ tokens: newTokenBalance })
            .eq('id', userId);

        if (tokenError) {
            console.error('Token update error:', tokenError);
            return NextResponse.json({ error: 'Jeton güncellenemedi' }, { status: 500 });
        }

        // Update product stock
        const { error: stockError } = await supabase
            .from('store_products')
            .update({ stock: newStock })
            .eq('id', productId);

        if (stockError) {
            console.error('Stock update error:', stockError);
            // Rollback: restore user tokens
            await supabase
                .from('users')
                .update({ tokens: currentTokens })
                .eq('id', userId);
            return NextResponse.json({ error: 'Stok güncellenemedi' }, { status: 500 });
        }

        // Create purchase record
        const { error: purchaseError } = await supabase
            .from('purchases')
            .insert({
                user_id: userId,
                product_id: productId,
                tokens_spent: product.price
            });

        if (purchaseError) {
            console.error('Purchase record error:', purchaseError);
            // Continue anyway - purchase was successful
        }

        return NextResponse.json({
            success: true,
            message: 'Ürün başarıyla satın alındı!',
            newTokenBalance,
            product: product.name
        });

    } catch (error) {
        console.error('Purchase error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
