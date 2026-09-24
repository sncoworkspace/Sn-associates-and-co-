
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Award,
  Users,
  Target,
  Clock,
  CheckCircle2,
  Building2,
  FileText,
  Scale,
  Briefcase,
  Rocket,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const serviceCategories = [
  {
    icon: Building2,
    title: "1. Business Entity Incorporation & Registration",
    path: "/services/incorporation",
    items: [
      "Proprietorship Registration", "Partnership Firm Registration", "LLP Registration",
      "Private Limited Company Registration", "One Person Company (OPC)",
      "Trust, Society & Section 8 Company", "Nidhi Company Registration", "Indian & Foreign Subsidiary Setup"
    ]
  },
  {
    icon: FileText,
    title: "2. Post-Incorporation & Business Registrations",
    path: "/services/gst",
    items: [
      "PAN & TAN Application", "GST Registration & Amendments", "MSME (Udyam) Registration",
      "Shop & Establishment License", "PF & ESI Registration", "Trade & FSSAI (Food) License",
      "Startup India Registration"
    ]
  },
  {
    icon: Scale,
    title: "3. Tax & Legal Compliance Services",
    path: "/services/tax",
    items: [
      "Income Tax Advisory & ITR Filing", "Income Tax & GST Audit", "E-TDS Filing",
      "TDS Return Filing", "PT Registration (PTRC/PTEC)", "Representation & Appeals",
      "ROC Annual Filings", "FDI & FEMA Compliance", "Share Transfer & Reporting"
    ]
  },
  {
    icon: Briefcase,
    title: "4. Outsourcing, Accounting & CFO Services",
    path: "/services/accounting",
    items: [
      "Virtual CFO Services", "Outsourced Accounting & Bookkeeping", "Payroll & Labour Law",
      "CMA Data & Project Reports", "Business Valuation", "Due Diligence Services",
      "Registered Valuer Services"
    ]
  },
  {
    icon: ShieldCheck,
    title: "5. Corporate Governance & ROC Compliances",
    path: "/services/roc",
    items: [
      "Annual ROC Filings (AOC-4, MGT-7)", "Director KYC & DIN (DIR-3 KYC)",
      "Appointment & Resignation of Directors", "Increase in Authorised Capital",
      "Secretarial Audit & Annual Return", "Company Closure & Strike-Off (STK-2)"
    ]
  },
  {
    icon: Award,
    title: "6. Trademark & Intellectual Property (IP)",
    path: "/services/trademark",
    items: [
      "Trademark Search & Brand Filing", "Trademark Objection Reply",
      "Trademark Hearing Representation", "Copyright Registration",
      "Patent Search & Advisory", "Design Registration & IP Protection"
    ]
  },
  {
    icon: Rocket,
    title: "7. Digital, Technology & Growth Services",
    path: "/services",
    items: [
      "Website Design & Development", "SEO-Optimized Business Websites", "Digital Marketing & Promotion",
      "Social Media Marketing (SMM)", "Google Ads Campaigns", "Lead Generation & Branding"
    ],
    isNew: true
  },
  {
    icon: BookOpen,
    title: "8. SNAC Academy: Professional Training",
    path: "/academy",
    items: [
      "GST Master Course (Practical)", "ITR Master Course & E-filing", "Compliance Guides & Toolkits",
      "Educational Content for Accountants", "Business Strategy E-Books"
    ]
  }
];

