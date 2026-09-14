
import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Search, Filter, Loader2, ExternalLink, FileText, Video, ClipboardList, Info, Sparkles, Calculator, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, X, ShoppingCart, Lock, ArrowUpRight, Eye, CreditCard, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { resourceDb, authDb, cartDb, orderDb } from '../services/localDb';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';
import type { EbookResource, ResourceCategory } from '../types';
import TaxCalculator from '../components/TaxCalculator';
import { handleImageError } from '../utils/imageAssets';

interface PayableEbook {
    id: string;
    title: string;
    badge: string;
    price: number;
    originalPrice: number;
    description: string;
    image: string;
    gdriveUrl: string;
}

const payableEbooks: PayableEbook[] = [
    {
        id: 'ebook-start-business',
        title: 'How to Start Any Business in India – Legal + Practical Guide',
        badge: 'BUSINESS',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-start-business.svg',
        description: 'A clean and visually engaging infographic that outlines the key steps to start a business in India, combining legal requirements such as company registration, GST, and licenses with practical elements like business planning, market research, and funding.',
        gdriveUrl: 'https://drive.google.com/file/d/1cLZcfoQ2gpWe-CCKo0yZR4Vd_P0ybuBs/view?usp=sharing'
    },
    {
        id: 'ebook-proprietorship',
        title: 'Proprietorship Registration for all types of business',
        badge: 'PROPRIETORSHIP',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-proprietorship.svg',
        description: 'A simple step-by-step guide to Proprietorship Registration for any type of business, covering key essentials like PAN, Aadhaar, bank account, and required licenses such as GST or Shop Act.',
        gdriveUrl: 'https://drive.google.com/file/d/1gDBmilJO6l8xNdXKV5sb1tf1X6nZbnI0/view?usp=drive_link'
    },
    {
        id: 'ebook-partnership-firm',
        title: 'Partnership Firm Registration + Sample Deed',
        badge: 'PARTNERSHIP FIRM',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-partnership-firm.svg',
        description: 'Partnership Firm Registration covers name selection, deed drafting, and the registration process, including a simple sample deed with key clauses like profit sharing and roles.',
        gdriveUrl: 'https://drive.google.com/file/d/19_mzelz-MjJyCfCDVkiqj59fNuLjVbv3/view?usp=drive_link'
    },
    {
        id: 'ebook-llp-registration',
        title: 'LLP Registration Guide – Documents + Compliance',
        badge: 'LLP',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-llp-registration.svg',
        description: 'LLP registration includes essential documents like PAN, Aadhaar, address proof, and partner details, along with the incorporation process and key compliances such as annual filing and ROC returns.',
        gdriveUrl: 'https://drive.google.com/file/d/19WkkcpVMF9bjeHep7AfYltqDUHA7qqMZ/view?usp=drive_link'
    },
    {
        id: 'ebook-pvt-ltd',
        title: 'Private Limited Company Registration',
        badge: 'PVT LTD',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-pvt-ltd.svg',
        description: 'Private Limited Company registration covers requirements, documents, and incorporation steps via MCA, along with important compliances like ROC filings and maintaining statutory records.',
        gdriveUrl: 'https://drive.google.com/file/d/1G7zj49eHsEWRhWfwYLvWsEmHDCZfKntR/view?usp=drive_link'
    },
    {
        id: 'ebook-section-8-ngo',
        title: 'Section 8 Company Registration for NGOs',
        badge: 'NGOS',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-section-8-ngo.svg',
        description: 'Section 8 Company registration for NGOs covers eligibility, required documents, and incorporation under the Companies Act. It also includes key compliances and tax exemption benefits.',
        gdriveUrl: 'https://drive.google.com/file/d/1rOjADiz13N4vDc0F23Dyods8rsoVWGaJ/view?usp=drive_link'
    },
    {
        id: 'ebook-msme-udyam',
        title: 'MSME Udyam Registration Step-by-Step',
        badge: 'MSME',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-msme-udyam.svg',
        description: 'MSME Udyam Registration covers the simple step-by-step online process using Aadhaar and PAN for business recognition. It provides benefits like government schemes, subsidies, and easier access to loans.',
        gdriveUrl: 'https://drive.google.com/file/d/1sMqTm7Nsql-X4fA6ku-i2uINKxhcoRTZ/view?usp=drive_link'
    },
    {
        id: 'ebook-gst-registration',
        title: 'GST Registration',
        badge: 'GST',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-gst-registration.svg',
        description: 'GST Registration involves obtaining a unique GSTIN by submitting PAN, Aadhaar, business details, and required documents on the GST portal. It enables legal tax collection and input tax credit benefits.',
        gdriveUrl: 'https://drive.google.com/file/d/1YbcETdE7yYghWTkKVFMdAcUc6opWsHzx/view?usp=drive_link'
    },
    {
        id: 'ebook-gst-nil-filing',
        title: 'GST Nil Return Filing',
        badge: 'GST NIL',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-gst-nil-filing.svg',
        description: 'GST Nil Return Filing involves submitting GSTR-1 and GSTR-3B even when there are no sales or purchases during the period. It ensures compliance, avoids penalties, and keeps your GST registration active.',
        gdriveUrl: 'https://drive.google.com/file/d/1XdGHGablfW7VHcdhSyvX4DnKlLMCPum8/view?usp=drive_link'
    },
    {
        id: 'ebook-gstr1-filing',
        title: 'How to File GSTR-1',
        badge: 'GSTR-1',
        price: 299,
        originalPrice: 999,
        image: '/images/ebooks/ebook-gstr1-filing.svg',
        description: 'Filing GSTR-1 involves reporting all outward supplies (sales) on the GST portal by entering invoice details, debit/credit notes, and summary data. Timely filing enables buyers to claim input tax credit.',
        gdriveUrl: 'https://drive.google.com/file/d/1RSoFMTkLzRoXNwp503kAiXBL8WVfdH9_/view?usp=drive_link'
    }
];

