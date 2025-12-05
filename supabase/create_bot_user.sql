-- Create AI bot user for supplement tips
INSERT INTO users (
    username, 
    email, 
    handle, 
    avatar,
    password_hash,
    is_verified,
    is_official,
    role
) VALUES (
    'Supp Bilgi Botu',
    'bot@supplabs.com',
    '@suppbot',
    'https://api.dicebear.com/7.x/bottts/svg?seed=suppbot',
    '$2a$10$dummyhashforbotusernologinneeded1234567890',
    true,
    true,
    'ai_bot'
)
ON CONFLICT (email) DO NOTHING;
