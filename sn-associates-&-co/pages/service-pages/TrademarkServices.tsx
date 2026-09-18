import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Shield, CheckCircle2, Search, ArrowRight, ShieldCheck, 
  HelpCircle, Clock, ChevronDown, ChevronUp, Phone, MessageSquare,
  Award, Sparkles, Scale, FileCheck
} from 'lucide-react';

export const TrademarkServices: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tmServices = [
    {
      title: 'Trademark Search & Clearance Report',
      tag: 'Comprehensive Pre-Filing Audit',
      desc: 'Phonetic, visual, and conceptual search across all 45 Nice Classification classes to ensure your brand name has 0 conflict with prior registered marks.'
    },
    {
      title: 'Trademark Filing (TM-A)',
      tag: 'Fast 24-Hour Filing',
      desc: 'Drafting and filing application on the IP India portal. Get instant ™ symbol entitlement within 24 hours of submission.'
    },
    {
      title: 'Examination Report Reply',
      tag: 'Legal Objection Drafting',
      desc: 'Expert legal response drafting for Section 9 (Absolute Grounds) and Section 11 (Relative Grounds with similar marks) examination reports.'
    },
    {
      title: 'Show Cause Hearing Representation',
      tag: 'IP Attorney Appearance',
      desc: 'Personal or virtual appearance by experienced Trademark Attorneys before the Registrar of Trademarks during formal hearings.'
    },
    {
      title: 'Copyright Registration',
      tag: 'Software, Content & Artistic',
      desc: 'Securing legal protection for software code, website UI/UX designs, literary works, logos, and proprietary course curricula.'
    },
    {
      title: 'Trademark Assignment & Licensing',
      tag: 'Commercial Contracts',
      desc: 'Legal agreements for brand licensing, royalty structuring, brand mergers, and complete transfer of trademark title.'
    }
  ];

  const faqs = [
    {
      q: 'How long does it take to get the ® (Registered) symbol in India?',
      a: 'You can legally use the ™ symbol immediately after filing the application (within 24 hours). The final ® registered symbol is awarded after examination, journal publication without opposition (4 months), and certificate issuance—typically taking 6 to 12 months.'
    },
    {
      q: 'Can startups and MSMEs claim government fee discounts on trademark filing?',
      a: 'Yes! The government official statutory fee for individuals, startups with DPIIT recognition, and MSMEs with Udyam Certificate is ₹4,500 per class (compared to ₹9,000 for standard private limited companies), offering a direct 50% government fee subsidy.'
    },
    {
      q: 'What happens if another party opposes my trademark during journal publication?',
      a: 'Any third party has 4 months to file a formal opposition (Form TM-O). Our trademark litigation cell will draft a comprehensive Counter-Statement (Form TM-M), prepare evidence affidavits, and represent your case at the Trade Marks Registry.'
    },
    {
      q: 'For how long is a trademark registration valid in India?',
      a: 'A registered trademark is valid for 10 years from the date of application and can be renewed indefinitely every 10 years by paying statutory renewal fees.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="Trademark Registration in Bangalore | Fast-Track TM Filing & IP Protection"
        description="Protect your brand name, logo, and slogan with fast trademark registration in Bangalore. 24-hour ™ filing, comprehensive class search, objection reply, and IP attorney representation."
        canonicalUrl="/services/trademark-registration"
        keywords={[
          'Trademark Registration Bangalore',
          'TM Filing Consultant',
          'Brand Registration India',
          'Trademark Objection Reply',
          'Copyright Registration Bangalore',
          'Patent and IP Advisory'
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={14} /> Intellectual Property & Brand Protection Cell
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            Defend Your Brand with <span className="text-blue-400">Fast-Track Trademark Registration</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Secure exclusive legal rights to your brand name, logo, and product identity across India. 24-hour filing with complete objection defense by experienced IP attorneys.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Phone size={18} /> Book Free Brand Audit
            </Link>
            <a
              href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20want%20to%20conduct%20a%20free%20Trademark%20Search%20for%20my%20brand"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare size={18} /> Request Free TM Search
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <Clock className="text-emerald-400 shrink-0" size={20} />
              <span>™ Symbol in 24 Hours</span>
            </div>
            <div className="flex items-center gap-3">
              <Search className="text-blue-400 shrink-0" size={20} />
              <span>Full 45-Class TM Search</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-amber-400 shrink-0" size={20} />
              <span>50% Govt Fee Subsidy</span>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="text-indigo-400 shrink-0" size={20} />
              <span>Attorney Hearing Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Complete Intellectual Property Solutions
          </h2>
          <p className="text-slate-600">
            From preliminary name validation to national trademark enforcement and brand licensing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tmServices.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-4">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link to="/book-consultation" className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-blue-700">
                  Protect Your Brand <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Step Lifecycle */}
      <section className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Trademark Registration Lifecycle</h2>
            <p className="text-slate-600 text-sm">Clear milestones from initial submission to final registration certificate.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'TM Search', desc: 'Detailed phonetic & semantic clearance across registered databases.' },
              { step: '02', title: 'Filing & ™', desc: 'Online application submission with receipt of TM application number.' },
              { step: '03', title: 'Examination', desc: 'Scrutiny by Registry officer. Drafting replies for Section 9/11 if queried.' },
              { step: '04', title: 'Publication', desc: 'Published in official Trade Marks Journal for 4-month opposition window.' },
              { step: '05', title: '® Certificate', desc: 'Issuance of official Registration Certificate with 10-year legal validity.' }
            ].map((st, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-2xl font-black text-blue-600 mb-2">{st.step}</div>
                <div className="font-bold text-slate-900 mb-2 text-sm">{st.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Answers to key brand protection questions.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 text-sm md:text-base"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrademarkServices;