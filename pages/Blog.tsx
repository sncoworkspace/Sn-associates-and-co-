import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    Search, Calendar, Clock, User, ArrowRight, Tag, Bookmark, 
    Share2, CheckCircle2, ChevronRight, Sparkles, BookOpen, 
    Scale, Building, X, ExternalLink, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, BlogPost } from '../data/blogData';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
    'All',
    'Taxation',
    'GST',
    'Startups & Business',
    'Compliance & Legal',
    'Corporate Advisory'
] as const;

const Blog: React.FC = () => {
    const allPosts = useMemo(() => getAllBlogPosts(), []);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedPost(null);
        };
        if (selectedPost) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [selectedPost]);

    const filteredPosts = useMemo(() => {
        return allPosts.filter(post => {
            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || 
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some(t => t.toLowerCase().includes(query)) ||
                post.author.name.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [allPosts, selectedCategory, searchQuery]);

    const todayPost = allPosts[0]; // First item is always generated for today

    const handleShare = (post: BlogPost, e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Article link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Chartered Accountants & Legal Research Desk</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Finance, Taxation & Compliance Blog
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-light">
                        Everyday statutory gazettes, direct tax optimization, GST rulings, and startup legal architecture curated by the partners of SN Associates & Co.
                    </p>

                    {/* Search bar */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics: GST, 43B(h), DPDP Act, Angel Tax, Startups..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition shadow-xl"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                {/* Category Navigation Pills */}
                <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar mb-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Today's Daily Briefing Spotlight (if no filter or matches) */}
                {selectedCategory === 'All' && !searchQuery && todayPost && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                Fresh Daily Post • Updated Today
                            </h2>
                        </div>

                        <div 
                            onClick={() => setSelectedPost(todayPost)}
                            className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden cursor-pointer group border border-blue-800/50 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-300 mb-3">
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold">
                                    {todayPost.category}
                                </span>
                                <span className="flex items-center gap-1 text-slate-300">
                                    <Calendar size={13} />
                                    <span>{todayPost.date}</span>
                                </span>
                                <span className="flex items-center gap-1 text-slate-300">
                                    <Clock size={13} />
                                    <span>{todayPost.readTime}</span>
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2">
                                {todayPost.title}
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                                {todayPost.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={todayPost.author.avatar} 
                                        alt={todayPost.author.name}
                                        className="w-10 h-10 rounded-full border-2 border-blue-400/50 object-cover"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-white">{todayPost.author.name}</p>
                                        <p className="text-[11px] text-slate-400">{todayPost.author.role}</p>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 group-hover:translate-x-1 transition-transform">
                                    <span>Read Today's Full Briefing</span>
                                    <ArrowRight size={15} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Heading */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">
                            {selectedCategory === 'All' ? 'All Publications & Historical Archive' : `${selectedCategory} Articles`}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Showing {filteredPosts.length} expert publications
                        </p>
                    </div>

                    <Link
                        to="/resources"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                    >
                        <span>E-Books & Calculator Hub</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition" />
                    </Link>
                </div>

                {/* Blog Cards Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-700 mb-1">No articles found</h3>
                        <p className="text-xs text-slate-500 mb-4">Try searching for different keywords or select "All" categories.</p>
                        <button
                            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                            className="text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                                            {post.category}
                                        </span>
                                        <button
                                            onClick={(e) => handleShare(post, e)}
                                            className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition"
                                            title="Share article"
                                        >
                                            <Share2 size={15} />
                                        </button>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                                        {post.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>

                                    {/* Key Takeaways preview pill */}
                                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                                        <div className="bg-slate-50 rounded-xl p-2.5 mb-4 border border-slate-100">
                                            <div className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2 italic">{post.keyTakeaways[0]}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                            />
                                            <span className="font-semibold text-slate-800 text-[11px]">{post.author.name}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-400">{post.readTime}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/80 px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span>Read Full Publication</span>
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Article Modal Viewer */}
            {selectedPost && createPortal(
                <div 
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedPost(null);
                    }}
                    className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
                >
                    <div 
                        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative border border-slate-200 overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-article-title"
                    >
                        {/* Sticky Top Close Bar - Always Visible and Prominent */}
                        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2 overflow-hidden mr-3">
                                <span className="font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs shrink-0">
                                    {selectedPost.category}
                                </span>
                                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                                <span className="text-slate-500 text-xs hidden sm:inline truncate font-medium">{selectedPost.title}</span>
                            </div>

                            <button
                                onClick={() => setSelectedPost(null)}
                                aria-label="Close article"
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-full font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                            >
                                <X size={15} />
                                <span>Close</span>
                            </button>
                        </div>

                        {/* Article Header info */}
                        <div className="p-6 sm:p-8 pb-4 bg-slate-50/60 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-xs mb-2.5 text-slate-500">
                                <span>{selectedPost.date}</span>
                                <span>•</span>
                                <span>{selectedPost.readTime}</span>
                            </div>
                            <h2 id="modal-article-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                                {selectedPost.title}
                            </h2>
                        </div>

                        {/* Modal Content Scroll Area */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
                            {/* Author Banner */}
                            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                <img
                                    src={selectedPost.author.avatar}
                                    alt={selectedPost.author.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600/30"
                                />
                                <div>
                                    <p className="text-xs font-bold text-slate-900">{selectedPost.author.name}</p>
                                    <p className="text-[11px] text-slate-500">{selectedPost.author.role}</p>
                                    <p className="text-[10px] text-blue-600 font-medium">SN Associates & Co. Bangalore</p>
                                </div>
                            </div>

                            {/* Statutory Key Takeaways Box */}
                            {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
                                <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-4 sm:p-5">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                                        <ShieldCheck size={16} className="text-blue-600" />
                                        <span>Key Statutory Action Points & Legal Takeaways</span>
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedPost.keyTakeaways.map((takeaway, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-blue-950 font-medium leading-normal">
                                                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span>{takeaway}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Body Paragraphs */}
                            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                                {selectedPost.content.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                {selectedPost.tags.map(tag => (
                                    <span key={tag} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Consultation CTA Card */}
                            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white text-center sm:text-left sm:flex items-center justify-between gap-6 shadow-xl">
                                <div>
                                    <h4 className="font-bold text-base text-white mb-1">
                                        Need Specific Advice on This Subject?
                                    </h4>
                                    <p className="text-xs text-blue-200">
                                        Schedule an expedited 1-on-1 strategic consultation with our Chartered Accountants and Corporate Lawyers.
                                    </p>
                                </div>
                                <Link
                                    to="/book-consultation"
                                    onClick={() => setSelectedPost(null)}
                                    className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shrink-0"
                                >
                                    <span>Book Consultation</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Sticky Modal Footer Bar */}
                        <div className="sticky bottom-0 z-30 p-4 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span className="font-medium text-slate-600 truncate max-w-xs sm:max-w-md">Published under SN Associates Knowledge Initiative</span>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="font-bold text-xs text-slate-800 hover:text-white hover:bg-slate-900 px-5 py-2 rounded-xl bg-white border border-slate-300 shadow-sm transition-all"
                            >
                                Close Article
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Blog;
