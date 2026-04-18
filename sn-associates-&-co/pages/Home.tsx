
import React, { useState, useEffect } from 'react';
import { settingsDb } from '../services/localDb';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, FileText, Building, Scale, Briefcase, ChevronRight, Shield, Zap, Globe, PhoneCall, CheckCircle2, Star, BookOpen } from 'lucide-react';

const heroImages = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1920", // Calculator & Financial Documents
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1920", // Legal Gavel & Books
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920", // Auditing/Planning on Laptop
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1920"  // Client Meeting
];

const serviceCategories = [
  {
    icon: Building,
    title: "1. Business Entity Incorporation & Registration",
    items: [
      "Proprietorship Registration", "Partnership Firm Registration", "LLP Registration",
      "Private Limited Company Registration", "One Person Company (OPC)",
      "Trust, Society & Section 8 Company", "Nidhi Company Registration", "Indian & Foreign Subsidiary Setup"
    ],
    color: "blue"
  },
  {
    icon: FileText,
    title: "2. Post-Incorporation & Business Registrations",
    items: [
      "PAN & TAN Application", "GST Registration & Amendments", "MSME (Udyam) Registration",
      "Shop & Establishment License", "PF & ESI Registration", "Trade & FSSAI (Food) License",
      "Startup India Registration"
    ],
    color: "cyan"
  },
  {
    icon: Scale,
    title: "3. Tax & Legal Compliance Services",
    items: [
      "Income Tax Advisory & ITR Filing", "Income Tax & GST Audit", "E-TDS Filing",
      "Representation & Appeals", "ROC Annual Filings", "FDI & FEMA Compliance",
      "Share Transfer & Reporting"
    ],
    color: "purple"
  },
  {
    icon: Briefcase,
    title: "4. Outsourcing, Accounting & CFO Services",
    items: [
      "Virtual CFO Services", "Outsourced Accounting & Bookkeeping", "Payroll & Labour Law",
      "CMA Data & Project Reports", "Business Valuation", "Due Diligence Services",
      "Registered Valuer Services"
    ],
    color: "indigo"
  },
  {
    icon: Zap,
    title: "5. Digital, Technology & Growth Services",
    items: [
      "Website Design & Development", "SEO-Optimized Business Websites", "Digital Marketing & Promotion",
      "Social Media Marketing (SMM)", "Google Ads Campaigns", "Lead Generation & Branding"
    ],
    color: "emerald"
  },
  {
    icon: BookOpen,
    title: "6. SNAC Academy: Professional Training",
    items: [
      "GST Master Course (Practical)", "ITR Master Course", "Compliance Guides & Toolkits",
      "Internship Programs", "Business Strategy E-Books"
    ],
    color: "amber"
  }
];

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [siteSettings, setSiteSettings] = useState(settingsDb.getSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSiteSettings(settingsDb.getSettings());
    };
    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdate);
  }, []);

  // Slider Logic: Change image every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col bg-slate-900 min-h-screen text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative">
      <Helmet>
        <title>SN Associates & Co | Chartered Accountants in Bangalore</title>
        <meta name="description" content="Leading Chartered Accountants in Bangalore providing expert Tax, Audit, and Advisory services. Reliable financial solutions for businesses and individuals." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "SN Associates & Co",
            "url": "https://snassociatesandco.com/",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Electronic City, Bangalore",
              "addressRegion": "KA",
              "addressCountry": "IN"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://snassociatesandco.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* Floating Book Call Button (Home Page Specific) */}
      <Link
        to="/book-consultation"
        className="fixed bottom-24 left-6 z-40 bg-amber-400 hover:bg-amber-500 text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-110 flex items-center gap-2 group border border-amber-300 animate-bounce-slow"
        aria-label="Book a Call"
      >
        <PhoneCall size={24} className="fill-slate-900/20" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold whitespace-nowrap">
          Book a Call
        </span>
      </Link>

      {/* --- 3D HERO SECTION WITH SLIDER --- */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Background Slider */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40 backdrop-blur-[2px]"></div>
          </div>
        ))}

        {/* Floating Abstract Shapes for 3D Depth */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center md:text-left">

            {/* Trust Badges Container */}
            <div className="flex flex-wrap items-center gap-4 mb-8 justify-center md:justify-start">
              {/* Original Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 animate-fadeIn shadow-[0_0_20px_rgba(59,130,246,0.3)] opacity-0" style={{ animationFillMode: 'forwards' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-cyan-300 text-[10px] font-bold tracking-widest uppercase">Trusted Since 2015</span>
              </div>

              {/* New Google Review Badge */}
              <Link to="/testimonials" className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-2 pr-5 py-2 animate-fadeIn shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:bg-white/20 transition-all opacity-0 group" style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1 shadow-inner">
                  <img
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">4.9/5 Rating</span>
              </Link>
            </div>

            <h1 className={`${siteSettings.homeHeroTitleSize} font-bold leading-tight mb-6 drop-shadow-lg font-serif`}>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '400ms' }}>
                Future-Ready
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 relative animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '600ms' }}>
                Tax, Legal & Tech
                {/* Underline Glow */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-500 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-white mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '800ms' }}>
              Tax, Legal, Tech, and Growth—All Under One Roof. Experience the next generation of statutory excellence since 2015.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '1000ms' }}>
              <Link
                to="/book-consultation"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 overflow-hidden transform transition-all hover:scale-105 hover:shadow-blue-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Consultation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>
              </Link>

              <Link
                to="/services"
                className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:border-blue-400/50"
              >
                Explore Services <Globe size={18} className="text-blue-400 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>

            {/* Slider Indicators */}
            <div className="mt-12 flex items-center justify-center md:justify-start gap-3">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-blue-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- 3D STATS BAR --- */}
      <section className="relative z-20 -mt-10 mb-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "ITRs Filed", value: "10k+", color: "text-blue-400" },
              { label: "Clients Served", value: "5000+", color: "text-cyan-400" },
              { label: "Years Experience", value: "12+", color: "text-purple-400" },
              { label: "Success Rate", value: "100%", color: "text-green-400" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-default">
                <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${stat.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-slate-200 text-sm uppercase tracking-wider font-semibold group-hover:text-slate-200 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOLOGRAPHIC SERVICES SECTION --- */}
      <section className="py-20 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ecosystem</span>
            </h2>
            <p className="text-slate-200 max-w-2xl mx-auto text-lg">
              We leverage technology to simplify the complex landscape of Indian business laws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((cat, idx) => (
              <div key={idx} className="group relative bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className={`absolute inset-0 bg-gradient-to-br from-${cat.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl`}></div>

                <div className={`w-14 h-14 bg-gradient-to-br from-${cat.color}-600 to-${cat.color}-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <cat.icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{cat.title}</h3>
                <ul className="space-y-2 mb-8">
                  {cat.items.slice(0, 4).map((item, i) => (
                    <li key={i} className="group/item">
                      <Link to="/services" className="flex items-start gap-2 text-xs text-slate-200 hover:text-blue-400 transition-colors">
                        <ChevronRight size={12} className="mt-1 text-blue-500 shrink-0 group-hover/item:translate-x-1 transition-transform" />
                        <span>{item}</span>
                      </Link>
                    </li>
                  ))}
                  {cat.items.length > 4 && (
                    <li className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pl-5 mt-2">
                      + {cat.items.length - 4} More Specialized Services
                    </li>
                  )}
                </ul>

                <Link to="/services" className={`inline-flex items-center gap-2 text-${cat.color}-400 font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all`}>
                  Expand Domain <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PARALLAX FEATURE SECTION --- */}
      <section className="py-32 relative overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 bg-fixed bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1920')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500 rounded-2xl rotate-12 opacity-50 blur-xl animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
                alt="Professional Team"
                className="relative rounded-3xl shadow-2xl border-2 border-white/10 z-10 hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-slate-800 p-4 rounded-xl shadow-xl border border-white/10 flex items-center gap-3 z-20 animate-bounce-slow">
                <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><CheckCircle size={24} /></div>
                <div>
                  <div className="text-xs text-slate-400 uppercase">Status</div>
                  <div className="font-bold text-white">100% Compliant</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className={`${siteSettings.homeSectionTitleSize} font-bold text-white mb-8 leading-tight`}>
              Why Leaders Choose <br />
              <span className="text-blue-500">SN Associates & Co</span>
            </h2>

            <div className="grid grid-cols-1 gap-5 mb-10">
              {[
                "Built on trust since 2015.",
                "5,000+ clients served. 10,000+ ITRs filed.",
                "Accurate. Compliant. Reliable.",
                "Tax, legal, compliance, and digital solutions under one roof.",
                "Traditional expertise with modern execution.",
                "Clear advice. Timely delivery. Zero confusion.",
                "Trusted by startups, MSMEs, and growing enterprises."
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
                  <span className="text-lg font-medium">{point}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-6 border-t border-white/10">
              {[
                { title: "Expert Certified Team", desc: "B.com, CA, CS, LLB, MBA, Audit Professionals, Tax Expert & legal Expert", icon: Shield }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                  <div className="bg-slate-800 p-3 rounded-xl text-blue-400 shadow-sm">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/about" className="group text-white border-b-2 border-blue-500 pb-1 hover:text-blue-400 hover:border-blue-400 transition-all text-lg font-medium flex items-center gap-2 w-fit">
                Read our full story <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEON CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-12 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Scale?</h2>
            <p className="text-blue-200 mb-10 text-lg">
              Join thousands of businesses who trust us with their compliance.
              <br />First consultation is on us.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
