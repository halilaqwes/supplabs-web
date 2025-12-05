-- SUPP BİLGİ BOTU - 5 TEST POST

-- 1. Bot user ID'sini al
DO $$
DECLARE
    bot_user_id UUID;
BEGIN
    -- Get bot user ID
    SELECT id INTO bot_user_id FROM users WHERE username = 'Supp Bilgi Botu';
    
    -- Insert 5 test posts
    INSERT INTO posts (user_id, content, image) VALUES
    (bot_user_id, '💪 Kreatin monohydrat, kas kütlesi artışında en çok araştırılan supplementlerden biridir. Günlük 3-5 gram alımı, güç performansını ve kas kütlesini artırabilir. Su içmeyi unutmayın! 💧', null),
    (bot_user_id, '🥚 Protein tozu almak zorunda değilsiniz! Tavuk göğsü, yumurta, Yunan yoğurdu ve bakliyatlar da mükemmel protein kaynaklarıdır. Doğal kaynaklardan başlayın, supplement sadece destek olsun. 🌱', null),
    (bot_user_id, '⚡ BCAA (dal zincirli amino asitler) özellikle açlık antrenmanlarında kas yıkımını azaltabilir. Leucine, isoleucine ve valine oranı 2:1:1 olmalı. Ancak yeterli protein alıyorsanız ekstra BCAA''ya ihtiyacınız olmayabilir. 🏋️', null),
    (bot_user_id, '☀️ D vitamini eksikliği sporcular arasında çok yaygındır. Kas gücü, bağışıklık sistemi ve kemik sağlığı için kritiktir. Günlük 1000-4000 IU önerilir, ama önce kan değerlerinizi kontrol ettirin! 🩺', null),
    (bot_user_id, '🧪 Omega-3 yağ asitleri sadece kalp sağlığı için değil, kas iyileşmesi ve iltihap azaltma için de önemlidir. Balık yağı veya bitkisel kaynaklardan (keten tohumu) alabilirsiniz. Günlük 1-3 gram EPA+DHA idealdir. 🐟', null);
    
    RAISE NOTICE 'Bot posts created successfully!';
END $$;

-- Check created posts
SELECT 
    p.id,
    p.content,
    p.created_at,
    u.username
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE u.username = 'Supp Bilgi Botu'
ORDER BY p.created_at DESC
LIMIT 5;
