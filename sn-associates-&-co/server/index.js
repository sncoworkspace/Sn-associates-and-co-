const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Proper CORS matching Vite frontend to allow cookies
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'], // Add staging/prod URLs
    credentials: true // Crucial for accepting cross-origin cookies in dev
}));

app.use(express.json());
app.use(cookieParser());

// Initialize Supabase Server Client (Using Service Role for admin overrides)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://caxpqdkabqqkwrhrajus.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);


// --- Auth Endpoints (Cookie Based) --- //

// Security Best Practice: Strict HttpOnly Cookie configurations
const COOKIE_OPTIONS = {
    httpOnly: true, // Prevents Javascript XSS interception
    secure: process.env.NODE_ENV === 'production', // Enforce HTTPS strictly in production
    sameSite: 'lax', // CSRF Protection while allowing SPA routing
    path: '/'
};

// 1. Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password
        });

        if (error) return res.status(401).json({ error: error.message });
        if (!data.session) return res.status(401).json({ error: 'Session could not be established' });

        const maxAgeAccess = 1000 * 60 * 60; // 1 hour
        const maxAgeRefresh = 1000 * 60 * 60 * 24 * (rememberMe ? 30 : 7); // 30 days or 7 days

        // 🛡️ Securing JWTs inside HttpOnly Cookies directly
        res.cookie('sb_access_token', data.session.access_token, {
            ...COOKIE_OPTIONS,
            maxAge: maxAgeAccess
        });

        res.cookie('sb_refresh_token', data.session.refresh_token, {
            ...COOKIE_OPTIONS,
            maxAge: maxAgeRefresh
        });

        // Safe frontend cookie just predicting state (NOT sensitive)
        res.cookie('auth_status', 'logged_in', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: maxAgeRefresh
        });

        // Fetch profile to get definitive role and all metadata
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('name, phone, role, purchased_courses, joined_at, storage_used')
            .eq('id', data.user.id)
            .single();

        return res.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: profile?.name || data.user.user_metadata?.name || 'User',
                phone: profile?.phone || data.user.user_metadata?.phone || '',
                role: profile?.role || data.user.user_metadata?.role || 'user',
                purchasedCourses: profile?.purchased_courses || [],
                joinedAt: profile?.joined_at || data.user.created_at,
                storageUsed: profile?.storage_used || 0
            }
        });
        });
    } catch (err) {
        console.error("Login failure:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 1.5. Establish Session Endpoint (Used for OAuth/Google/Social sync)
app.post('/api/auth/session', async (req, res) => {
    try {
        const { access_token, refresh_token } = req.body;
        
        if (!access_token || !refresh_token) {
            return res.status(400).json({ error: 'Tokens are required' });
        }

        // 🛡️ Verify the access token with Supabase before trusting it
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired session token' });
        }

        // Set the secure HttpOnly cookies
        res.cookie('sb_access_token', access_token, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        res.cookie('sb_refresh_token', refresh_token, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days default
        });

        res.cookie('auth_status', 'logged_in', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        // Retrieve profile
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('name, phone, role, purchased_courses, joined_at, storage_used')
            .eq('id', user.id)
            .single();

        return res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: profile?.name || user.user_metadata?.name || 'User',
                phone: profile?.phone || user.user_metadata?.phone || '',
                role: profile?.role || user.user_metadata?.role || 'user',
                purchasedCourses: profile?.purchased_courses || [],
                joinedAt: profile?.joined_at || user.created_at,
                storageUsed: profile?.storage_used || 0
            }
        });
    } catch (err) {
        console.error("Session sync failure:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Refresh Session Endpoint (Silent Refresh)
app.post('/api/auth/refresh', async (req, res) => {
    try {
        const refresh_token = req.cookies.sb_refresh_token;
        if (!refresh_token) return res.status(401).json({ error: 'No refresh token available' });

        const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token });

        if (error || !data.session) {
            res.clearCookie('sb_access_token');
            res.clearCookie('sb_refresh_token');
            res.clearCookie('auth_status');
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }

        res.cookie('sb_access_token', data.session.access_token, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60
        });
        
        // Rolling session renewal
        res.cookie('sb_refresh_token', data.session.refresh_token, {
            ...COOKIE_OPTIONS,
            maxAge: 1000 * 60 * 60 * 24 * 7 
        });

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to refresh token' });
    }
});

