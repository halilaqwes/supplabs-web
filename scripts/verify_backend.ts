
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading env from:', envPath);
let envVars: Record<string, string> = {};

try {
    if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf-8');
        // Strip BOM if present
        if (envContent.charCodeAt(0) === 0xFEFF) {
            envContent = envContent.slice(1);
        }

        console.log('Env file found, length:', envContent.length);
        envContent.split(/\r?\n/).forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;

            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                envVars[key] = value;
            } else {
                console.log('Line did not match regex:', line.substring(0, 10) + '...');
            }
        });
        console.log('Loaded keys:', Object.keys(envVars));
    } else {
        console.error('Env file not found at:', envPath);
    }
} catch (e) {
    console.error('Could not read .env.local', e);
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
    console.log('Starting backend verification...');

    // 1. Test User Fetching (Case Insensitive)
    const testUsername = 'TestUser_' + Math.floor(Math.random() * 1000);
    const testEmail = `test_${Math.floor(Math.random() * 1000)}@example.com`;

    console.log(`\n1. Creating test user: ${testUsername}`);
    const { data: user, error: createError } = await supabase
        .from('users')
        .insert({
            email: testEmail,
            username: testUsername,
            handle: '@' + testUsername.toLowerCase(),
            password_hash: 'hash', // Dummy hash
            is_verified: false
        })
        .select()
        .single();

    if (createError) {
        console.error('Failed to create user:', createError);
        return;
    }
    console.log('User created:', user.id);

    console.log('Testing case-insensitive fetch...');
    const { data: fetchedUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .ilike('username', testUsername.toUpperCase()) // Test UPPERCASE
        .single();

    if (fetchError || !fetchedUser) {
        console.error('Failed to fetch user case-insensitively:', fetchError);
    } else {
        console.log('Case-insensitive fetch SUCCESS');
    }

    // 2. Test Post Creation
    console.log('\n2. Creating a post...');
    const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
            user_id: user.id,
            content: 'Test post content'
        })
        .select()
        .single();

    if (postError) {
        console.error('Failed to create post:', postError);
        return;
    }
    console.log('Post created:', post.id);

    // 3. Test Comment Creation (RPC check)
    console.log('\n3. Adding a comment...');
    // We are testing the raw insert here, but the API route had the RPC call.
    // We should verify if the trigger works.
    const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
            post_id: post.id,
            user_id: user.id,
            content: 'Test comment'
        })
        .select()
        .single();

    if (commentError) {
        console.error('Failed to add comment:', commentError);
    } else {
        console.log('Comment added:', comment.id);
    }

    // Check post comment count
    const { data: updatedPost } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', post.id)
        .single();

    console.log('Post comments count (should be 1):', updatedPost?.comments_count);

    // Clean up
    console.log('\nCleaning up...');
    await supabase.from('users').delete().eq('id', user.id);
    console.log('Done.');
}

runTests().catch(console.error);
