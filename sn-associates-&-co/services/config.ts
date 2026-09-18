/**
 * Centralized Configuration Service
 * Prevents direct usage of import.meta.env across the codebase.
 * Provides a single point for validation and defaults.
 */

interface Config {
    supabaseUrl: string;
    supabaseAnonKey: string;
    razorpayKeyId: string;
    apiUrl: string;
    isProduction: boolean;
}

const config: Config = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://caxpqdkabqqkwrhrajus.supabase.co',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0A6rDI3EwkWN6k3LoixepQ_OZu23_Vc',
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    apiUrl: import.meta.env.VITE_API_URL || '',
    isProduction: import.meta.env.PROD
};

// Validation
if (!config.supabaseUrl || !config.supabaseAnonKey) {
    if (config.isProduction) {
        console.error('CRITICAL: Supabase credentials missing in production environment!');
    } else {
        console.warn('Supabase credentials missing. Local development may be limited.');
    }
}

export default config;
