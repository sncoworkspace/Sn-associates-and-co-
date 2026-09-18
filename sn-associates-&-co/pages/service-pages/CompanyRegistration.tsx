import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Building2, CheckCircle2, FileText, ArrowRight, ShieldCheck, 
  HelpCircle, Clock, Users, ChevronDown, ChevronUp, Phone, MessageSquare,
  Award, Sparkles, Check, Download
} from 'lucide-react';

export const CompanyRegistration: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedEntity, setSelectedEntity] = useState<'pvt' | 'llp' | 'opc'>('pvt');

  const faqs = [
    {
      q: 'How many days does it take to register a Private Limited Company in Bangalore?',
      a: 'With all director documents (PAN, Aadhaar, bank statement) ready, incorporation through SPICe+ typically takes 5 to 7 business days, including RUN name approval, DSC issuance, and Certificate of Incorporation (COI) from the Registrar of Companies (ROC).'
    },
    {
      q: 'What is the minimum capital required to start a company in India?',
      a: 'There is no minimum paid-up capital requirement under the Companies Act, 2013. You can start a Private Limited Company with an authorized capital of ₹1,00,000 and paid-up capital as low as ₹1,000.'
    },
    {
      q: 'Can a foreign national or NRI be a director in an Indian company?',
      a: 'Yes, NRIs, PIOs, and foreign nationals can be directors. However, at least one director on the board must be a resident of India (who has stayed in India for not less than 182 days in the preceding financial year).'
    },
    {
      q: 'Is a commercial office mandatory for registered office address?',
      a: 'No. You can register your company at a residential address (owned or rented). You just need an electricity bill/water bill not older than 2 months and an NOC from the property owner.'
    },
    {
      q: 'What statutory deliverables are provided upon incorporation?',
      a: 'You receive the Certificate of Incorporation (COI) containing CIN, Corporate PAN card, Corporate TAN, certified digital MOA & AOA, EPFO & ESIC registration codes, Professional Tax registration, and zero-balance current account pre-approval.'
    }
  ];

  const entityData = {
    pvt: {
      title: 'Private Limited Company (Pvt Ltd)',
      badge: 'Best for Startups & Equity Funding',
      features: [
        'Separate legal entity with perpetual succession',
        'Limited liability protection for shareholders',
        'Eligible for Venture Capital & Angel investments',
        'Can issue ESOPs to attract top engineering talent',
        'Eligible for Startup India 80-IAC 3-year tax holiday'
      ],
      idealFor: 'High-growth startups, tech companies, and businesses looking to raise external capital.'
    },
    llp: {
      title: 'Limited Liability Partnership (LLP)',
      badge: 'Best for Professional Firms & Agencies',
      features: [
        'Partners have limited liability protection',
        'Lower compliance costs compared to Pvt Ltd',
        'No mandatory statutory audit if turnover is under ₹40L',
        'No Dividend Distribution Tax on partner profits',
        'Simple operational agreement structure'
      ],
      idealFor: 'Consulting agencies, service firms, retail trade, and family-owned businesses.'
    },
    opc: {
      title: 'One Person Company (OPC)',
      badge: 'Best for Solo Entrepreneurs & Founders',
      features: [
        '100% ownership and control in a single person',
        'Corporate status and limited liability protection',
        'Nominee director safeguards business continuity',
        'Easy conversion to Private Limited as business scales',
        'Exempt from certain rigid AGM compliance requirements'
      ],
      idealFor: 'Solo founders, consultants, creators, and single-promoter proprietary ventures.'
    }
  };

  const steps = [
    {
      step: '01',
      title: 'Digital Signature & Name Reservation',
      desc: 'Issuance of Class-3 DSC for all proposed directors and reservation of unique company name via MCA RUN/SPICe+ Part A portal.'
    },
    {
      step: '02',
      title: 'Charter Drafting (MOA & AOA)',
      desc: 'Custom drafting of Memorandum of Association (MOA) and Articles of Association (AOA) specifying business objects, shareholding, and governance.'
    },
    {
      step: '03',
      title: 'SPICe+ Part B & ROC Filing',
      desc: 'Consolidated submission of SPICe+ form with ROC, including DIN allocation, PAN/TAN generation, EPFO, ESIC, and statutory declarations.'
    },
    {
      step: '04',
      title: 'COI & Bank Account Opening',
      desc: 'Issuance of Certificate of Incorporation with Corporate Identity Number (CIN). Instant bank current account opening and commencement filing.'
    }
  ];

  const documents = [
    { title: 'Identity Proof', items: ['PAN Card of all Directors', 'Passport / Voter ID / Driving License'] },
    { title: 'Address Proof', items: ['Bank Statement with latest transaction (< 2 months)', 'Electricity / Mobile / Telephone Bill'] },
    { title: 'Registered Office', items: ['Electricity Bill / Property Tax Receipt (< 2 months)', 'Rent Agreement + Owner NOC letter'] },
    { title: 'Statutory Forms', items: ['Director Consent Form (DIR-2)', 'Digital Signature Certificate (DSC Class 3)'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="Company Registration in Bangalore | Pvt Ltd, LLP, OPC Incorporation"
        description="Fast, CA-guided Company Registration in Bangalore. Incorporate your Private Limited, LLP, or One Person Company in 5-7 days. Zero-error ROC filing, complete PAN, TAN, and statutory compliance."
        canonicalUrl="/services/company-registration"
        keywords={[
          'Company Registration Bangalore',
          'Private Limited Incorporation Bangalore',
          'LLP Registration Karnataka',
          'OPC Registration India',
          'Startup Incorporation CA',
          'SPICe+ MCA Filing'
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Building2 size={14} /> Official MCA & ROC Filing Cell
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            Incorporate Your <span className="text-blue-400">Company in Bangalore</span> with Zero Friction
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Turn your startup idea into a legally compliant corporate entity in 5–7 business days. Guided step-by-step by Senior Chartered Accountants and Corporate Law Specialists.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Phone size={18} /> Book Free Incorporation Call
            </Link>
            <a
              href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20want%20to%20register%20a%20new%20Company%20in%20Bangalore"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare size={18} /> Chat with CA on WhatsApp
            </a>
            <Link
              to="/tools/incorporation-estimator"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold transition-all text-sm"
            >
              Calculate Setup Cost
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <span>100% Paperless Process</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400 shrink-0" size={20} />
              <span>5–7 Days Turnaround</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-amber-400 shrink-0" size={20} />
              <span>Includes PAN, TAN & Bank A/c</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-indigo-400 shrink-0" size={20} />
              <span>1,200+ Startups Registered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Entity Selection Tabs */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
          <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-100 pb-6">
            <button
              onClick={() => setSelectedEntity('pvt')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                selectedEntity === 'pvt' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Private Limited (Pvt Ltd)
            </button>
            <button
              onClick={() => setSelectedEntity('llp')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                selectedEntity === 'llp' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Limited Liability Partnership (LLP)
            </button>
            <button
              onClick={() => setSelectedEntity('opc')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                selectedEntity === 'opc' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              One Person Company (OPC)
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-3">
                {entityData[selectedEntity].badge}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {entityData[selectedEntity].title}
              </h3>
              <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                {entityData[selectedEntity].idealFor}
              </p>
              <ul className="space-y-3">
                {entityData[selectedEntity].features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 rounded-2xl shadow-lg">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" /> What You Receive
              </h4>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Certificate of Incorporation (COI with CIN)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Corporate PAN & TAN Allotment
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> 2x Digital Signature Certificates (DSC Class 3)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Director Identification Numbers (DIN)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Electronic MOA & AOA Drafts
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> EPFO, ESIC & Professional Tax Registration
                </li>
              </ul>
              <Link
                to="/book-consultation"
                className="w-full block text-center py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow transition-all"
              >
                Incorporate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Process */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Our 4-Stage Incorporation Process
          </h2>
          <p className="text-slate-600">
            Clear, transparent, and compliant with all Ministry of Corporate Affairs (MCA) SPICe+ regulations.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <div className="text-4xl font-black text-blue-100 mb-3">{item.step}</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Required Documents Checklist */}
      <section className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Required Documents Checklist</h2>
            <p className="text-slate-600 text-sm">
              Keep these soft copies ready in PDF/JPEG format. Our CA team verifies everything before portal submission.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" /> {doc.title}
                </h3>
                <ul className="space-y-2">
                  {doc.items.map((it, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Common queries on incorporation rules, timelines, and ROC procedures.</p>
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

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black mb-3">Ready to Start Your Company?</h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl">
              Schedule a direct consultation with our Senior Chartered Accountants today and register your business without any legal loopholes.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow transition-all text-sm"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:+917406581456"
              className="px-8 py-4 bg-blue-800/60 hover:bg-blue-800 text-white font-bold rounded-2xl border border-blue-400/30 transition-all text-sm flex items-center gap-2"
            >
              <Phone size={16} /> +91 7406581456
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyRegistration;