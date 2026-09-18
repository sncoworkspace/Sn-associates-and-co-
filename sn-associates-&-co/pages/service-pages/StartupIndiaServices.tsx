import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Rocket, Award, CheckCircle2, ShieldCheck, Zap, DollarSign,
  TrendingUp, FileText, ArrowRight, ChevronDown, ChevronUp, Phone, MessageSquare
} from 'lucide-react';

export const StartupIndiaServices: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const benefits = [
    {
      title: 'Section 80-IAC 100% Tax Holiday',
      tag: '3 Consecutive Years Tax Free',
      desc: 'Eligible DPIIT-recognized startups can claim a 100% deduction on profits for 3 consecutive years out of their first 10 years of operations.'
    },
    {
      title: 'Angel Tax Exemption u/s 56(2)(viib)',
      tag: 'Zero Tax on Share Premium',
      desc: 'Exemption from tax on investments received above fair market value from angel investors, family offices, and foreign funds.'
    },
    {
      title: 'MSME Udyam Registration',
      tag: 'Immediate Government Certificate',
      desc: 'Access to priority sector collateral-free bank loans (CGTMSE up to ₹5 Cr), subsidized electricity tariffs, and ISO reimbursement.'
    },
    {
      title: '45-Day Delayed Payment Protection',
      tag: 'Legal Shield u/s 15 of MSMED Act',
      desc: 'Protection against enterprise buyers delaying payments beyond 45 days, with mandatory compounding interest at 3x the RBI bank rate.'
    },
    {
      title: '80% Patent & 50% Trademark Rebate',
      tag: 'Fast-Track Intellectual Property',
      desc: 'Massive government fee reductions on IP applications and fast-tracked examination through dedicated government facilitators.'
    },
    {
      title: 'Self-Certification for 9 Labour & Env Laws',
      tag: 'Zero Inspection for 3-5 Years',
      desc: 'Freedom from government inspector compliance raids for 3 to 5 years through simple self-certification on Shram Suvidha portal.'
    }
  ];

  const faqs = [
    {
      q: 'What are the core eligibility criteria for DPIIT Startup Recognition?',
      a: 'The entity must be incorporated as a Private Limited Company, LLP, or Registered Partnership in India not older than 10 years, with annual turnover not exceeding ₹100 Crores in any financial year, and working towards innovation, development, or commercialization of new products/services.'
    },
    {
      q: 'How does Section 43B(h) of the Income Tax Act benefit registered MSMEs?',
      a: 'Section 43B(h) mandates that buyers must settle invoices from registered MSME suppliers within 45 days (if an agreement exists) or 15 days (without agreement). If not paid within this timeline, the buyer cannot claim the expense as a tax deduction until actual payment, drastically speeding up MSME receivables.'
    },
    {
      q: 'What is the Startup India Seed Fund Scheme (SISFS)?',
      a: 'SISFS provides financial assistance up to ₹20 Lakhs as a grant for proof of concept, prototype development, and product trials, and up to ₹50 Lakhs of debt/convertible debentures for market entry and scaling through eligible incubators.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="Startup India & MSME Udyam Registration Bangalore | 80-IAC Tax Exemption"
        description="Fast DPIIT Startup Recognition & MSME Udyam registration in Bangalore. Unlock 3-year Section 80-IAC tax holiday, Angel Tax relief, collateral-free loans, and 80% IPR rebates with Senior CA guidance."
        canonicalUrl="/services/startup-india-msme"
        keywords={[
          'Startup India Registration Bangalore',
          'DPIIT Recognition Consultant',
          'Section 80 IAC Tax Exemption CA',
          'MSME Udyam Registration',
          'Angel Tax Exemption India',
          'Startup India Seed Fund SISFS'
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Rocket size={14} /> Startup Acceleration & MSME Growth Cell
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            Scale Your Venture with <span className="text-blue-400">Startup India & MSME Incentives</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Unlock government tax holidays, Angel Tax immunity, collateral-free credit, and preferential procurement. End-to-end certification handled by seasoned startup CAs.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Phone size={18} /> Check Startup India Eligibility
            </Link>
            <a
              href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20want%20to%20apply%20for%20DPIIT%20Startup%20Recognition%20and%2080-IAC"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare size={18} /> WhatsApp Startup Specialist
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Transformative Government Benefits
          </h2>
          <p className="text-slate-600">
            Exclusive statutory rights and financial incentives reserved for verified Indian startups and MSMEs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
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
                  Apply with Our CA Team <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Key answers regarding DPIIT application, seed funds, and MSME rights.</p>
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

export default StartupIndiaServices;