// 3. User Profile Endpoint (Single Source of Truth)
// Requires Valid Access Token via Cookie
app.get('/api/auth/me', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized', needsRefresh: !!req.cookies.sb_refresh_token });

        // Retrieve user securely via the stored JWT
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(access_token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Token expired or invalid', needsRefresh: true });
        }

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('name, phone, role, purchased_courses')
            .eq('id', user.id)
            .single();

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: profile?.name || user.user_metadata?.name || 'User',
                role: profile?.role || user.user_metadata?.role || 'user',
                phone: profile?.phone,
                purchasedCourses: profile?.purchased_courses || []
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Logout Endpoint
app.post('/api/auth/logout', async (req, res) => {
    res.clearCookie('sb_access_token');
    res.clearCookie('sb_refresh_token');
    res.clearCookie('auth_status');
    return res.json({ success: true, message: 'Logged out successfully' });
});

// --- Existing Razorpay Endpoints --- //
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, bookingDetails } = req.body;
        
        let pendingBookingId = null;

        // Secure DB Check & Lock before Payment!
        if (bookingDetails) {
            const { consultant_id, date, time, name, email, phone, notes, user_id } = bookingDetails;
            
            let insertData = {
                 consultant_id, date, time, name, email, phone, notes,
                 amount: amount, status: 'pending', user_id: user_id || null
            };
            
            let { data: booking, error: dbError } = await supabaseAdmin
                .from('consultation_bookings')
                .insert([insertData])
                .select()
                .single();
                
            // Fallback for older schema
            if (dbError && dbError.message && dbError.message.includes('Could not find')) {
                insertData = {
                    date, time, name, email, phone, notes,
                    user_id: user_id || null
                };
                const fallback = await supabaseAdmin
                    .from('consultation_bookings')
                    .insert([insertData])
                    .select()
                    .single();
                booking = fallback.data;
                dbError = fallback.error;
            }

            if (dbError) {
                 console.error('Database Error during booking initialization:', dbError);
                 if (dbError.code === '23505') {
                     return res.status(409).json({ error: "Focus lost. Time slot just booked by someone else. Please select another time." });
                 }
                 if (dbError.code === '23503') { // Foreign Key Violation
                     return res.status(400).json({ error: "Invalid consultant selected or consultant data is missing in the database.", details: dbError.message });
                 }
                 throw dbError;
            }
            pendingBookingId = booking?.id;

        }

        const options = { amount: amount * 100, currency, receipt, payment_capture: 1 };
        const order = await razorpay.orders.create(options);

        // Map Razorpay returned Order ID to DB to track this pending transaction
        if (pendingBookingId) {
             await supabaseAdmin.from('consultation_bookings')
                 .update({ payment_id: order.id })
                 .eq('id', pendingBookingId);
             
             return res.json({ ...order, booking_id: pendingBookingId });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create payment order', details: error.description || error.message });
    }
});

