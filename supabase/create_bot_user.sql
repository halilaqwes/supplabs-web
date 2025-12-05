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
