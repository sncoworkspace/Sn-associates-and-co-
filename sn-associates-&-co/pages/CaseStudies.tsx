import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Clock, 
  Coins, 
  Users, 
  Check, 
  Sparkles, 
  Filter, 
  Briefcase
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

interface CaseStudy {
  id: string;
  title: string;
  clientType: string;
  industry: 'SaaS & Tech' | 'E-Commerce & Retail' | 'Healthcare' | 'FinTech & BFSI';
  serviceCategory: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    designation: string;
  };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'saas-tax-holiday',
    title: 'Securing Section 80-IAC 100% Tax Exemption for a B2B AI SaaS Startup',
    clientType: 'Series-A funded B2B SaaS Enterprise',
    industry: 'SaaS & Tech',
    serviceCategory: 'Startup India & Tax Holidays',
    challenge: 'The client was scaling rapidly with ₹12 Cr ARR but faced impending 25% corporate tax liabilities that would restrict engineering hiring and international cloud infrastructure expansion.',
    solution: 'SN Associates & Co structured an airtight Inter-Ministerial Board (IMB) application under Startup India Section 80-IAC, drafting patent-oriented technological innovation dossiers, audited cash flow forecasts, and representational presentations.',
    metrics: [
      { label: 'Corporate Tax Saved', value: '₹42+ Lakhs' },
      { label: 'Tax Holiday Duration', value: '3 Consecutive Years' },
      { label: 'Approval Turnaround', value: '75 Days' }
    ],
    testimonial: {
      quote: 'SN Associates turned what seemed like an impossible bureaucratic 80-IAC approval into a structured, stress-free win. Their deep mastery of DPIIT guidelines saved us substantial capital that we reinvested in our engineering team.',
      author: 'Karthik N.',
      designation: 'Co-Founder & CEO, CloudMatrix AI'
    }
  },
  {
    id: 'd2c-gst-refund',
    title: 'Unlocking ₹28 Lakhs in Blocked Working Capital via GST Inverted Duty Refund',
    clientType: 'Omnichannel D2C Lifestyle & Apparel Brand',
    industry: 'E-Commerce & Retail',
    serviceCategory: 'GST Restructuring & Refund Audit',
    challenge: 'Due to higher GST tax rates on raw material inputs (18%) versus finished apparel output sales (5% / 12%), the brand suffered massive cash lockup in electronic credit ledgers, causing supplier payment delays.',
    solution: 'Our indirect tax team conducted an exhaustive SKU-level HSN mapping, audited GSTR-2B monthly vendor compliance, prepared RFD-01 refund applications across 4 states, and liaised with GST adjudicating authorities to release full credits.',
    metrics: [
      { label: 'Refund Cash Disbursed', value: '₹28.4 Lakhs' },
      { label: 'ITC Leakage Plugged', value: '100%' },
      { label: 'Cash Flow Cycle Boost', value: '32 Days Faster' }
    ],
    testimonial: {
      quote: 'Having ₹28 Lakhs sitting frozen in GST ledgers was choking our holiday marketing campaigns. SN Associates managed the entire audit and state tax officer hearings seamlessly.',
      author: 'Pooja Sundaram',
      designation: 'Chief Financial Officer, Aura Lifestyle'
    }
  },
  {
    id: 'mca-strike-off-cured',
    title: 'Rescuing a Healthcare Tech Firm from MCA Inactive Strike-Off & Penalties',
    clientType: 'Diagnostic Telemedicine Startup',
    industry: 'Healthcare',
    serviceCategory: 'MCA & ROC Regularization',
    challenge: 'Following co-founder restructuring, the company missed consecutive annual ROC filings (AOC-4, MGT-7, and INC-20A Commencement of Business), receiving an MCA notice under Section 248 with impending bank account freezing.',
    solution: 'We drafted comprehensive compounding petitions before the Regional Director (RD) & Registrar of Companies, held an extraordinary general meeting (EGM), regularized statutory books with chartered auditor appointments, and restored active MCA compliance in 14 days.',
    metrics: [
      { label: 'Statutory Penalty Averted', value: '₹3.8 Lakhs' },
      { label: 'Director Disqualification', value: '0% (Clean)' },
      { label: 'Bank Freezing Averted', value: 'Immediate Stay' }
    ],
    testimonial: {
      quote: 'When the MCA notice arrived threatening to freeze our operating accounts, we panicked. The corporate secretarial team at SN Associates stepped in, handled the ROC representation, and brought us into complete compliance.',
      author: 'Dr. Arvind Varma',
      designation: 'Managing Director, CarePulse Health'
    }
  },
  {
    id: 'fintech-tax-audit-defense',
    title: 'Zero-Addition Defense for a FinTech Platform in Faceless Income Tax Assessment',
    clientType: 'High-Volume Payments Aggregator',
    industry: 'FinTech & BFSI',
    serviceCategory: 'Income Tax Notice Defense & Transfer Pricing',
    challenge: 'The Income Tax Department issued a Section 148 reassessment notice questioning ₹18 Cr in customer wallet settlements and inter-company technology royalty fees.',
    solution: 'Our direct tax controversy practice submitted comprehensive transaction logs, third-party nodal bank reconciliations, Form 3CEB international transfer pricing documentation, and detailed written legal arguments via the Faceless Assessment Portal.',
    metrics: [
      { label: 'Tax Demand Reduced', value: 'From ₹1.4 Cr to ₹0' },
      { label: 'Addition by AO', value: '₹0 (100% Relief)' },
      { label: 'Legal Assessment Status', value: 'Completed' }
    ],
    testimonial: {
      quote: 'Facing a multi-crore faceless tax scrutiny was nerve-wracking. The depth of documentation and legal backing provided by SN Associates left zero room for arbitrary additions by the assessing officer.',
      author: 'Rohit Shenoy',
      designation: 'Head of Finance, PayNova Technologies'
    }
  }
];