const About: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SN Associates & Co",
    "description": "Learn about SN Associates & Co, a premier multidisciplinary tax, legal, compliance, and accounting advisory firm based in Electronic City, Bangalore since 2015.",
    "url": "https://snassociatesandco.com/about",
    "mainEntity": {
      "@type": "AccountingService",
      "@id": "https://snassociatesandco.com/#organization",
      "name": "SN Associates & Co",
      "foundingDate": "2015",
      "founder": {
        "@type": "Person",
        "name": "Nagendra M",
        "jobTitle": "Founder & Senior Tax Consultant",
        "image": "https://snassociatesandco.com/founder-nagendra.png"
      },
      "knowsAbout": [
        "Goods and Services Tax (GST)",
        "Income Tax Return (ITR) Filing",
        "Company Registration & ROC Compliance",
        "Corporate Statutory & Internal Audit",
        "Startup India Registration",
        "Virtual CFO Services"
      ]
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>About SN Associates & Co | Trusted Tax & Legal Firm Since 2015</title>
        <meta name="description" content="Learn about SN Associates & Co, a premier multidisciplinary tax, legal, compliance, and accounting advisory firm based in Electronic City, Bangalore." />
        <link rel="canonical" href="https://snassociatesandco.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About SN Associates & Co | Trusted Tax & Legal Firm Since 2015" />
        <meta property="og:description" content="Learn about SN Associates & Co, a premier multidisciplinary tax, legal, compliance, and accounting advisory firm based in Electronic City, Bangalore." />
        <meta property="og:url" content="https://snassociatesandco.com/about" />
        <meta property="og:image" content="https://snassociatesandco.com/logo-base.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://snassociatesandco.com/logo-base.png" />
        <script type="application/ld+json">
          {JSON.stringify(aboutSchema)}
        </script>
      </Helmet>
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-white">About SN Associates & Co</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A multi-disciplinary tax, legal, compliance, and digital solutions firm based in Bangalore since 2015.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Main Overview Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row items-stretch">
            <div className="lg:w-3/5 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  SN Associates & Co is a multi-disciplinary firm based in Electronic City, Bangalore. Since 2015, we provide end-to-end professional, technology-driven, and growth-focused services to startups, MSMEs, and enterprises across India.
                </p>
                <p>
                  With <span className="text-blue-700 font-bold">5,000+ clients served</span> and <span className="text-blue-700 font-bold">10,000+ ITR filings</span>, we are trusted for our accuracy, compliance expertise, transparency, and fast turnaround time.
                </p>
                <p className="font-medium text-slate-800 italic">
                  We combine tax, legal, finance, compliance, technology, and digital growth services under one roof, making us a true one-stop business partner.
                </p>
              </div>
            </div>
            <div className="lg:w-2/5 relative min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
                alt="Strategic Planning"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/10"></div>
            </div>
          </div>
        </div>

        {/* Core Service Categories */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Service Categories</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((cat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                      <cat.icon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 leading-tight flex-1 text-base">
                      {cat.title}
                      {cat.isNew && (
                        <span className="ml-2 inline-block bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse">NEW🚀</span>
                      )}
                    </h3>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {cat.items.slice(0, 5).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <ChevronRight size={14} className="mt-0.5 text-blue-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {cat.items.length > 5 && (
                      <li className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-5">
                        + {cat.items.length - 5} More Services
                      </li>
                    )}
                  </ul>
                </div>
                <Link to={cat.path} className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider pt-3 border-t border-slate-100 group/link">
                  <span>Explore Services</span>
                  <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Founder & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Founder Profile */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShieldCheck size={24} className="text-blue-600" />
              The Founder
            </h2>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-8 items-center sm:items-start h-full">
              <div className="w-48 h-60 rounded-xl flex-shrink-0 overflow-hidden bg-slate-100 border border-slate-200/50 shadow-inner flex items-center justify-center relative">
                {!imgError ? (
                  <img
                    src="/founder-nagendra.png"
                    alt="Nagendra M - Founder & Tax Consultant at SN Associates & Co"
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white w-full h-full">
                    <div className="w-16 h-16 rounded-full bg-blue-600 border border-blue-400/40 flex items-center justify-center font-bold text-2xl mb-2 font-serif text-white shadow-lg">
                      NM
                    </div>
                    <span className="font-bold text-sm text-white">Nagendra M</span>
                    <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider mt-0.5">Founder & Auditor</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-2xl text-slate-900 mb-2 font-serif">Nagendra M</h3>
                <div className="inline-flex items-center bg-blue-50 text-blue-700 text-[11px] font-bold px-4 py-1.5 rounded-full mb-5 border border-blue-100 uppercase tracking-widest">
                  Founder & Certified Auditor
                </div>
                <p className="text-slate-700 font-bold text-sm mb-4 leading-relaxed">
                  Tax & Legal (Expert with 12+ Year Experience) Consultant At SN ASSOCIATES AND CO (R)
                </p>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Leading with a vision to simplify compliance for Indian businesses. Bringing expert insights from both financial and legal domains.
                </p>
              </div>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target size={24} className="text-blue-600" />
              Our Mission
            </h2>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-8 flex-grow">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Simplify Compliance</h4>
                  <p className="text-sm text-slate-500">Making tax and legal processes understandable and stress-free.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Build Trust</h4>
                  <p className="text-sm text-slate-500">Maintaining the highest standards of integrity in every filing.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Enable Growth</h4>
                  <p className="text-sm text-slate-500">Handling the red tape so you can focus on your business goals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mb-24 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mb-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Why Choose SN Associates & Co</h2>
              <p className="text-slate-400">Commitment to excellence in every professional engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Established in 2015",
                "5,000+ Clients Served",
                "10,000+ ITRs Filed",
                "Tax + Legal + Tech + Growth",
                "Startup & MSME Friendly",
                "SEO-Optimized, Digital-First",
                "Transparent Pricing",
                "Expert Support Team",
                "Fast Turnaround Time"
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition">
                  <CheckCircle2 className="text-blue-400 shrink-0" size={20} />
                  <span className="font-medium text-sm md:text-base">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Office Info Footer Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Visit Our Headquarters</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg">
            #1, 1st Floor, Electronic City Main Road, Bettadasanapura, Bangalore-560100
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex items-center gap-3 text-blue-600 font-bold">
              <Clock size={24} />
              <span className="uppercase tracking-widest text-xs">Mon – Sat: 9:30 AM – 6:30 PM</span>
            </div>
            <div className="h-px sm:h-8 w-16 sm:w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 text-slate-900 font-bold">
              <Users size={24} />
              <span className="uppercase tracking-widest text-xs">Walk-ins Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
