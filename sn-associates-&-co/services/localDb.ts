
import { supabase } from './supabase';
import { User, Product, Order, SecurityLog, ProfessionalService, ServiceResource, EbookResource, ConsultationPayment } from '../types';
import { courses as dummyCourses } from '../data/courseData';
import { authService } from './authService';

import { emailService } from './emailService';
import { fallbackServices } from '../data/serviceData';

/**
 * REPLACE THIS URL with your actual Google Apps Script Web App URL 
 * after you deploy it using the instructions provided.
 */
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby_placeholder/exec";
const FORMSPREE_URL = "https://formspree.io/f/xvzprqlw";

// Internal helper to send notifications to Google Sheets and Email
const sendNotification = async (type: string, data: any) => {
    const payload = { ...data, form_type: type, timestamp: new Date().toISOString() };

    console.log(`Sending notification for ${type}...`, payload);

    // 1. Resend Emails (Admin + User) - Priority
    try {
        await emailService.sendNotification(type, data);
    } catch (e) {
        console.error("Email notification failed:", e);
    }

    // 2. Google Sheets Sync
    try {
        if (GOOGLE_SHEETS_URL && !GOOGLE_SHEETS_URL.includes('placeholder')) {
            await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (e) { console.error("Sheets sync fail:", e); }

    // 3. Backup (Formspree)
    try {
        if (FORMSPREE_URL) {
            await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });
        }
    } catch (e) { console.error("Backup (Formspree) fail:", e); }
};


const SERVICE_IMAGES: Record<string, string> = {
    "GST Registration & Amendments": "https://www.gstsuvidhacenters.com/WebsiteAssets/images/Services/GSTRegistrationAndCertificate.png",
    "Proprietorship Registration": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    "Private Limited Company Registration": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    "Income Tax Advisory & ITR Filing": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800",
};


export const authDb = {
    getCurrentUser: (): User | null => {
        return authService.getCurrentUserSync();
    },
    logout: async () => {
        await authService.logout();
    },
    getAllUsers: async (): Promise<User[]> => {
        const { data } = await supabase.from('profiles').select('*');
        return (data || []).map(p => ({
            id: p.id,
            name: p.name,
            email: p.email || '',
            phone: p.phone,
            role: p.role,
            purchasedCourses: p.purchased_courses || [],
            joinedAt: p.joined_at,
            storageUsed: p.storage_used || 0,
            isBlocked: p.is_blocked
        }));
    },
    toggleUserBlock: async (userId: string) => {
        const { data: profile } = await supabase.from('profiles').select('is_blocked').eq('id', userId).single();
        const { error } = await supabase.from('profiles').update({ is_blocked: !profile?.is_blocked }).eq('id', userId);
        if (error) throw error;
    },
    updateUser: async (userId: string, userData: Partial<User>) => {
        const { error } = await supabase.from('profiles').update({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            is_blocked: userData.isBlocked
        }).eq('id', userId);
        if (error) throw error;
    }
};