export const CaseStudies: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const filteredStudies = useMemo(() => {
    if (selectedIndustry === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter((item) => item.industry === selectedIndustry);
  }, [selectedIndustry]);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Client Case Studies & Proven Results | SN Associates & Co',
    description: 'Explore verified case studies showing how SN Associates & Co helps startups, SMEs, and enterprises optimize taxes, secure 80-IAC exemptions, and cure ROC non-compliance.',
    publisher: {
      '@type': 'Organization',
      name: 'SN Associates & Co',
      url: 'https://snassociatesandco.com'
    }
  };

  return (
    <>
      <SEOHead
        title="Client Case Studies & Proven Financial Results | SN Associates & Co"
        description="Explore verified case studies showcasing how SN Associates & Co helps Indian startups, D2C brands, and healthcare enterprises save taxes, secure 80-IAC holidays, and cure MCA ROC notices."
        canonicalUrl="/case-studies"
        keywords={[
          'chartered accountant case studies bangalore',
          'section 80-iac approval case study',
          'gst inverted duty refund case study',
          'mca strike off regularization',
          'income tax scrutiny notice defense',
          'startup tax saving proven results'
        ]}
        schemaData={schemaData}
      />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Client Transformations
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Real Impact. <span className="text-emerald-600">Measurable Savings.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Discover how our chartered accountants and corporate legal advisors protect capital, resolve statutory bottlenecks, and scale Indian enterprises with precision.
            </p>
          </div>

          {/* Aggregate Proven Metric Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">₹14+ Cr</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">Client Taxes Optimized</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">Notice Defense Success</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">350+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">Startups Incorporated</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">0%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">Director Disqualification</div>
            </div>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Case Studies' },
              { id: 'SaaS & Tech', label: 'SaaS & Tech Startups' },
              { id: 'E-Commerce & Retail', label: 'D2C & Retail Brands' },
              { id: 'Healthcare', label: 'Healthcare & Biotech' },
              { id: 'FinTech & BFSI', label: 'FinTech & High Volume' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedIndustry(pill.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedIndustry === pill.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Case Studies Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8">
                  {/* Category badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {study.industry}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {study.serviceCategory}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
                    {study.title}
                  </h2>

                  {/* Challenge & Solution Blocks */}
                  <div className="space-y-4 text-xs sm:text-sm text-slate-600 mb-6">
                    <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
                      <strong className="text-red-900 font-bold block mb-1">The Challenge:</strong>
                      <p className="text-slate-700 leading-relaxed">{study.challenge}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <strong className="text-emerald-900 font-bold block mb-1">Our Strategic Solution:</strong>
                      <p className="text-slate-700 leading-relaxed">{study.solution}</p>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    {study.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-base sm:text-lg font-extrabold text-slate-900">{m.value}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <div className="border-l-2 border-indigo-500 pl-4 py-1 italic text-xs sm:text-sm text-slate-700 mb-2">
                    "{study.testimonial.quote}"
                    <div className="not-italic font-bold text-slate-900 mt-2 text-xs">
                      {study.testimonial.author} · <span className="font-normal text-slate-500">{study.testimonial.designation}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Need this for your company?</span>
                  <Link
                    to="/book-consultation"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Schedule Consultation
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Consultation CTA Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Facing a Complex Tax or Statutory Challenge?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3">
                Connect directly with practicing Chartered Accountants and Corporate Law specialists. We analyze your situation and propose actionable, legally compliant solutions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/book-consultation"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 text-sm"
                >
                  Book Free 1-on-1 Discovery Session
                </Link>
                <Link
                  to="/services"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-slate-700 text-sm"
                >
                  Explore All 120+ CA Services
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CaseStudies;
