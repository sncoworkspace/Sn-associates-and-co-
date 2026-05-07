
import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Search, Filter, Loader2, ExternalLink, FileText, Video, ClipboardList, Info } from 'lucide-react';
import { resourceDb, authDb } from '../services/localDb';
import { toast } from 'react-hot-toast';
import type { EbookResource, ResourceCategory } from '../types';

const getDirectDriveLink = (url: string, type: 'image' | 'view' | 'download' = 'view') => {
    if (!url) return '';
    const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regex);
    if (!match) return url;
    const fileId = match[1];
    if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
    if (type === 'download') return `https://drive.google.com/uc?export=download&id=${fileId}`;
    return `https://drive.google.com/file/d/${fileId}/view`;
};

const Resources: React.FC = () => {
    const [resources, setResources] = useState<EbookResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleBuyResource = async (resource: EbookResource) => {
        try {
            setProcessingId(resource.id);
            const user = authDb.getCurrentUser();
            const API_URL = import.meta.env.VITE_API_URL || '';
            const amount = 299;

            const response = await fetch(`${API_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR', receipt: `resource_${resource.id}` })
            });
            const order = await response.json();

            if (!order.id) throw new Error('Failed to create order');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "SN Associates & Co",
                description: `Purchase: ${resource.title}`,
                image: "/logo-base.png",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.status === 'success') {
                            toast.success("Payment Successful! Downloading...");
                            window.open(getDirectDriveLink(resource.gdriveUrl, 'download'), '_blank');
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err) {
                        toast.error('Error verifying payment');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                theme: {
                    color: "#1e40af"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment Failed');
            });
            rzp.open();

        } catch (error: any) {
            console.error('Payment error', error);
            toast.error(error.message || 'Payment process interrupted');
        } finally {
            setProcessingId(null);
        }
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
                        Empower your professional journey with our curated collection of notes, guides, and study materials.
                    </p>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-100 py-6 mb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Search */}
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 shadow-sm"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.25rem] border border-slate-100">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${selectedCategory === cat
                                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
                                                : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Knowledge Base...</p>
                    </div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredResources.map((resource, idx) => (
                            <div
                                key={resource.id}
                                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:border-blue-400 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full animate-fadeInUp"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={resource.imageUrl}
                                        alt={resource.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800')}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/20">
                                        {getCategoryIcon(resource.category)}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{resource.category}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-slate-950 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                                        {resource.description}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Access Method</span>
                                            <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                                                <ExternalLink size={12} className="text-blue-500" /> Secure Link
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleBuyResource(resource)}
                                            disabled={processingId === resource.id}
                                            className="inline-flex items-center gap-2 bg-slate-950 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 group/btn disabled:opacity-70"
                                        >
                                            {processingId === resource.id ? <Loader2 className="animate-spin" size={16} /> : (resource.buttonText || 'Buy for ₹299')}
                                            {processingId !== resource.id && <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 animate-fadeIn">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Resources Found</h3>
                        <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-8 text-blue-600 text-sm font-black uppercase tracking-widest hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </section>

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
        </div>
    );
};

export default Resources;
