
import { createClient } from '@supabase/supabase-js';

// Live Supabase Credentials for Project: caxpqdkabqqkwrhrajus
const SUPABASE_URL = 'https://caxpqdkabqqkwrhrajus.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0A6rDI3EwkWN6k3LoixepQ_OZu23_Vc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