app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, is_booking } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString()).digest('hex');

        if (expectedSignature === razorpay_signature) {
             if (is_booking) {
                 // Securely Confirm Booking Post-Payment Success
                 const { error: updateError } = await supabaseAdmin.from('consultation_bookings')
                      .update({ status: 'confirmed' })
                      .eq('payment_id', razorpay_order_id);
                      
                 // Ignore error if 'status' column does not exist on older schemas
                 if (updateError && !updateError.message.includes('Could not find')) {
                      console.error('Failed to update booking status', updateError);
                 }
             }
             res.json({ status: 'success' });
        } else {
             res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Academy Asset Library & Analytics Endpoints --- //

// 1. Get Dashboard Stats
app.get('/api/academy/stats', async (req, res) => {
    try {
        // In a real high-scale app, we would use a materialized view or aggregated table.
        // For now, we fetch summary from academy_assets.
        const { data: assets, error } = await supabaseAdmin
            .from('academy_assets')
            .select('type, total_views, total_downloads, total_applicants');

        if (error) throw error;

        const stats = {
            totalAssets: assets.length,
            totalViews: assets.reduce((sum, a) => sum + (a.total_views || 0), 0),
            totalDownloads: assets.reduce((sum, a) => sum + (a.total_downloads || 0), 0),
            totalApplicants: assets.reduce((sum, a) => sum + (a.total_applicants || 0), 0),
            byType: {
                ebook: assets.filter(a => a.type === 'ebook').length,
                course: assets.filter(a => a.type === 'course').length,
                internship: assets.filter(a => a.type === 'internship').length
            }
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// 2. Track Engagement
app.post('/api/academy/track', async (req, res) => {
    try {
        const { assetId, eventType, duration, userId, metadata } = req.body;
        
        // Log the event
        const { error: logError } = await supabaseAdmin
            .from('academy_analytics')
            .insert([{
                asset_id: assetId,
                event_type: eventType,
                duration_seconds: duration || 0,
                user_id: userId || null,
                metadata: metadata || {}
            }]);

        if (logError) throw logError;

        // Increment aggregate counters on the asset
        if (eventType === 'view') {
            await supabaseAdmin.rpc('increment_asset_views', { asset_id: assetId });
        } else if (eventType === 'download') {
            await supabaseAdmin.rpc('increment_asset_downloads', { asset_id: assetId });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Tracking error:", err);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

// 3. Bulk Upload Assets (CSV)
app.post('/api/academy/bulk-upload', async (req, res) => {
    try {
        // Security: Check if admin
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { assets } = req.body; // Array of asset objects from frontend CSV parser
        if (!Array.isArray(assets)) return res.status(400).json({ error: 'Invalid data format' });

        const { data, error } = await supabaseAdmin
            .from('academy_assets')
            .insert(assets.map(a => ({
                ...a,
                status: a.status || 'published',
                author_name: a.author_name || 'Nagendra M'
            })));

        if (error) throw error;

        res.json({ success: true, count: assets.length });
    } catch (err) {
        res.status(500).json({ error: 'Bulk upload failed' });
    }
});

// 4. Bulk Upload Resources (CSV)
app.post('/api/resources/bulk-upload', async (req, res) => {
    try {
        // Security: Check if admin
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { resources, filename } = req.body; 
        if (!Array.isArray(resources)) return res.status(400).json({ error: 'Invalid data format' });

        const { data, error } = await supabaseAdmin
            .from('resources')
            .insert(resources);

        if (error) throw error;
        
        // Log the import
        await supabaseAdmin.from('csv_import_logs').insert([{
            filename: filename || 'unknown_resources.csv',
            row_count: resources.length,
            target_table: 'resources',
            status: 'success'
        }]);

        res.json({ success: true, count: resources.length });
    } catch (err) {
        console.error("Bulk upload resources failed:", err);
        res.status(500).json({ error: 'Bulk upload failed' });
    }
});

// Helper to get File ID from GDrive URL
const getFileId = (url) => {
    if (!url) return null;
    const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/|spreadsheets\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// 7. Google Drive Proxy Endpoints
app.get('/api/gdrive/metadata', async (req, res) => {
    try {
        const { url } = req.query;
        const fileId = getFileId(url);
        if (!fileId) return res.status(400).json({ error: 'Invalid Google Drive URL' });

        const https = require('https');
        https.get(`https://drive.google.com/file/d/${fileId}/view`, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                const titleMatch = data.match(/<title>(.*?)<\/title>/);
                const ogTitleMatch = data.match(/property="og:title" content="(.*?)"/);
                const ogDescMatch = data.match(/property="og:description" content="(.*?)"/);
                
                let title = (ogTitleMatch ? ogTitleMatch[1] : (titleMatch ? titleMatch[1] : '')).split(' - Google Drive')[0];
                let description = ogDescMatch ? ogDescMatch[1] : '';

                res.json({ title, description, fileId });
            });
        }).on('error', (err) => {
            console.error("GDrive metadata error:", err);
            res.status(500).json({ error: 'Failed to fetch metadata' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/gdrive/fetch-csv', async (req, res) => {
    try {
        const { url } = req.query;
        const fileId = getFileId(url);
        if (!fileId) return res.status(400).json({ error: 'Invalid Google Drive URL' });

        const https = require('https');
        // Try Sheet export first, fallback to uc?export
        const exportUrl = url.includes('spreadsheets') 
            ? `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv`
            : `https://drive.google.com/uc?export=download&id=${fileId}`;

        const fetchWithRedirect = (fetchUrl) => {
            https.get(fetchUrl, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    fetchWithRedirect(response.headers.location);
                } else {
                    let data = '';
                    response.on('data', (chunk) => { data += chunk; });
                    response.on('end', () => res.send(data));
                }
            }).on('error', (err) => {
                console.error("GDrive fetch error:", err);
                res.status(500).json({ error: 'Failed to fetch content' });
            });
        };

        fetchWithRedirect(exportUrl);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
