const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Unified Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const { data, error } = await supabaseAdmin.auth.signUp({
            email, password, options: { data: { name, phone, role: 'user' } }
        });
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/reset-password-request', async (req, res) => {
    try {
        const { email, redirectTo } = req.body;
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo || 'http://localhost:3000/reset-password'
        });
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ success: true, message: 'Recovery link sent' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});


// Proper CORS matching Vite frontend to allow cookies
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'], // Add staging/prod URLs
    credentials: true // Crucial for accepting cross-origin cookies in dev
}));

app.use(express.json());
app.use(cookieParser());

// Initialize Supabase Server Client (Using Service Role for admin overrides)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Supabase backend credentials missing!');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);


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

// 5. Individual Resource Operations
app.post('/api/resources', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { resource } = req.body;
        const { data, error } = await supabaseAdmin.from('resources').insert([resource]).select().single();
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Create resource failed:", err);
        res.status(500).json({ error: err.message || 'Failed to create resource' });
    }
});

app.patch('/api/resources/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { id } = req.params;
        const { resource } = req.body;
        const { data, error } = await supabaseAdmin.from('resources').update(resource).eq('id', id).select().single();
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Update resource failed:", err);
        res.status(500).json({ error: err.message || 'Failed to update resource' });
    }
});

app.delete('/api/resources/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token);
        if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { id } = req.params;
        const { error } = await supabaseAdmin.from('resources').delete().eq('id', id);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error("Delete resource failed:", err);
        res.status(500).json({ error: err.message || 'Failed to delete resource' });
    }
});

// 6. Academy Asset Operations
app.post('/api/academy/assets', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { asset } = req.body;
        const { data, error } = await supabaseAdmin.from('academy_assets').insert([asset]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/academy/assets/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { asset } = req.body;
        const { data, error } = await supabaseAdmin.from('academy_assets').update(asset).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/academy/assets/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('academy_assets').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Blog Operations
app.post('/api/blogs', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { blog } = req.body;
        const { data, error } = await supabaseAdmin.from('blogs').insert([blog]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/blogs/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { blog } = req.body;
        const { data, error } = await supabaseAdmin.from('blogs').update(blog).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('blogs').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Service Operations
app.post('/api/services', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { service } = req.body;
        const { data, error } = await supabaseAdmin.from('services').insert([service]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/services/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { service } = req.body;
        const { data, error } = await supabaseAdmin.from('services').update(service).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('services').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. User Management
app.patch('/api/users/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { userData } = req.body;
        const { data, error } = await supabaseAdmin.from('profiles').update(userData).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

// 10. Bulk Academy Asset Import
app.post('/api/academy/assets/bulk', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { assets, log } = req.body;
        const { data, error } = await supabaseAdmin.from('academy_assets').insert(assets);
        if (error) throw error;

        if (log) {
            await supabaseAdmin.from('csv_import_logs').insert([log]);
        }

        res.json({ success: true, count: assets.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Form Management (Inquiries, Bookings, Enrollments, Leads)
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, service, company, message } = req.body;

        // 1. Save to Supabase (Analytics & Backup)
        const { error: dbError } = await supabaseAdmin.from('contact_submissions').insert([{
            name,
            email,
            phone,
            service,
            message,
            created_at: new Date().toISOString()
        }]);
        
        if (dbError) console.error("Supabase Log Error:", dbError);

        // 2. Send Internal Lead Email to Admin
        await resend.emails.send({
            from: 'SNA Leads <onboarding@resend.dev>',
            to: ['snco.workspace@gmail.com', 'audit.snassociates@gmail.com'],
            subject: `New Lead: ${name} (${service || 'General'})`,
            html: `
                <div style="font-family: sans-serif; padding: 24px; color: #1e293b;">
                    <h2 style="color: #1d4ed8; margin-top: 0;">New Lead Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Service:</strong> ${service || 'General Inquiry'}</p>
                    <p><strong>Company:</strong> ${company || 'N/A'}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px;">
                        ${message}
                    </div>
                </div>
            `
        });

        // 3. Send Professional Confirmation to Customer
        await resend.emails.send({
            from: 'SN Associates & Co <onboarding@resend.dev>',
            to: email,
            subject: 'Inquiry Received | SN Associates & Co',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background: #1e3a8a; color: white; padding: 32px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us</h1>
                    </div>
                    <div style="padding: 32px; color: #334155; line-height: 1.6;">
                        <p>Hello ${name.split(' ')[0]},</p>
                        <p>We've successfully received your inquiry regarding <strong>${service || 'our professional services'}</strong>.</p>
                        <p>Our team of tax and legal experts will review your details and contact you within 24 business hours to discuss the next steps.</p>
                        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 14px; text-align: center;">
                            <p style="margin: 0; font-weight: 600;">SN Associates & Co</p>
                            <p style="margin: 4px 0 0; color: #64748b;">Tax, Legal & Compliance Experts</p>
                        </div>
                    </div>
                </div>
            `
        });

        res.json({ success: true, message: 'Lead captured successfully' });
    } catch (err) {
        console.error("Lead processing error:", err);
        res.status(500).json({ error: 'Failed to process lead submission' });
    }
});

app.delete('/api/forms/contact/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('contact_submissions').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/forms/bookings/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('consultation_bookings').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/forms/enrollments/:id', async (req, res) => {
    try {
        const access_token = req.cookies.sb_access_token;
        if (!access_token) return res.status(401).json({ error: 'Unauthorized' });
        const { data: { user } } = await supabaseAdmin.auth.getUser(access_token);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user?.id).single();
        if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { error } = await supabaseAdmin.from('enrollments').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