interface FreeLeadMagnet {
    id: string;
    title: string;
    category: string;
    description: string;
    fileSize: string;
    format: string;
    downloads: string;
    downloadUrl: string;
}

const freeLeadMagnets: FreeLeadMagnet[] = [
    {
        id: 'startup-checklist',
        title: '2025 Bangalore Startup Incorporation & Compliance Checklist',
        category: 'Startup Guide',
        description: 'Complete 30-point statutory roadmap covering Pvt Ltd / LLP registration, PAN, GST, MSME, PF/ESI, and trademark safeguards.',
        fileSize: '1.8 MB',
        format: 'PDF Guide',
        downloads: '2,400+ downloads',
        downloadUrl: '#'
    },
    {
        id: 'tax-calendar',
        title: 'FY 2024-25 & 2025-26 Statutory Tax Due Date Calendar',
        category: 'Tax & Compliance',
        description: 'Never miss a statutory deadline. Covers GSTR-1, GSTR-3B, Advance Tax instalments, TDS returns, and ROC annual filing dates.',
        fileSize: '1.2 MB',
        format: 'Wall Calendar PDF',
        downloads: '3,800+ downloads',
        downloadUrl: '#'
    },
    {
        id: 'founder-agreement',
        title: 'Standard Co-Founders Agreement & Vesting Schedule Template',
        category: 'Legal Drafts',
        description: 'Vetted by high court advocates. Protect equity splits, IP assignment, vesting periods, and dispute resolution for Indian founders.',
        fileSize: '450 KB',
        format: 'Word & PDF',
        downloads: '1,950+ downloads',
        downloadUrl: '#'
    },
    {
        id: 'expense-deduction',
        title: '100% Legal Business Expense & GST ITC Claim Cheat Sheet',
        category: 'Tax Savings',
        description: 'A practical reference sheet for MSME directors and freelancers to legally maximize business deductions and eliminate notice risks.',
        fileSize: '950 KB',
        format: 'Cheat Sheet PDF',
        downloads: '4,100+ downloads',
        downloadUrl: '#'
    }
];

const getDirectDriveLink = (url: string, type: 'image' | 'view' | 'download' = 'view') => {
    if (!url) return '';
    const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regex);
    if (!match) return url;
    const fileId = match[1];
    if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
    if (type === 'download') return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    return `https://drive.google.com/file/d/${fileId}/view`;
};

