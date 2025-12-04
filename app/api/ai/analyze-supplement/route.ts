import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "Resim bulunamadı" },
                { status: 400 }
            );
        }

        // Check if API key exists
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY ortam değişkeni tanımlanmamış. Lütfen .env.local dosyasına ekleyin." },
                { status: 500 }
            );
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert base64 to the format Gemini expects
        const base64Data = image.split(',')[1];
        const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

        const prompt = `Sen SuppLabs yapay zeka asistanısın. Bu görüntüdeki supplement (takviye gıda) ürünün etiketini analiz et. 

Cevabına şöyle başla: "Merhaba! Ben SuppLabs AI Asistanı. Bu supplement ürününü sizin için analiz ettim:"

Lütfen şu konularda TÜRKÇE olarak profesyonel ve detaylı bir değerlendirme yap:

1. İçerik Analizi: Etikette görünen tüm aktif bileşenleri ve miktarlarını listele
2. Fayda ve Etkinlik: Bu bileşenlerin bilimsel olarak kanıtlanmış faydalarını açıkla
3. Dozaj Değerlendirmesi: Kullanılan dozajların etkin olup olmadığını değerlendir
4. Olası Yan Etkiler: Dikkat edilmesi gereken potansiyel yan etkileri belirt
5. Kullanım Önerileri: Kim için uygundur, ne zaman ve nasıl kullanılmalı
6. Genel Değerlendirme: Bu ürün hakkında genel görüşün

Her bölümü başlıklar halinde düzenle ve anlaşılır bir dille açıkla. Profesyonel ama samimi bir ton kullan.

Sonunda şunu ekle: "- SuppLabs AI ile analiz edildi 🔬"

NOT: Eğer görüntüde supplement etiketi yoksa veya okunamıyorsa, bunu kullanıcıya nazikçe belirt.`;

        // Generate content with proper format for Gemini 2.5
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
            prompt,
        ]);

        const response = result.response;
        const analysis = response.text();

        // Return analysis (image data is not stored, released from memory after this)
        return NextResponse.json({ analysis }, { status: 200 });

    } catch (error) {
        console.error("Gemini AI Error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));

        return NextResponse.json(
            {
                error: "AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                details: error instanceof Error ? error.message : "Bilinmeyen hata",
                fullError: error
            },
            { status: 500 }
        );
    }
}