export const productDb = {
    getAll: async (): Promise<Product[]> => {
        const { data } = await supabase.from('academy_assets').select('*').eq('status', 'published').order('created_at', { ascending: false });
        return (data || []).map(p => ({
            id: p.id,
            title: p.title,
            type: p.type as any,
            price: p.amount || 0,
            originalPrice: p.amount || 0,
            image: p.image_url || 'https://images.unsplash.com/photo-1454165833767-1316b044d1d7?auto=format&fit=crop&q=80&w=800',
            description: p.description,
            features: p.features || [],
            rating: p.rating || 5.0,
            students: p.students || 0,
            author: p.author || 'Nagendra M',
            updatedDate: p.updated_at || new Date().toISOString(),
            language: p.language || 'English',
            driveLink: p.drive_link,
            youtubeLink: p.youtube_link,
            content: p.content || []
        }));
    },
    getById: async (id: string): Promise<Product | null> => {
        const { data } = await supabase.from('academy_assets').select('*').eq('id', id).single();
        if (!data) return null;
        return {
            id: data.id,
            title: data.title,
            type: data.type as any,
            price: data.amount || 0,
            originalPrice: data.amount || 0,
            image: data.image_url || 'https://images.unsplash.com/photo-1454165833767-1316b044d1d7?auto=format&fit=crop&q=80&w=800',
            description: data.description,
            features: data.features || [],
            rating: data.rating || 5.0,
            students: data.students || 0,
            author: data.author || 'Nagendra M',
            updatedDate: data.updated_at || new Date().toISOString(),
            language: data.language || 'English',
            driveLink: data.drive_link,
            youtubeLink: data.youtube_link,
            content: data.content || []
        };
    },
    create: async (product: any) => {
        const { error } = await supabase.from('academy_assets').insert([{
            title: product.title,
            type: product.type.toLowerCase(),
            amount: product.price,
            image_url: product.image,
            description: product.description,
            youtube_link: product.youtubeLink,
            drive_link: product.driveLink,
            status: 'published'
        }]);
        if (error) throw error;
    },
    seedProducts: async () => {
        const formatted = dummyCourses.map(p => ({
            title: p.title,
            type: p.type,
            price: p.price,
            original_price: p.originalPrice,
            image: p.image,
            description: p.description,
            features: p.features,
            rating: p.rating,
            students: p.students,
            author: p.author,
            updated_date: p.updatedDate,
            language: p.language,
            drive_link: (p as any).driveLink,
            content: p.content
        }));

        const { error } = await supabase.from('products').insert(formatted);
        if (error) throw error;
        return true;
    },
    delete: async (id: string) => {
        const { error } = await supabase.from('academy_assets').delete().eq('id', id);
        if (error) throw error;
    },
    update: async (id: string, product: any) => {
        const { error } = await supabase.from('academy_assets').update({
            title: product.title,
            type: product.type.toLowerCase(),
            amount: product.price,
            image_url: product.image,
            description: product.description,
            features: product.features,
            author: product.author,
            updated_at: product.updatedDate || new Date().toISOString(),
            language: product.language,
            drive_link: product.driveLink,
            youtube_link: product.youtubeLink,
            content: product.content
        }).eq('id', id);
        if (error) throw error;
    }
};

