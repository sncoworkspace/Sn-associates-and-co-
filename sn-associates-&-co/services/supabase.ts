import { createClient } from '@supabase/supabase-js';
import config from './config';

const supabaseUrl = (config.supabaseUrl && !config.supabaseUrl.includes('placeholder'))
    ? config.supabaseUrl
    : 'https://caxpqdkabqqkwrhrajus.supabase.co';

const supabaseAnonKey = (config.supabaseAnonKey && !config.supabaseAnonKey.includes('placeholder'))
    ? config.supabaseAnonKey
    : 'sb_publishable_0A6rDI3EwkWN6k3LoixepQ_OZu23_Vc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
