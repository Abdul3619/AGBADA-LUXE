import { createClient } from '@supabase/supabase-js';

// The URL and publishable key are public by design: the database only exposes the agbada_* functions,
// every table has row level security with no policies, and admin actions need a session token.
// Both can be overridden per environment with VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aqilclozwukdnogqcmsy.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_WxRQU6rp23egBw82BowR0Q_87CaKcsS';

export const MEDIA_BUCKET = 'agbada-media';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
