import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  FileCheck2, ShieldAlert, CheckCircle2, Clock, FileText, ArrowRight,
  HelpCircle, ChevronDown, ChevronUp, Phone, MessageSquare, AlertCircle,
  Receipt, Calculator, Award
} from 'lucide-react';

export const GstServices: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const gstOfferings = [
    {
      title: 'New GST Registration',
      tag: 'Fast 3-Day Allotment',
      desc: 'End-to-end GSTIN registration on the official GST portal with Aadhaar biometric authentication assistance and zero notice queries.'
    },
    {
      title: 'Monthly Return Filing (GSTR-1 & 3B)',
      tag: '100% On-Time Filing',
      desc: 'Invoice-level reconciliation, GSTR-2B Input Tax Credit (ITC) matching, tax liability calculation, and timely challan generation.'
    },
    {
      title: 'Annual Return & Audit (GSTR-9 & 9C)',
      tag: 'CA Certified Reconciliation',
      desc: 'Annual turnover audit, reconciliation of books vs portal returns, and filing of statutory self-certified GSTR-9C statements.'
    },
    {
      title: 'Export LUT Filing (Zero-Rated Supply)',
      tag: 'Essential for Exporters & SaaS',
      desc: 'Letter of Undertaking (LUT) filing for service and goods exporters to supply overseas clients without upfront IGST payment.'
    },
    {
      title: 'Revocation of Cancelled GSTIN',
      tag: 'Restoration within 15 Days',
      desc: 'Legal drafting of restoration application u/s 30, clearing pending backlogs, and representing before the jurisdictional GST officer.'
    },
    {
      title: 'GST Notice & Scrutiny Defense',
      tag: 'Senior CA Representation',
      desc: 'Drafting legal replies for DRC-01, ASMT-10, ITC mismatches, and personal hearings before the Assistant Commissioner.'
    }
  ];

  const faqs = [
    {
      q: 'Who is required to obtain mandatory GST registration in India?',
      a: 'Businesses with aggregate annual turnover exceeding ₹40 Lakhs for goods (₹20 Lakhs in special category states) and ₹20 Lakhs for service providers (₹10 Lakhs in special states). In addition, all e-commerce sellers, interstate suppliers, casual taxable persons, and export businesses require mandatory GST registration regardless of turnover.'
    },
    {
      q: 'What is the penalty for not filing monthly GST returns on time?',
      a: 'A late fee of ₹50 per day (₹25 CGST + ₹25 SGST) is charged up to a maximum of ₹5,000 to ₹10,000 per return, along with 18% per annum interest on the unpaid net tax liability from the due date until payment.'
    },
    {
      q: 'How does SN Associates help prevent Input Tax Credit (ITC) leakage?',
      a: 'We perform automated cross-verification between your purchase register and the supplier-filed GSTR-2B. We flag defaulting vendors who have not paid taxes, ensuring you only claim valid ITC and avoid recovery notices under Section 16(2)(c).'
    },
    {
      q: 'Can a service exporter or freelancer claim GST refund?',
      a: 'Yes. Export of services is considered zero-rated supply. You can either export under an LUT without paying tax or pay IGST and claim an expeditious cash refund of the accumulated unutilized Input Tax Credit.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="GST Registration & Return Filing in Bangalore | Senior CA Advisory"
        description="Fast, reliable GST Registration and monthly GSTR-1 & GSTR-3B return filing in Bangalore. Zero late-fee guarantee, GSTR-2B ITC reconciliation, export LUT filing, and notice representation by Senior Chartered Accountants."
        canonicalUrl="/services/gst-registration-filing"
        keywords={[
          'GST Registration Bangalore',
          'GSTR 1 and GSTR 3B Filing CA',
          'GST Consultant Bangalore',
          'LUT Filing Export India',
          'GST Notice Representation',
          'Input Tax Credit Reconciliation'
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Receipt size={14} /> Goods & Services Tax (GST) Advisory Cell
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            Flawless <span className="text-blue-400">GST Registration & Filing</span> with Zero Penalty Risk
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Complete statutory GST management for Bangalore startups, e-commerce brands, and enterprises. Accurate ITC reconciliation, timely monthly returns, and zero-headache compliance.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Phone size={18} /> Schedule Free GST Review
            </Link>
            <Link
              to="/tools/gst-calculator"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <Calculator size={18} /> Interactive GST Calculator
            </Link>
            <a
              href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20need%20assistance%20with%20GST%20registration%20or%20filing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare size={18} /> WhatsApp Expert CA
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <Award className="text-emerald-400 shrink-0" size={20} />
              <span>3-Day GSTIN Allotment</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-400 shrink-0" size={20} />
              <span>100% GSTR-2B Matching</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-amber-400 shrink-0" size={20} />
              <span>Zero Late-Fee Record</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-indigo-400 shrink-0" size={20} />
              <span>Notice Defense Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Comprehensive GST Solutions
          </h2>
          <p className="text-slate-600">
            From initial registration to intricate annual audits and appellate dispute resolution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {gstOfferings.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-4">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link to="/book-consultation" className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-blue-700">
                  Request Assistance <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Thresholds & Penalties Comparison */}
      <section className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold mb-4">
                <AlertCircle size={14} /> Statutory Threshold Guidelines
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                When Must You Register for GST?
              </h2>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Suppliers of Goods</div>
                  <div>Annual aggregate turnover exceeds <strong>₹40 Lakhs</strong> (₹20 Lakhs in Special Category States).</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Service Providers & Professionals</div>
                  <div>Annual aggregate turnover exceeds <strong>₹20 Lakhs</strong> (₹10 Lakhs in Special Category States).</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Mandatory Registration (Regardless of Turnover)</div>
                  <div>Inter-state sales, e-commerce sellers on Amazon/Flipkart, software exporters, non-resident taxable persons.</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-black mb-4">Avoid Penalties with SN Associates</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                A single delayed return can accumulate thousands in late fees and lock down your E-Way bill generation. Our automated tax calendar guarantees proactive filing 3 days before statutory deadlines.
              </p>
              <ul className="space-y-3 text-xs md:text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Zero late-fee guarantee backed by dedicated CA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Maximum ITC optimization with GSTR-2B automation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Fast-track refund processing for service exporters
                </li>
              </ul>
              <Link
                to="/compliance-calendar"
                className="w-full block text-center py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-2xl transition-all text-sm shadow-md"
              >
                View Live GST Compliance Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Essential statutory answers for business owners and CFOs.</p>
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

export default GstServices;