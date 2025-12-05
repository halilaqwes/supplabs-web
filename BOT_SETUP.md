# AI Supplement Bot Kurulum

## 1. Bot Kullanıcısını Oluştur

**Supabase Dashboard → SQL Editor**

Aşağıdaki SQL'i çalıştır:

```sql
-- Create AI bot user for supplement tips
INSERT INTO users (
    username, 
    email, 
    handle, 
    avatar,
    is_verified,
    is_official,
    role
) VALUES (
    'Supp Bilgi Botu',
    'bot@supplabs.com',
    '@suppbot',
    'https://api.dicebear.com/7.x/bottts/svg?seed=suppbot',
    true,
    true,
    'ai_bot'
)
ON CONFLICT (email) DO NOTHING;
```

## 2. Gemini 2.0 Flash Exp Model

**Özellikler:**
- Model: `gemini-2.0-flash-exp`
- Temperature: 0.9 (yaratıcılık)
- Max tokens: 200
- Daha gelişmiş analiz
- Daha akıllı cevaplar

## 3. Bot Bilgileri

**Username:** Supp Bilgi Botu  
**Handle:** @suppbot  
**Avatar:** Robot avatarı (Dicebear)  
**Official:** ✅ Yes  
**Verified:** ✅ Yes  

## 4. Cron Schedule

**Sıklık:** Her 59 dakika  
**Schedule:** `*/59 * * * *`  
**Endpoint:** `/api/cron/supplement-bot`

## 5. Test

**Local test:**
```bash
curl -X GET http://localhost:3000/api/cron/supplement-bot \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Beklenen sonuç:**
```json
{
  "success": true,
  "message": "Supplement tip posted successfully",
  "postId": "...",
  "content": "Kreatin monohydrat...",
  "timestamp": "2025-12-05T..."
}
```

## 6. Deployment

1. SQL'i Supabase'de çalıştır
2. Git commit & push
3. Vercel auto-deploy
4. 59 dakika sonra ilk post!

---

## Troubleshooting

**"Bot user not found" hatası:**
- SQL'i tekrar çalıştır
- Supabase → Table Editor → users → Kontrol et

**Gemini API hatası:**
- GEMINI_API_KEY doğru mu kontrol et
- Vercel env vars'da var mı?

**Post oluşturulmuyor:**
- Vercel Cron logs'u kontrol et
- CRON_SECRET doğru mu?
