
import { createClient } from '@supabase/supabase-js';

// Server-side client with service role key (for API routes)
// Server-side client with service role key (for API routes)
// Note: Fallback values prevent build failures when env vars are missing.
// The actual keys must be provided in the environment for the app to function.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);