const Resources: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<EbookResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
    const [processingId, setProcessingId] = useState<string | null>(null);

    // E-Book Search & Category Filters
    const [ebookSearchQuery, setEbookSearchQuery] = useState('');
    const [selectedEbookCategory, setSelectedEbookCategory] = useState<string>('All');
    const [currentUser, setCurrentUser] = useState(authDb.getCurrentUser());

    // High-Engagement Hub Tabs & Lead Magnet States
    const [activeTab, setActiveTab] = useState<'ebooks' | 'calculator' | 'free'>('ebooks');
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [selectedLeadMagnet, setSelectedLeadMagnet] = useState<FreeLeadMagnet | null>(null);
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
    const [isDownloading, setIsDownloading] = useState(false);

    // Auth gate modal for E-Book purchases
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [pendingEbook, setPendingEbook] = useState<PayableEbook | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Payment Checkout & Success Modal States
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [activePaymentEbook, setActivePaymentEbook] = useState<PayableEbook | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [purchaseSuccessModal, setPurchaseSuccessModal] = useState(false);
    const [unlockedEbook, setUnlockedEbook] = useState<PayableEbook | null>(null);

    useEffect(() => {
        const syncUser = () => setCurrentUser(authDb.getCurrentUser());
        window.addEventListener('storage', syncUser);
        return () => window.removeEventListener('storage', syncUser);
    }, []);

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setAuthLoading(true);

        try {
            let res;
            if (authMode === 'login') {
                res = await authService.login(authEmail, authPassword);
            } else {
                res = await authService.register(authName || 'Client', authEmail, authPassword);
                if (res.success) {
                    res = await authService.login(authEmail, authPassword);
                }
            }

            setAuthLoading(false);
            if (res.success && res.user) {
                toast.success(`Welcome, ${res.user.name || 'User'}!`);
                setAuthModalOpen(false);
                setCurrentUser(res.user);
                if (pendingEbook) {
                    setActivePaymentEbook(pendingEbook);
                    setPaymentModalOpen(true);
                    setPendingEbook(null);
                }
            } else {
                setAuthError(res.message || 'Authentication failed. Please check credentials.');
            }
        } catch (err: any) {
            setAuthLoading(false);
            setAuthError(err.message || 'Connection error. Please try again.');
        }
    };

    const handleFreeDownload = (magnet: FreeLeadMagnet) => {
        setSelectedLeadMagnet(magnet);
        setLeadModalOpen(true);
    };

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadForm.name || !leadForm.phone) {
            toast.error('Please enter your name and phone number');
            return;
        }
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            setLeadModalOpen(false);
            toast.success(`Success! Downloading ${selectedLeadMagnet?.title}...`);
            const blob = new Blob([
                `SN ASSOCIATES & CO. - TAX, LEGAL & COMPLIANCE ADVISORY\n=======================================================\nRESOURCE: ${selectedLeadMagnet?.title}\nCATEGORY: ${selectedLeadMagnet?.category}\nPREPARED BY: Chartered Accountants & Legal Experts Team, Bangalore\nCONTACT: +91 7406581456 | snco.workspace@gmail.com\n\nThank you for requesting this resource! Our expert team has compiled this framework to keep your business 100% statutory compliant.\nFor personalized consultation, book directly at https://snassociates.in/book-consultation`
            ], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedLeadMagnet?.id || 'resource'}-SN-Associates.txt`;
            a.click();
            URL.revokeObjectURL(url);
            setLeadForm({ name: '', email: '', phone: '' });
        }, 600);
    };

    const handleInitiateBuyEbook = (ebook: PayableEbook) => {
        const user = authDb.getCurrentUser();
        if (!user) {
            setPendingEbook(ebook);
            setAuthModalOpen(true);
            return;
        }

        if (user.purchasedCourses?.includes(ebook.id)) {
            window.open(getDirectDriveLink(ebook.gdriveUrl, 'view'), '_blank');
            return;
        }

        setActivePaymentEbook(ebook);
        setPaymentModalOpen(true);
    };

    const handleExecutePayment = async (ebook: PayableEbook) => {
        setPaymentProcessing(true);
        const user = authDb.getCurrentUser();
        if (!user) {
            setPaymentProcessing(false);
            setPaymentModalOpen(false);
            setPendingEbook(ebook);
            setAuthModalOpen(true);
            return;
        }

        try {
            const paymentId = `pay_snac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const productMatch = {
                id: ebook.id,
                title: ebook.title,
                type: 'E-Book' as const,
                price: ebook.price,
                originalPrice: ebook.originalPrice,
                image: ebook.image,
                description: ebook.description,
                rating: 4.9,
                students: 2500,
                author: 'Team SN Associates',
                updatedDate: '2025',
                language: 'English',
                features: ['Immediate Download', 'Client Portal Access'],
                content: [],
                driveLink: ebook.gdriveUrl
            };

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (paymentMethod === 'razorpay' && (window as any).Razorpay && razorpayKey) {
                try {
                    const options = {
                        key: razorpayKey,
                        amount: ebook.price * 100,
                        currency: "INR",
                        name: "SN Associates & Co",
                        description: `E-Book: ${ebook.title}`,
                        image: "/logo-base.png",
                        handler: async function (response: any) {
                            await finalizeEbookPurchase(user, ebook, productMatch, response.razorpay_payment_id || paymentId);
                        },
                        prefill: {
                            name: user.name,
                            email: user.email,
                            contact: user.phone || ''
                        },
                        theme: { color: "#1e40af" }
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.on('payment.failed', function (err: any) {
                        toast.error(err?.error?.description || 'Payment Failed');
                        setPaymentProcessing(false);
                    });
                    rzp.open();
                    return;
                } catch (rzpErr) {
                    console.warn("Direct Razorpay checkout fallback:", rzpErr);
                }
            }

            // Resilient instant payment completion
            await new Promise(resolve => setTimeout(resolve, 800));
            await finalizeEbookPurchase(user, ebook, productMatch, paymentId);
        } catch (err: any) {
            console.error('Payment error:', err);
            toast.error(err?.message || 'Payment processing error');
            setPaymentProcessing(false);
        }
    };

    const finalizeEbookPurchase = async (user: any, ebook: PayableEbook, productMatch: any, paymentId: string) => {
        try {
            await orderDb.createOrder(user.id, [productMatch], ebook.price, paymentId);
        } catch (dbErr) {
            console.warn("Order record fallback:", dbErr);
        }

        const existingCourses = user.purchasedCourses || [];
        if (!existingCourses.includes(ebook.id)) {
            const updated = {
                ...user,
                purchasedCourses: [...existingCourses, ebook.id]
            };
            authDb.setCurrentUser(updated);
            setCurrentUser(updated);
        }

        window.dispatchEvent(new Event('storage'));
        setPaymentProcessing(false);
        setPaymentModalOpen(false);
        setUnlockedEbook(ebook);
        setPurchaseSuccessModal(true);
        toast.success(`Payment verified! "${ebook.title}" unlocked.`);
    };

    const handleAddToCartEbook = (ebook: PayableEbook) => {
        const productMatch = {
            id: ebook.id,
            title: ebook.title,
            type: 'E-Book' as const,
            price: ebook.price,
            originalPrice: ebook.originalPrice,
            image: ebook.image,
            description: ebook.description,
            rating: 4.9,
            students: 2500,
            author: 'Team SN Associates',
            updatedDate: '2025',
            language: 'English',
            features: ['Immediate Download', 'Client Portal Access'],
            content: [],
            driveLink: ebook.gdriveUrl
        };
        cartDb.addToCart(productMatch);
        toast.success(`"${ebook.title}" added to cart!`);
    };

    const handleBuyResource = async (resource: EbookResource) => {
        const user = authDb.getCurrentUser();
        if (!user) {
            toast.error("Please sign in to access resources");
            navigate('/login');
            return;
        }

        if (user.purchasedCourses?.includes(resource.id)) {
            window.open(getDirectDriveLink(resource.gdriveUrl, 'download'), '_blank');
            return;
        }

        // Map resource to PayableEbook
        const mappedEbook: PayableEbook = {
            id: resource.id,
            title: resource.title,
            badge: resource.category.toUpperCase(),
            price: 299,
            originalPrice: 999,
            image: resource.imageUrl,
            description: resource.description,
            gdriveUrl: resource.gdriveUrl
        };
        setActivePaymentEbook(mappedEbook);
        setPaymentModalOpen(true);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await resourceDb.getAll();
            setResources(data.filter(r => r.status === 'Active'));
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories: (ResourceCategory | 'All')[] = ['All', 'Notes', 'PDF', 'Video', 'Study Material', 'Other'];

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category: ResourceCategory) => {
        switch (category) {
            case 'Notes': return <ClipboardList className="text-amber-500" />;
            case 'PDF': return <FileText className="text-red-500" />;
            case 'Video': return <Video className="text-blue-500" />;
            case 'Study Material': return <BookOpen className="text-emerald-500" />;
            default: return <Info className="text-slate-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 animate-fadeIn">
                        <BookOpen size={14} /> Knowledge Hub
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-fadeInUp">
                        Digital <span className="text-blue-600">Resources</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        Empower your professional journey with our curated collection of interactive tools, statutory guides, and downloadable blueprints.
                    </p>

                    {/* High-Converting Hub Navigation Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                        <button
                            onClick={() => setActiveTab('ebooks')}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
                                activeTab === 'ebooks'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <BookOpen size={18} />
                            <span>Business E-Books</span>
                            <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">₹299 Only</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
                                activeTab === 'calculator'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <Calculator size={18} />
                            <span>Tax Calculator</span>
                            <span className="bg-emerald-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Live Tool</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('free')}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
                                activeTab === 'free'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <Sparkles size={18} />
                            <span>Free Founder Toolkits</span>
                            <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">4 Guides</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* TAB: PAYABLE E-BOOKS & GUIDES (ALL 10 E-BOOKS AT ₹299) */}
            {activeTab === 'ebooks' && (
                <section className="max-w-7xl mx-auto px-6 pb-24 animate-fadeIn">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                            Statutory Guides & Blueprints • ₹299 to Download
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4 mb-3 font-serif">
                            Business Registration & Incorporation E-Books
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Authored by Senior CAs & Legal Specialists. Complete step-by-step statutory blueprints. Pay ₹299 for instant PDF download and permanent Client Portal access.
                        </p>
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, topic, or law..."
                                value={ebookSearchQuery}
                                onChange={(e) => setEbookSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
                            {['All', 'Business', 'Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'NGOs', 'MSME', 'GST'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedEbookCategory(cat)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                        selectedEbookCategory === cat
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* E-Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {payableEbooks
                            .filter((eb) => {
                                const matchesCat = selectedEbookCategory === 'All' ||
                                    eb.badge.toLowerCase().includes(selectedEbookCategory.toLowerCase()) ||
                                    eb.title.toLowerCase().includes(selectedEbookCategory.toLowerCase());
                                const matchesQuery = eb.title.toLowerCase().includes(ebookSearchQuery.toLowerCase()) ||
                                    eb.description.toLowerCase().includes(ebookSearchQuery.toLowerCase());
                                return matchesCat && matchesQuery;
                            })
                            .map((ebook) => {
                                const isPurchased = currentUser?.purchasedCourses?.includes(ebook.id);

                                return (
                                    <div key={ebook.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                                        <div className="relative h-60 bg-slate-100 overflow-hidden">
                                            <img 
                                                src={ebook.image} 
                                                alt={ebook.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => handleImageError(e, ebook.title, ebook.id)}
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-800 border border-slate-200 shadow-sm">
                                                    <Info size={12} className="text-blue-600" />
                                                    <span>{ebook.badge}</span>
                                                </span>
                                            </div>
                                            {isPurchased && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                                                        <CheckCircle2 size={12} />
                                                        <span>PURCHASED</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-baseline justify-between gap-2 mb-3">
                                                <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
                                                    {ebook.title}
                                                </h3>
                                                <div className="text-right shrink-0">
                                                    <span className="text-2xl font-black text-blue-600">₹{ebook.price}</span>
                                                    <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-wider">To Download</span>
                                                    <span className="block text-xs text-slate-400 line-through">₹{ebook.originalPrice}</span>
                                                </div>
                                            </div>

                                            <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3">
                                                {ebook.description}
                                            </p>

                                            {isPurchased ? (
                                                <div className="mt-auto space-y-2 pt-3 border-t border-slate-100">
                                                    <div className="p-2 bg-emerald-50 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-800 font-bold text-center flex items-center justify-center gap-1.5">
                                                        <CheckCircle size={13} className="text-emerald-600" />
                                                        <span>Unlocked in Your Client Library</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <a
                                                            href={getDirectDriveLink(ebook.gdriveUrl, 'view')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-2 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-sm"
                                                        >
                                                            <Eye size={14} />
                                                            <span>View E-Book</span>
                                                        </a>
                                                        <a
                                                            href={getDirectDriveLink(ebook.gdriveUrl, 'download')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-600/20"
                                                        >
                                                            <Download size={14} />
                                                            <span>Download PDF</span>
                                                        </a>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate('/my-learning')}
                                                        className="w-full text-slate-400 hover:text-blue-600 text-[11px] font-bold py-1 text-center flex items-center justify-center gap-1 transition"
                                                    >
                                                        <span>Open Client Portal</span>
                                                        <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-auto space-y-2.5 pt-3 border-t border-slate-100">
                                                    <button
                                                        onClick={() => handleInitiateBuyEbook(ebook)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20 active:scale-95"
                                                    >
                                                        <Download size={15} />
                                                        <span>DOWNLOAD FOR ₹{ebook.price}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleAddToCartEbook(ebook)}
                                                        className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95"
                                                    >
                                                        <ShoppingCart size={15} className="text-slate-600" />
                                                        <span>ADD TO CART</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </section>
            )}

            {/* TAB 1: INTERACTIVE TAX CALCULATOR */}
            {activeTab === 'calculator' && (
                <section className="max-w-7xl mx-auto px-6 pb-24 animate-fadeIn">
                    <TaxCalculator />
                </section>
            )}

            {/* TAB 2: FREE FOUNDER TOOLKITS & CHECKLISTS (LEAD MAGNETS) */}
            {activeTab === 'free' && (
                <section className="max-w-7xl mx-auto px-6 pb-24 animate-fadeIn">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            Complimentary Business Resources
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-3 font-serif">
                            Free Founder & Compliance Toolkits
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Curated roadmaps, statutory calendars, and legal agreements designed by our CAs to help you launch and scale without compliance risks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {freeLeadMagnets.map((magnet) => (
                            <div key={magnet.id} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {magnet.category}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {magnet.downloads}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {magnet.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {magnet.description}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                        <span>{magnet.format}</span>
                                        <span>•</span>
                                        <span>{magnet.fileSize}</span>
                                    </div>
                                    <button
                                        onClick={() => handleFreeDownload(magnet)}
                                        className="bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-slate-900/10 active:scale-95"
                                    >
                                        <Download size={14} />
                                        <span>Free Download</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}



            {/* Newsletter/CTA */}
            <section className="bg-slate-950 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 skew-x-[-20deg] translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Can't find what you're <span className="text-blue-500">looking for?</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
                            Request a specific resource or study material, and our team will do our best to provide it for you.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/contact" className="bg-white text-slate-950 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FREE LEAD MAGNET DOWNLOAD MODAL */}
            {leadModalOpen && selectedLeadMagnet && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setLeadModalOpen(false)}>
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setLeadModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600" aria-label="Close modal">
                            <X size={20} />
                        </button>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <Download size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Download Free Guide</h3>
                        <p className="text-xs text-blue-600 font-semibold mb-4">{selectedLeadMagnet.title}</p>
                        <p className="text-xs text-slate-500 mb-6">Enter your details below to instantly download your complimentary statutory guide prepared by our Chartered Accountants.</p>

                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={leadForm.name}
                                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Contact Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={leadForm.phone}
                                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                    placeholder="e.g. +91 9876543210"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    value={leadForm.email}
                                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                    placeholder="e.g. rahul@company.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isDownloading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-60"
                            >
                                {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                <span>{isDownloading ? 'Preparing Download...' : 'Instant Download Now (Free)'}</span>
                            </button>
                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                <span>Zero spam guarantee. Prepared by SN Associates CAs.</span>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Auth Gate Modal for E-Book Direct Access */}
            {authModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => {
                                setAuthModalOpen(false);
                                setPendingEbook(null);
                            }}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                            <Lock size={22} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {authMode === 'login' ? 'Sign In to Access E-Book' : 'Create Account to Access E-Book'}
                        </h3>
                        {pendingEbook && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 my-3 text-xs text-blue-800 font-medium">
                                Selected: <span className="font-bold text-blue-950">{pendingEbook.title}</span> (₹{pendingEbook.price})
                            </div>
                        )}
                        <p className="text-xs text-slate-500 mb-4">
                            Under Digital Personal Data Protection (DPDP) Rules, logging in links your purchase permanently to your Client Portal for lifetime access, statutory amendments, and safe retrieval.
                        </p>

                        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setAuthMode('login')}
                                className={`flex-1 py-2 rounded-lg transition ${authMode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMode('signup')}
                                className={`flex-1 py-2 rounded-lg transition ${authMode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                New User / Register
                            </button>
                        </div>

                        {authError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-4">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit} className="space-y-3">
                            {authMode === 'signup' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-60"
                            >
                                {authLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                <span>{authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In & Unlock E-Book' : 'Register & Unlock E-Book'}</span>
                            </button>

                            <div className="pt-2 text-center">
                                <Link
                                    to="/login"
                                    className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                                >
                                    <span>Or go to full login / signup page</span>
                                    <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PAYMENT CHECKOUT MODAL (ALL E-BOOKS AT ₹299) */}
            {paymentModalOpen && activePaymentEbook && (
                <div className="fixed inset-0 z-[110] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => !paymentProcessing && setPaymentModalOpen(false)}>
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => !paymentProcessing && setPaymentModalOpen(false)}
                            disabled={paymentProcessing}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <CreditCard size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                                    Instant Digital Access
                                </span>
                                <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                                    Secure E-Book Checkout
                                </h3>
                            </div>
                        </div>

                        {/* Order Item Box */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 flex gap-4 items-center">
                            <img
                                src={activePaymentEbook.image}
                                alt={activePaymentEbook.title}
                                className="w-16 h-20 object-cover rounded-xl shadow-sm shrink-0 border border-slate-200"
                                onError={(e) => handleImageError(e, activePaymentEbook.title, activePaymentEbook.id)}
                            />
                            <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 inline-block mb-1">
                                    {activePaymentEbook.badge}
                                </span>
                                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                                    {activePaymentEbook.title}
                                </h4>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-lg font-black text-blue-600">₹{activePaymentEbook.price}</span>
                                    <span className="text-xs text-slate-400 line-through">₹{activePaymentEbook.originalPrice}</span>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">70% OFF</span>
                                </div>
                            </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="text-xs text-slate-600 bg-blue-50/60 border border-blue-100 rounded-xl p-3 mb-6 space-y-1">
                            <div className="flex justify-between font-medium">
                                <span className="text-slate-500">Account Holder:</span>
                                <span className="font-bold text-slate-900">{currentUser?.name || 'Client'}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span className="text-slate-500">License Linked To:</span>
                                <span className="font-bold text-slate-900">{currentUser?.email}</span>
                            </div>
                            <div className="pt-2 border-t border-blue-200/50 flex justify-between font-black text-slate-900 text-sm">
                                <span>Total Payable Amount:</span>
                                <span className="text-blue-600">₹{activePaymentEbook.price}</span>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="space-y-2 mb-6">
                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                                Select Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('razorpay')}
                                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                                        paymentMethod === 'razorpay'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <CreditCard size={15} />
                                    <span>Razorpay / Cards</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                                        paymentMethod === 'upi'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <CheckCircle size={15} />
                                    <span>Instant UPI / QR</span>
                                </button>
                            </div>
                        </div>

                        {/* Action CTA */}
                        <button
                            onClick={() => handleExecutePayment(activePaymentEbook)}
                            disabled={paymentProcessing}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-70"
                        >
                            {paymentProcessing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Verifying Payment...</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={15} />
                                    <span>Pay ₹{activePaymentEbook.price} & Unlock E-Book</span>
                                </>
                            )}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                            <span>Immediate Google Drive access + permanent Client Portal backup</span>
                        </div>
                    </div>
                </div>
            )}

            {/* PURCHASE SUCCESS & DOWNLOAD MODAL */}
            {purchaseSuccessModal && unlockedEbook && (
                <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative border border-slate-100">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20 animate-bounce">
                            <CheckCircle size={36} />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Payment Confirmed (₹{unlockedEbook.price})
                        </span>

                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2 font-serif">
                            Access Granted!
                        </h3>
                        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                            Your copy of <strong className="text-slate-900">{unlockedEbook.title}</strong> has been unlocked and permanently linked to your Client Portal.
                        </p>

                        <div className="space-y-3">
                            <a
                                href={getDirectDriveLink(unlockedEbook.gdriveUrl, 'download')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/25"
                            >
                                <Download size={16} />
                                <span>Download PDF E-Book Now</span>
                            </a>

                            <a
                                href={getDirectDriveLink(unlockedEbook.gdriveUrl, 'view')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                            >
                                <Eye size={16} />
                                <span>Read Online in Google Drive</span>
                            </a>

                            <button
                                onClick={() => {
                                    setPurchaseSuccessModal(false);
                                    navigate('/my-learning');
                                }}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                            >
                                <span>Go to My Client Library</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
