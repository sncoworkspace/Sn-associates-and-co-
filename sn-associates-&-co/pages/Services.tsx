import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Filter, ArrowRight, CheckCircle2, Star, ShieldCheck, Clock,
  Phone, MessageCircle, Building2, Scale, Percent, FileText, Award, Repeat,
  Receipt, Users, BadgeCheck, Edit3, TrendingUp, X, ChevronRight, ChevronLeft,
  Sparkles, ExternalLink, ArrowUpDown, Check, HelpCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MARKETPLACE_SERVICES, SERVICE_CATEGORIES, MarketplaceService } from '../data/serviceMarketplaceData';
import { emailService } from '../services/emailService';
import toast from 'react-hot-toast';

const categoryIconMap: Record<string, React.ElementType> = {
  'Repeat': Repeat,
  'Award': Award,
  'Percent': Percent,
  'ShieldCheck': ShieldCheck,
  'FileText': FileText,
  'Building2': Building2,
  'Receipt': Receipt,
  'CheckCircle2': CheckCircle2,
  'FileSpreadsheet': FileText,
  'Users': Users,
  'BadgeCheck': BadgeCheck,
  'Scale': Scale,
  'Edit3': Edit3,
  'TrendingUp': TrendingUp
};

const categoryBadgeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  'BUSINESS CONVERSION': { bg: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-700', border: 'border-indigo-100' },
  'LICENSES CERTIFICATIONS': { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-100' },
  'GST SERVICES': { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-700', border: 'border-blue-100' },
  'TRADEMARK IP': { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-100' },
  'INCOME TAX': { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700', border: 'border-amber-100' },
  'BUSINESS REGISTRATION': { bg: 'bg-cyan-50 text-cyan-700', text: 'text-cyan-700', border: 'border-cyan-100' },
  'OTHER TAX SERVICES': { bg: 'bg-orange-50 text-orange-700', text: 'text-orange-700', border: 'border-orange-100' },
  'COMPLIANCES': { bg: 'bg-teal-50 text-teal-700', text: 'text-teal-700', border: 'border-teal-100' },
  'OTHER REGISTRATIONS': { bg: 'bg-sky-50 text-sky-700', text: 'text-sky-700', border: 'border-sky-100' },
  'EMPLOYEE COMPLIANCE': { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-100' },
  'QUALITY CERTIFICATION': { bg: 'bg-violet-50 text-violet-700', text: 'text-violet-700', border: 'border-violet-100' },
  'AUDIT': { bg: 'bg-slate-100 text-slate-800', text: 'text-slate-800', border: 'border-slate-200' },
  'BUSINESS AMENDMENTS': { bg: 'bg-fuchsia-50 text-fuchsia-700', text: 'text-fuchsia-700', border: 'border-fuchsia-100' },
  'VALUATION SERVICES': { bg: 'bg-emerald-50 text-emerald-800', text: 'text-emerald-800', border: 'border-emerald-100' }
};

const Services: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [services] = useState<MarketplaceService[]>(MARKETPLACE_SERVICES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Quick Inquiry form inside modal
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Sync route path to category
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/services/tax')) {
      setActiveCategory('income-tax');
    } else if (path.includes('/services/gst')) {
      setActiveCategory('gst-services');
    } else if (path.includes('/services/audit')) {
      setActiveCategory('audit');
    }
  }, [location.pathname]);

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter & Sort
  const filteredAndSortedServices = useMemo(() => {
    let result = services.filter((svc) => {
      // Category filter
      if (activeCategory !== 'all' && svc.categorySlug !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = svc.name.toLowerCase().includes(query);
        const matchDesc = svc.description.toLowerCase().includes(query);
        const matchCat = svc.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [services, activeCategory, searchQuery, sortBy]);

  const handleOpenDetails = (svc: MarketplaceService) => {
    setSelectedService(svc);
    setIsModalOpen(true);
  };

  const handleQuickInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }

    setInquirySubmitting(true);
    try {
      if (emailService && typeof emailService.sendNotification === 'function') {
        await emailService.sendNotification('service_inquiry', {
          service_name: selectedService.name,
          category: selectedService.category,
          name: inquiryName,
          phone: inquiryPhone,
          email: inquiryEmail || 'N/A',
          page: 'Service Marketplace'
        });
      }
      toast.success(`Inquiry sent for ${selectedService.name}! Our CA expert will call you shortly.`);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryEmail('');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.success('Inquiry received! We will contact you soon.');
      setIsModalOpen(false);
    } finally {
      setInquirySubmitting(false);
    }
  };

  const getWhatsAppLink = (svc: MarketplaceService) => {
    const text = encodeURIComponent(
      `Hi SN Associates & Co, I am interested in your service "${svc.name}". Please share statutory requirements and process details.`
    );
    return `https://wa.me/917406581456?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <Helmet>
        <title>126+ Professional Services | Tax, GST, Company Registration, Audits | SN Associates & Co</title>
        <meta
          name="description"
          content="Explore 126+ certified professional services in Bangalore: Company Incorporation, GST Registration, ITR Filing, Trademark, Audits, Compliances with dedicated Chartered Accountant support."
        />
        <meta name="keywords" content="Chartered Accountant services Bangalore, GST registration, company formation, ITR filing, Trademark, ROC compliance, audit" />
      </Helmet>

      {/* Header Banner Section */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Service Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading mb-4">
            126+ professional services
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Find and request the exact professional services your business needs. Expert CA guidance with complete statutory compliance.
          </p>

          {/* Search & Sort Bar */}
          <div className="mt-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="service-search-input"
                name="serviceSearch"
                aria-label="Search statutory and tax services"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GST, ITR, Company Registration, Trademark..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-56 relative">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-3 shadow-sm">
                <ArrowUpDown className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <select
                  id="service-sort-select"
                  name="serviceSort"
                  aria-label="Sort services by relevance"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Pill Navigation */}
          <div className="mt-7 relative max-w-7xl mx-auto">
            <button
              onClick={() => scrollCategory('left')}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* All Services Tab */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Services
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeCategory === 'all' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {services.length}
                </span>
              </button>

              {/* Specific Categories */}
              {SERVICE_CATEGORIES.map((cat) => {
                const count = services.filter((s) => s.categorySlug === cat.slug).length;
                const isActive = activeCategory === cat.slug;
                const IconComponent = categoryIconMap[cat.icon] || Building2;

                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-blue-500/20'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <span>{cat.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollCategory('right')}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Services Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Counter and Active Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-3 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-bold text-base sm:text-lg">
              Showing <span className="text-blue-600">{filteredAndSortedServices.length}</span> services
            </span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                Category: {SERVICE_CATEGORIES.find((c) => c.slug === activeCategory)?.name}
                <button onClick={() => setActiveCategory('all')} className="hover:text-blue-900 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-amber-900 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Govt. Certified Chartered Accountants & Legal Cell</span>
          </div>
        </div>

        {/* 4-Column Responsive Grid matching screenshot */}
        {filteredAndSortedServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No matching services found</h3>
            <p className="text-sm text-slate-600 mb-6">
              We couldn't find any services matching your criteria. Try adjusting your search keywords or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAndSortedServices.map((service) => {
              const badgeStyle = categoryBadgeColorMap[service.categoryKey] || {
                bg: 'bg-blue-50 text-blue-700',
                border: 'border-blue-100',
                text: 'text-blue-700'
              };

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-5 group relative"
                >
                  {/* Top Bar: Category Badge & Popular tag */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.border}`}
                      >
                        {service.categoryKey.toLowerCase()}
                      </span>
                      {service.popular && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ★ Popular
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => handleOpenDetails(service)}
                      className="font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-[15px] leading-snug cursor-pointer line-clamp-2 min-h-[2.6rem]"
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Section: Rating, Price, Fee Note & Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {/* Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{service.rating}</span>
                        <span className="text-slate-400 font-normal text-[11px]">({service.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>

                    {/* Service Feature / Assurance Badge */}
                    <div className="mb-3.5 flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>CA Verified</span>
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600">
                        Assistance Included
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenDetails(service)}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleOpenDetails(service)}
                        className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm shadow-blue-500/10"
                      >
                        <span>Request</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Service Detail & Quick Inquiry Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Details */}
            <div className="pr-8">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 inline-block mb-3">
                {selectedService.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-snug">
                {selectedService.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedService.rating} rating</span>
                  <span className="text-slate-400 font-normal">({selectedService.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Timeline: {selectedService.turnaround}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verified CA & Legal Team</span>
                </div>
              </div>
            </div>

            {/* Consultation & Action Banner */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Service Delivery & Guidance</span>
                <div className="text-lg font-bold text-slate-900 font-heading">
                  Dedicated Chartered Accountant
                </div>
                <span className="text-xs text-slate-600 font-medium">100% Online Filing & Complete Documentation Support</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href={getWhatsAppLink(selectedService)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  to={`/book-consultation?service=${encodeURIComponent(selectedService.name)}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Book Call</span>
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Service Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Inclusions & Deliverables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Complete document preparation & validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Government portal filing by Certified CA</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated compliance officer tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Official Certificate / Challan / Acknowledgment</span>
                </div>
              </div>
            </div>

            {/* Fast Request / Callback Form */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Request Instant Callback for this Service
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Leave your contact details and our Senior CA team in Bangalore will get in touch within 15 minutes.
              </p>

              <form onSubmit={handleQuickInquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (+91)"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="sm:col-span-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm shadow-blue-500/20"
                >
                  {inquirySubmitting ? (
                    <span className="animate-pulse">Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Request for {selectedService.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Consultation Support Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/40">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              Need Multi-Entity or Custom Advisory?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
              Speak directly with our Senior CA Partners
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Serving startups, private limited companies, firms, and high-net-worth individuals across Bangalore and Pan-India since 2015.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:+917406581456"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-blue-300" />
              <span>+91 7406581456</span>
            </a>
            <Link
              to="/book-consultation"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
