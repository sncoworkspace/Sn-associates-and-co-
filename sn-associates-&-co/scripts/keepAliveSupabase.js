/**
 * Supabase Keep-Alive Health-Check Script
 * ---------------------------------------
 * Prevents Supabase Free Tier projects from automatically pausing after 7 days of inactivity.
 * This script queries the Supabase REST API endpoint every few days to keep the project warm and active.
 *
 * Usage:
 *   node scripts/keepAliveSupabase.js
 */

const https = require('https');
const http = require('http');

// Read from environment variables or .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

async function pingSupabase() {
    console.log('----------------------------------------------------');
    console.log('[Supabase Keep-Alive] Initializing Keep-Alive Ping...');
    console.log(`[Supabase Keep-Alive] Target URL: ${SUPABASE_URL}`);
    console.log(`[Supabase Keep-Alive] Timestamp: ${new Date().toISOString()}`);

    if (SUPABASE_URL.includes('placeholder')) {
        console.warn('[Supabase Keep-Alive] NOTICE: Using placeholder URL. Please set VITE_SUPABASE_URL in GitHub Secrets or .env file.');
        return;
    }

    try {
        const url = new URL(`${SUPABASE_URL}/rest/v1/`);
        const options = {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            timeout: 10000
        };

        const client = url.protocol === 'https:' ? https : http;

        const req = client.request(url, options, (res) => {
            console.log(`[Supabase Keep-Alive] HTTP Status Code: ${res.statusCode} ${res.statusMessage}`);
            if (res.statusCode >= 200 && res.statusCode < 400) {
                console.log('[Supabase Keep-Alive] SUCCESS: Supabase project is active and warmed up! Project will not pause.');
            } else {
                console.log(`[Supabase Keep-Alive] Project responded with status: ${res.statusCode}. Activity recorded.`);
            }
        });

        req.on('error', (err) => {
            console.error('[Supabase Keep-Alive] Connection Error:', err.message);
        });

        req.on('timeout', () => {
            req.destroy();
            console.error('[Supabase Keep-Alive] Request timed out after 10 seconds.');
        });

        req.end();
    } catch (err) {
        console.error('[Supabase Keep-Alive] Failed to execute ping:', err.message);
    }
}

pingSupabase();