export const cartDb = {
    getCart: (): Product[] => JSON.parse(localStorage.getItem('sn_db_cart') || '[]'),
    addToCart: (product: Product) => {
        const cart = cartDb.getCart();
        if (!cart.find(p => p.id === product.id)) {
            cart.push(product);
            localStorage.setItem('sn_db_cart', JSON.stringify(cart));
            window.dispatchEvent(new Event("cart-updated"));
        }
    },
    removeFromCart: (productId: string) => {
        const cart = cartDb.getCart().filter(p => p.id !== productId);
        localStorage.setItem('sn_db_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
    },
    clearCart: () => {
        localStorage.removeItem('sn_db_cart');
        window.dispatchEvent(new Event("cart-updated"));
    },
    getCount: (): number => cartDb.getCart().length
};

export const orderDb = {
    createOrder: async (userId: string, items: Product[], totalAmount: number, paymentId: string) => {
        const orderId = `ORD-${Date.now()}`;
        const { data: profile } = await supabase.from('profiles').select('purchased_courses, name, email').eq('id', userId).single();
        const existing = profile?.purchased_courses || [];
        const updated = [...new Set([...existing, ...items.map(i => i.id)])];

        try {
            await supabase.from('profiles').update({ purchased_courses: updated }).eq('id', userId);
        } catch (err) { console.error(err); }

        const localUser = authDb.getCurrentUser();
        if (localUser && localUser.id === userId) {
            localUser.purchasedCourses = updated;
            localStorage.setItem('sn_db_current_user', JSON.stringify(localUser));
            window.dispatchEvent(new Event('storage'));
        }

        try {
            await supabase.from('orders').insert({
                id: orderId,
                user_id: userId,
                items: JSON.stringify(items),
                total_amount: totalAmount,
                payment_id: paymentId,
                status: 'success',
                date: new Date().toISOString()
            });
            // Send email notifications (Admin + User)
            await sendNotification('Course Purchase', {
                name: profile?.name || 'Customer',
                email: profile?.email || '',
                id: orderId,
                total: totalAmount,
                payment_id: paymentId,
                items: items.map(i => i.title).join(', ')
            });
        } catch (e) { console.warn(e); }

        return {
            id: orderId,
            userId,
            userName: profile?.name || 'Customer',
            userEmail: profile?.email || '',
            items,
            totalAmount,
            status: 'success' as const,
            paymentId,
            date: new Date().toISOString()
        };
    },
    getAllOrders: async (): Promise<Order[]> => {
        const { data } = await supabase.from('orders').select('*, profiles(name, email)').order('date', { ascending: false });
        return (data || []).map(o => ({
            id: o.id,
            userId: o.user_id,
            userName: (o.profiles as any)?.name || 'User',
            userEmail: (o.profiles as any)?.email || '',
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            totalAmount: o.total_amount,
            status: o.status as any,
            paymentId: o.payment_id,
            date: o.date
        }));
    },
    getStats: async () => {
        const { data: orderData } = await supabase.from('orders').select('total_amount');
        const revenue = orderData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
        const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        return { revenue, totalOrders: totalOrders || 0, totalUsers: totalUsers || 0 };
    }
};

export const blogDb = {
    getAll: async () => {
        const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        return (data || []).map((b: any) => ({
            ...b,
            date: b.created_at ? new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'
        }));
    },
    create: async (blog: any) => {
        const { error } = await supabase.from('blogs').insert([blog]);
        if (error) throw error;
    },
    delete: async (id: string) => {
        await supabase.from('blogs').delete().eq('id', id);
    },
    update: async (id: string, blog: any) => {
        const { error } = await supabase.from('blogs').update(blog).eq('id', id);
        if (error) throw error;
    }
};

export const formDb = {
    submitContact: async (formData: any) => {
        console.log("Submitting contact inquiry to Supabase...");
        const { error } = await supabase.from('contact_submissions').insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            created_at: formData.created_at || new Date().toISOString()
        }]);

        if (error) {
            console.error("Supabase Contact Error:", error);
            throw error;
        }

        await sendNotification('Contact Inquiry', formData);
    },
    getContactSubmissions: async () => {
        const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
        return data || [];
    },
    submitBooking: async (bookingData: any) => {
        console.log("Submitting consultation booking to Supabase...");
        const { error } = await supabase.from('consultation_bookings').insert([{
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            date: bookingData.date,
            time: bookingData.time,
            notes: bookingData.notes,
            payment_id: bookingData.payment_id,
            user_id: bookingData.user_id || authDb.getCurrentUser()?.id || null,
            created_at: bookingData.created_at || new Date().toISOString()
        }]);

        if (error) {
            console.error("Supabase Booking Error:", error);
            if (error.code === '23505') {
                 throw new Error("This time slot was just booked by someone else. Please select another time.");
            }
            throw new Error(error.message || "Failed to submit booking");
        }

        await sendNotification('Consultation Booking', bookingData);
    },
    getPublicBookedSlots: async (startDate: string, endDate: string, consultantId: string) => {
        const { data, error } = await supabase.rpc('get_public_booked_slots_v2', {
            start_date: startDate,
            end_date: endDate,
            p_consultant_id: consultantId
        });
        if (error) {
            console.error("Failed to fetch public slots:", error);
            return [];
        }
        return data || [];
    },
    getBookings: async () => {
        const { data } = await supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false });
        return data || [];
    },
    getConsultants: async () => {
        const { data } = await supabase.from('consultants').select('*').eq('is_active', true).order('name');
        return data || [];
    },
    submitEnrollment: async (enrollmentData: any) => {
        console.log("Submitting enrollment to Supabase...", enrollmentData);

        // Map frontend camelCase to database snake_case
        const dbData = {
            name: enrollmentData.name,
            email: enrollmentData.email,
            phone: enrollmentData.phone,
            college_profession: enrollmentData.collegeProfession || enrollmentData.college_profession || enrollmentData.college_profession,
            program: enrollmentData.program,
            price: enrollmentData.price,
            payment_status: enrollmentData.payment_status || 'success',
            payment_id: enrollmentData.payment_id,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('enrollments').insert([dbData]);

        if (error) {
            console.error("Supabase Enrollment Error:", error);
            throw error;
        }

        await sendNotification('Internship Enrollment', enrollmentData);
    },
    getEnrollments: async () => {
        const { data } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
        return data || [];
    }
};

