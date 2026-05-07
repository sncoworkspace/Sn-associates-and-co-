import React, { useState, useEffect } from 'react';
import {
  Building2, FileText, Scale, Briefcase, ChevronRight, CheckCircle2,
  Phone, ArrowRight, ChevronDown, ChevronUp, Info, Rocket, BookOpen,
  Download, Eye, Lock, ExternalLink, Globe, UserCheck, ShieldCheck, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesDb, authDb, settingsDb } from '../services/localDb';
import { ProfessionalService, User, ServiceCategory } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Business Entity Incorporation & Registration');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteSettings, setSiteSettings] = useState(settingsDb.getSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSiteSettings(settingsDb.getSettings());
    };
    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdate);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await servicesDb.getAll();
        setServices(data.filter(s => s.status === 'Active'));
        if (data.length > 0) {
          setActiveCategory(data[0].category);
        }
        const user = authDb.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Custom category ordering - keep Digital & Academy sections last
  const sortCategories = (cats: ServiceCategory[]): ServiceCategory[] => {
    const lastCategories = [
      'Digital, Technology & Growth Services',
      'SNAC Academy: Professional Training'
    ];

    const regular = cats.filter(c => !lastCategories.includes(c));
    const last = cats.filter(c => lastCategories.includes(c));

    return [...regular, ...last];
  };

  const categories = sortCategories([...new Set(services.map(s => s.category))] as ServiceCategory[]);
  const filteredServices = services.filter(s => s.category === activeCategory);

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const activeService = React.useMemo(() => {
    if (!expandedItem) return null;
    return services.find(s => s.id === expandedItem) || null;
  }, [expandedItem, services]);

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Incorporation')) return Rocket;
    if (cat.includes('Post-Incorporation')) return FileText;
    if (cat.includes('Compliance')) return ShieldCheck;
    if (cat.includes('Accounting')) return Building2;
    if (cat.includes('Digital')) return Globe;
    if (cat.includes('Academy')) return BookOpen;
    return Info;
  };

  const getCategoryImage = (cat: string): string => {
    // Business Entity Incorporation & Registration - Company formation, legal documents
    if (cat.includes('Incorporation')) return 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800';
    // Post-Incorporation - GST, licenses, registrations
    if (cat.includes('Post-Incorporation')) return 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=800';
    // Tax & Legal Compliance - ITR, audits, tax filings
    if (cat.includes('Compliance')) return 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800';
    // Outsourcing, Accounting & CFO Services - Financial management, bookkeeping
    if (cat.includes('Accounting')) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';
    // Digital, Technology & Growth - Website development, digital marketing
    if (cat.includes('Digital')) return 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800';
    // SNAC Academy - Professional training, courses, education
    if (cat.includes('Academy')) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
  };

  const location = useLocation();

  const getSEOContent = () => {
    const path = location.pathname;
    if (path === '/services/tax' || activeCategory.includes('Tax & Legal')) {
      return {
        title: "Income Tax Filing & Compliance Services in Bangalore",
        desc: "Expert income tax filing, compliance, and planning in Bangalore. Stay compliant and optimize your taxes with SN Associates & Co."
      };
    }
    if (path === '/services/audit') {
      return {
        title: "Corporate & Statutory Audit Services in Bangalore",
        desc: "Ensure financial accuracy with our statutory and corporate audit services in Bangalore. Professional assurance for business stability and growth."
      };
    }
    if (path === '/services/gst' || activeCategory.includes('Post-Incorporation')) {
      return {
        title: "GST Registration & Consultation Services in Bangalore",
        desc: "Hassle-free GST registration, filing, and advisory in Bangalore. Trusted GST experts for seamless indirect tax compliance."
      };
    }
    return {
      title: "Professional Business Services in Bangalore | SN Associates",
      desc: "Comprehensive business solutions including incorporation, tax compliance, audit, and digital transformation in Bangalore."
    };
  };

  const seo = getSEOContent();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Rocket className="text-blue-600 animate-bounce" size={32} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Services...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-inter">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
      </Helmet>
      {/* Premium Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden py-24">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20">
            <Globe size={14} /> Professional Client Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter font-serif text-white">
            Tax, Legal, Tech, and Growth— <br />
            <span className="text-blue-500">All Under One Roof.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-inter">
            Experience the next generation of compliance. We combine expert auditing with AI-driven precision for GST, ITR, and Company Registration.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden min-h-[700px]">

          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 bg-slate-50/50 border-r border-slate-100 h-fit lg:sticky lg:top-20">
            <div className="p-10 border-b border-slate-100">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Service Modules</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase italic">Jump to a domain</p>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const element = document.getElementById(`category-${cat}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setActiveCategory(cat);
                      }
                    }}
                    className={`nav-button w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 relative group ${activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900'
                      }`}
                  >
                    <Icon size={20} className={activeCategory === cat ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                    <span className="font-bold text-sm tracking-tight">{cat}</span>
                    {activeCategory === cat && (
                      <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Trust Box - Hidden on small screens to save space since we are scrolling */}
            <div className="mt-20 px-8 pb-10 hidden lg:block">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition duration-700"></div>
                <UserCheck className="text-blue-500 mb-4" size={32} />
                <h4 className="font-bold text-xl mb-2">Expert Consultation</h4>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">Dedicated professionals for personalized financial strategies.</p>
                <Link to="/contact" className="flex items-center justify-between w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                  Enquire Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Service Content & Resources */}
          <div className="lg:w-3/4 p-8 md:p-16 flex flex-col space-y-24">
            {categories.map((cat) => {
              const catServices = services.filter(s => s.category === cat);
              return (
                <div key={cat} id={`category-${cat}`} className="scroll-mt-32">
                  <div className="flex items-center gap-6 mb-12 animate-slideDown">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                      {React.createElement(getCategoryIcon(cat), { size: 32 })}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tighter mb-1 font-serif">{cat}</h2>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Validated Domain Excellence</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catServices.map((service) => {
                      const isExpanded = expandedItem === service.id;
                      return (
                        <div
                          key={service.id}
                          className="bg-white rounded-2xl border border-slate-200 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group overflow-hidden flex flex-col"
                        >
                          {/* Category Image Header */}
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={service.image || getCategoryImage(cat)}
                              alt={cat}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>



                            {/* Category Icon on Image */}
                            <div className="absolute bottom-3 left-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-600 shadow-lg">
                              {React.createElement(getCategoryIcon(cat), { size: 22 })}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-6 pb-4 relative flex-1 flex flex-col">

                            {/* Service Name */}
                            <h3 className={`${siteSettings.serviceTitleSize} font-bold text-slate-900 leading-tight mb-3`}>
                              {service.name}
                            </h3>

                            {/* Client Type Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {service.applicableClients.map(c => (
                                <span key={c} className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase px-2 py-1 rounded-full tracking-tight">
                                  For {c}
                                </span>
                              ))}
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                              {service.description}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="px-6 pb-6 mt-auto">
                            <button
                              onClick={() => toggleItem(service.id)}
                              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg group-hover:shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                              {isExpanded ? 'Close Details' : 'View Details'}
                              <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>


                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Details Modal/Popup (Root Level) */}
      {activeService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setExpandedItem(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full flex flex-col max-h-[500px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10 shrink-0 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  {React.createElement(getCategoryIcon(activeService.category), { size: 28 })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{activeService.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{activeService.category}</p>
                </div>
              </div>
              <button
                onClick={() => setExpandedItem(null)}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                aria-label="Close service details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 overflow-y-auto rounded-b-3xl">
              {/* Service Info */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Applicable To</div>
                  <div className="flex flex-wrap gap-2">
                    {activeService.applicableClients.map(c => (
                      <span key={c} className="bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Service Description</h4>
                <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">{activeService.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom CTA */}
      <div className="bg-slate-900 py-32 mt-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Your Financial Compliance, <br />Expertly Managed.</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">Join hundreds of growing Indian businesses that trust SN Associates & Co for their statutory excellence.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/book-consultation" className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-600/30">
              Book Consultation
            </Link>
            <Link to="/contact" className="w-full md:w-auto bg-transparent border border-slate-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
