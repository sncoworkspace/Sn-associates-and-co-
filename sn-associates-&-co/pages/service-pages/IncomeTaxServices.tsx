import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Calculator, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle,
  FileSpreadsheet, ArrowRight, HelpCircle, ChevronDown, ChevronUp,
  Phone, MessageSquare, Briefcase, Award, Sparkles
} from 'lucide-react';

export const IncomeTaxServices: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const itrTypes = [
    {
      form: 'ITR-1 (Sahaj)',
      tag: 'Salaried Individuals',
      desc: 'For residents with total income up to ₹50 Lakhs from salary, one house property, and other sources (interest, dividends).'
    },
    {
      form: 'ITR-2',
      tag: 'Capital Gains & ESOPs',
      desc: 'For individuals and HUFs having income from capital gains (shares, mutual funds, property), foreign assets, or multiple properties.'
    },
    {
      form: 'ITR-3',
      tag: 'Business & Professional',
      desc: 'For individuals and HUFs having income from a proprietary business, partnership firm, doctors, lawyers, and consultants.'
    },
    {
      form: 'ITR-4 (Sugam)',
      tag: 'Presumptive Taxation (44AD / 44ADA)',
      desc: 'Ideal for freelance developers, consultants, and small businesses declaring presumptive profits without maintaining heavy books.'
    },
    {
      form: 'ITR-5 & ITR-6',
      tag: 'Partnerships, LLPs & Companies',
      desc: 'Comprehensive statutory filing for LLPs, Private Limited entities, and public corporations with full balance sheet reporting.'
    },
    {
      form: 'Tax Audit u/s 44AB',
      tag: 'CA Certified Audit Report',
      desc: 'Mandatory statutory audit for businesses exceeding ₹1 Crore (or ₹10 Crores with 95% digital payments) turnover.'
    }
  ];

  const faqs = [
    {
      q: 'Which tax regime is more beneficial for FY 2025-26: Old or New?',
      a: 'The New Tax Regime is the default regime with lower tax slab rates and an increased standard deduction of ₹75,000 for salaried employees. If your total eligible deductions (80C, 80D, HRA, home loan interest) exceed ₹3.75 to ₹4 Lakhs, the Old Regime may yield greater tax savings. Our Senior CAs calculate both side-by-side to ensure maximum refund.'
    },
    {
      q: 'What is Presumptive Taxation u/s 44ADA for tech professionals and freelancers?',
      a: 'Under Section 44ADA, specified professionals (software developers, designers, doctors, legal consultants) with gross receipts up to ₹75 Lakhs can declare 50% of gross receipts as taxable profit and are exempt from maintaining exhaustive books of accounts or undergoing tax audit.'
    },
    {
      q: 'How should I report RSUs and stock options (ESOPs) in multinational companies?',
      a: 'Foreign RSUs and foreign bank accounts require mandatory disclosure under Schedule FA (Foreign Assets) in ITR-2 or ITR-3. Failure to report foreign assets attracts strict penal consequences under the Black Money Act. Our CA team specializes in cross-border tech compensation.'
    },
    {
      q: 'What should I do if I receive a high-value transaction notice or mismatch in AIS/TIS?',
      a: 'Do not panic. Most notices are automated discrepancy alerts from Annual Information Statement (AIS) data. We reconcile your bank statements with the Income Tax portal, prepare documentary evidence, and file a formal online response within the stipulated 30-day window.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="Income Tax Return (ITR) Filing & Tax Audit in Bangalore | Senior CA Advisory"
        description="Expert Income Tax Return (ITR) filing in Bangalore for salaried, freelancers, business owners, and NRIs. Maximum legal tax deductions, capital gains calculation, Section 44AB audits, and notice resolution by Senior Chartered Accountants."
        canonicalUrl="/services/income-tax-filing"
        keywords={[
          'Income Tax Filing Bangalore',
          'ITR Filing CA Bangalore',
          'Tax Audit 44AB Consultant',
          'Capital Gains Tax CA',
          'Freelancer 44ADA Tax Filing',
          'NRI Income Tax Advisory'
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Calculator size={14} /> Direct Taxation & Statutory Audit Division
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            Maximize Your Savings with <span className="text-blue-400">Expert ITR Filing & Tax Audits</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Navigate complex tax laws with Senior Chartered Accountants. Complete support for salaried professionals, high-net-worth investors, startup founders, and corporations.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Phone size={18} /> Schedule CA Tax Review
            </Link>
            <Link
              to="/tools/income-tax-calculator"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <Calculator size={18} /> Old vs New Tax Calculator
            </Link>
            <a
              href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20need%20expert%20assistance%20with%20Income%20Tax%20Filing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare size={18} /> WhatsApp Senior CA
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="text-emerald-400 shrink-0" size={20} />
              <span>Max Legal Tax Optimization</span>
            </div>
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-blue-400 shrink-0" size={20} />
              <span>Full AIS / TIS Reconciliation</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-amber-400 shrink-0" size={20} />
              <span>100% CA Verified Filing</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-400 shrink-0" size={20} />
              <span>Notice Handling Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* ITR Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Tailored Filing for Every Tax Profile
          </h2>
          <p className="text-slate-600">
            From single-employer salaries to multi-entity business conglomerates and cross-border stock grants.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {itrTypes.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-4">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.form}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link to="/book-consultation" className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-blue-700">
                  File with Senior CA <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tax Audit & Scrutiny Section */}
      <section className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold mb-4">
                <AlertTriangle size={14} /> Section 44AB Statutory Audit
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                Are You Liable for a Mandatory Tax Audit?
              </h2>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed mb-8">
                <p>
                  Under Section 44AB of the Income Tax Act, 1961, businesses whose annual turnover exceeds <strong>₹1 Crore</strong> (or <strong>₹10 Crores</strong> provided digital receipts and payments constitute at least 95% of total transactions) are mandatorily required to get their accounts audited by a practicing Chartered Accountant.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Penalty for Non-Compliance:</strong> Failure to obtain and furnish a tax audit report u/s 44AB attracts a penalty under Section 271B equal to <strong>0.5% of total sales/turnover</strong> or <strong>₹1,50,000</strong>, whichever is lower.
                </div>
              </div>
              <Link
                to="/book-consultation"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow"
              >
                Engage Statutory Tax Auditor <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-black mb-4">Notice Resolution & Scrutiny Defense</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Received an automated intimation under Section 143(1), defective return notice under 139(9), or a scrutiny notice under 143(2)? Our direct tax litigation team drafts legally sound responses with complete documentary reconciliations.
              </p>
              <ul className="space-y-3 text-xs md:text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Thorough analysis of AIS/TIS discrepancy sources
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Formal submission on the Income Tax E-filing portal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> Personal representation before the Assessing Officer (AO)
                </li>
              </ul>
              <a
                href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20have%20received%20an%20Income%20Tax%20Notice%20and%20need%20urgent%20review"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-2xl transition-all text-sm shadow-md"
              >
                Send Notice for Urgent CA Evaluation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Critical tax filing answers authored by our Senior Tax Partners.</p>
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

export default IncomeTaxServices;