export const servicesDb = {
    getAll: async (): Promise<ProfessionalService[]> => {
        const { data, error } = await supabase
            .from('professional_services')
            .select(`
                *,
                service_resources (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase fetch error, using fallback:", error);
            return fallbackServices;
        }

        if (!data || data.length === 0) {
            return fallbackServices;
        }

        return (data || []).map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            applicableClients: s.applicable_clients || [],
            fees: s.fees,
            status: s.status,
            resources: (s.service_resources || []).map((r: any) => ({
                id: r.id,
                name: r.name,
                link: r.link,
                type: r.type,
                access: r.access,
                isPublic: r.is_public
            })),
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            image: SERVICE_IMAGES[s.name] || (s as any).image
        }));
    },

    create: async (service: Partial<ProfessionalService>) => {
        const { data, error } = await supabase
            .from('professional_services')
            .insert([{
                name: service.name,
                category: service.category,
                description: service.description,
                applicable_clients: service.applicableClients,
                fees: service.fees,
                status: service.status || 'Active'
            }])
            .select()
            .single();

        if (error) throw error;

        if (service.resources && service.resources.length > 0) {
            const resources = service.resources.map(r => ({
                service_id: data.id,
                name: r.name,
                link: r.link,
                type: r.type,
                access: r.access,
                is_public: r.isPublic
            }));
            await supabase.from('service_resources').insert(resources);
        }

        return data;
    },

    update: async (id: string, service: Partial<ProfessionalService>) => {
        const { error: serviceError } = await supabase
            .from('professional_services')
            .update({
                name: service.name,
                category: service.category,
                description: service.description,
                applicable_clients: service.applicableClients,
                fees: service.fees,
                status: service.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (serviceError) throw serviceError;

        if (service.resources) {
            await supabase.from('service_resources').delete().eq('service_id', id);

            if (service.resources.length > 0) {
                const resources = service.resources.map(r => ({
                    service_id: id,
                    name: r.name,
                    link: r.link,
                    type: r.type,
                    access: r.access,
                    is_public: r.isPublic
                }));
                await supabase.from('service_resources').insert(resources);
            }
        }
    },

    delete: async (id: string) => {
        const { error } = await supabase.from('professional_services').delete().eq('id', id);
        if (error) throw error;
    },

    seedServices: async () => {
        const productionServices = [
            // 1. Business Entity Incorporation & Registration
            { name: "Proprietorship Registration", category: "Business Entity Incorporation & Registration", description: "Simple business structure for individual owners.", applicable_clients: ["Individuals"], fees: "Custom", status: "Active" },
            { name: "Partnership Firm Registration", category: "Business Entity Incorporation & Registration", description: "Legal setup for shared business ownership.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "LLP Registration", category: "Business Entity Incorporation & Registration", description: "Limited liability protection with partnership flexibility.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Private Limited Company Registration", category: "Business Entity Incorporation & Registration", description: "Corporate structure ideal for startups and funding.", applicable_clients: ["Startups", "Businesses"], fees: "Custom", status: "Active" },
            { name: "One Person Company (OPC)", category: "Business Entity Incorporation & Registration", description: "Single-owner corporate entity with limited liability.", applicable_clients: ["Individuals", "Startups"], fees: "Custom", status: "Active" },
            { name: "Trust, Society & Section 8 Company", category: "Business Entity Incorporation & Registration", description: "Non-profit and charitable organization setups.", applicable_clients: ["Individuals", "Businesses"], fees: "Custom", status: "Active" },
            { name: "Indian & Foreign Subsidiary Setup", category: "Business Entity Incorporation & Registration", description: "Cross-border business expansion solutions.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Nidhi Company Registration", category: "Business Entity Incorporation & Registration", description: "Registration for mutual benefit companies in the NBFC sector.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Startup India Registration", category: "Business Entity Incorporation & Registration", description: "DPIIT recognition for startups to unlock tax benefits and incentives.", applicable_clients: ["Startups"], fees: "Custom", status: "Active" },

            // 2. Post-Incorporation & Business Registrations
            { name: "PAN & TAN Application", category: "Post-Incorporation & Business Registrations", description: "Essential tax identification numbers.", applicable_clients: ["Individuals", "Businesses"], fees: "Custom", status: "Active" },
            { name: "GST Registration & Amendments", category: "Post-Incorporation & Business Registrations", description: "Statutory indirect tax registration and updates.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "MSME (Udyam) Registration", category: "Post-Incorporation & Business Registrations", description: "Government recognition for MSME benefits.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Shop & Establishment License", category: "Post-Incorporation & Business Registrations", description: "Mandatory state-level commercial registration.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "PF & ESI Registration", category: "Post-Incorporation & Business Registrations", description: "Social security compliance for employee welfare.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Trade & FSSAI (Food) License", category: "Post-Incorporation & Business Registrations", description: "Industrial trade and food safety certifications.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Startup India Registration (Post-Inc)", category: "Post-Incorporation & Business Registrations", description: "Recognition for tax holidays and benefits.", applicable_clients: ["Startups"], fees: "Custom", status: "Active" },

            // 3. Tax & Legal Compliance Services
            { name: "Income Tax Advisory & ITR Filing", category: "Tax & Legal Compliance Services", description: "Strategic planning and return filing.", applicable_clients: ["Individuals", "Businesses"], fees: "Custom", status: "Active" },
            { name: "Income Tax & GST Audit", category: "Tax & Legal Compliance Services", description: "Professional verification of accounts and tax.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "E-TDS Filing", category: "Tax & Legal Compliance Services", description: "Quarterly filing for tax deducted at source.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Representation & Appeals", category: "Tax & Legal Compliance Services", description: "Legal defense before tax authorities.", applicable_clients: ["Individuals", "Businesses"], fees: "Custom", status: "Active" },
            { name: "ROC Annual Filings", category: "Tax & Legal Compliance Services", description: "Corporate compliance with the Registrar of Companies.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "FDI & FEMA Compliance", category: "Tax & Legal Compliance Services", description: "Managing foreign investment regulations.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Share Transfer & Reporting", category: "Tax & Legal Compliance Services", description: "Legal documentation for equity changes.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },

            // 4. Outsourcing, Accounting & CFO Services
            { name: "Virtual CFO Services", category: "Outsourcing, Accounting & CFO Services", description: "High-level strategic financial leadership.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Outsourced Accounting & Bookkeeping", category: "Outsourcing, Accounting & CFO Services", description: "Digital accounting on Tally/Zoho/Quickbooks.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Payroll & Labour Law", category: "Outsourcing, Accounting & CFO Services", description: "Monthly salary processing and labour compliance.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "CMA Data & Project Reports", category: "Outsourcing, Accounting & CFO Services", description: "Financial projections for bank loans.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Business Valuation", category: "Outsourcing, Accounting & CFO Services", description: "Accurate valuation for funding and mergers.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Due Diligence Services", category: "Outsourcing, Accounting & CFO Services", description: "Comprehensive legal and financial audits.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Registered Valuer Services", category: "Outsourcing, Accounting & CFO Services", description: "Official IBBI-certified valuations.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },

            // 5. Digital, Technology & Growth Services
            { name: "Website Design & Development", category: "Digital, Technology & Growth Services", description: "High-performance professional websites.", applicable_clients: ["Startups", "Businesses"], fees: "Custom", status: "Active" },
            { name: "SEO-Optimized Business Websites", category: "Digital, Technology & Growth Services", description: "Built to rank on Google search results.", applicable_clients: ["Businesses"], fees: "Custom", status: "Active" },
            { name: "Digital Marketing & Promotion", category: "Digital, Technology & Growth Services", description: "Holistic online growth and visibility.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Social Media Marketing (SMM)", category: "Digital, Technology & Growth Services", description: "Branding across LinkedIn, Meta, and Instagram.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Google Ads Campaigns", category: "Digital, Technology & Growth Services", description: "Targeted lead generation through paid search.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Lead Generation & Branding", category: "Digital, Technology & Growth Services", description: "Building brand authority and sales pipelines.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },

            // 6. SNAC Academy: Professional Training
            { name: "GST Master Course (Practical)", category: "SNAC Academy: Professional Training", description: "Live portal training for practitioners.", applicable_clients: ["Individuals"], fees: "Custom", status: "Active" },
            { name: "ITR Master Course", category: "SNAC Academy: Professional Training", description: "End-to-end Income Tax filing workshops.", applicable_clients: ["Individuals"], fees: "Custom", status: "Active" },
            { name: "Compliance Guides & Toolkits", category: "SNAC Academy: Professional Training", description: "Ready-to-use business document templates.", applicable_clients: ["Businesses", "Startups"], fees: "Custom", status: "Active" },
            { name: "Internship Programs", category: "SNAC Academy: Professional Training", description: "15-day, 30-day, and 3-month practical certifications.", applicable_clients: ["Individuals"], fees: "Custom", status: "Active" },
            { name: "Business Strategy E-Books", category: "SNAC Academy: Professional Training", description: "Growth manuals for startups and MSMEs.", applicable_clients: ["Individuals", "Businesses"], fees: "Custom", status: "Active" }
        ];

        const { error } = await supabase.from('professional_services').insert(productionServices);
        if (error) throw error;
        return true;
    }
};


export const securityDb = {
    addLog: async (userId: string, action: string, status: string) => {
        await supabase.from('security_logs').insert({
            user_id: userId,
            action,
            status,
            ip_address: '0.0.0.0',
            timestamp: new Date().toISOString()
        });
    },
    getLogs: async (userId: string): Promise<SecurityLog[]> => {
        const { data } = await supabase
            .from('security_logs')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false })
            .limit(20);
        return (data || []).map(l => ({
            id: l.id, userId: l.user_id, action: l.action, timestamp: l.timestamp, ipAddress: l.ip_address, status: l.status as any
        }));
    },
    getAllLogs: async (): Promise<any[]> => {
        const { data } = await supabase.from('security_logs').select('*, profiles(name, email)').order('timestamp', { ascending: false }).limit(100);
        return data || [];
    }
};

export const resourceDb = {
    getAll: async (): Promise<EbookResource[]> => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            imageUrl: r.image_url,
            gdriveUrl: r.gdrive_url,
            category: r.category,
            status: r.status,
            buttonText: r.button_text,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    extractGDriveId: (url: string): string | null => {
        const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    },

    create: async (resource: Partial<EbookResource>) => {
        const { data, error } = await supabase
            .from('resources')
            .insert([{
                title: resource.title,
                description: resource.description,
                image_url: resource.imageUrl,
                gdrive_url: resource.gdriveUrl,
                category: resource.category,
                status: resource.status || 'Active',
                button_text: resource.buttonText || 'Download Now'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async (id: string, resource: Partial<EbookResource>) => {
        const { error } = await supabase
            .from('resources')
            .update({
                title: resource.title,
                description: resource.description,
                image_url: resource.imageUrl,
                gdrive_url: resource.gdriveUrl,
                category: resource.category,
                status: resource.status,
                button_text: resource.buttonText,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    delete: async (id: string) => {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) throw error;
    },

    toggleStatus: async (id: string, currentStatus: 'Active' | 'Inactive') => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const { error } = await supabase
            .from('resources')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    }
};

export const settingsDb = {
    getSettings: () => {
        const stored = localStorage.getItem('sn_site_settings');
        return stored ? JSON.parse(stored) : {
            homeHeroTitleSize: 'text-5xl md:text-7xl',
            homeSectionTitleSize: 'text-4xl md:text-5xl',
            serviceTitleSize: 'text-3xl',
            globalFontFamily: 'font-sans'
        };
    },
    saveSettings: (settings: any) => {
        localStorage.setItem('sn_site_settings', JSON.stringify(settings));
        window.dispatchEvent(new Event('site-settings-updated'));
    }
};

export const paymentDb = {
    createPayment: async (paymentData: Partial<ConsultationPayment>) => {
        const { data, error } = await supabase
            .from('consultation_payments')
            .insert([{
                user_id: paymentData.userId,
                name: paymentData.name,
                email: paymentData.email,
                phone: paymentData.phone,
                service_name: paymentData.serviceName || 'Consultation',
                amount: paymentData.amount,
                razorpay_order_id: paymentData.razorpayOrderId,
                payment_status: paymentData.paymentStatus || 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updatePaymentStatus: async (orderId: string, paymentId: string, status: 'success' | 'failed') => {
        const { error } = await supabase
            .from('consultation_payments')
            .update({
                razorpay_payment_id: paymentId,
                payment_status: status,
                updated_at: new Date().toISOString()
            })
            .eq('razorpay_order_id', orderId);

        if (error) throw error;
    },

    getPaymentsByUser: async (userId: string) => {
        const { data } = await supabase
            .from('consultation_payments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return (data || []).map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            serviceName: p.service_name,
            amount: p.amount,
            razorpayOrderId: p.razorpay_order_id,
            razorpayPaymentId: p.razorpay_payment_id,
            paymentStatus: p.payment_status,
            createdAt: p.created_at
        }));
    },

    linkPaymentToUser: async (email: string, userId: string) => {
        // Link all guest payments with this email to the new user
        const { error } = await supabase
            .from('consultation_payments')
            .update({ user_id: userId })
            .eq('email', email)
            .is('user_id', null);

        if (error) throw error;
    }
};
