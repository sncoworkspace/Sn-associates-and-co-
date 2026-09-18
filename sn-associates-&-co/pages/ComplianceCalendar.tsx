import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  Search, 
  ArrowRight, 
  FileText, 
  ShieldAlert, 
  CalendarDays,
  BellRing,
  Download,
  PhoneCall,
  Check
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

interface ComplianceEvent {
  id: string;
  dueDate: string; // YYYY-MM-DD
  dayDisplay: string;
  monthDisplay: string;
  title: string;
  category: 'GST' | 'Income Tax & TDS' | 'MCA & ROC' | 'Payroll & Labor';
  entity: string;
  description: string;
  penaltyWarning: string;
  urgency: 'high' | 'medium' | 'normal';
}

const STATUTORY_DEADLINES: ComplianceEvent[] = [
  {
    id: 'tds-monthly-payment',
    dueDate: '2026-10-07',
    dayDisplay: '07',
    monthDisplay: 'Oct',
    title: 'TDS / TCS Monthly Deposit (Challan ITNS 281)',
    category: 'Income Tax & TDS',
    entity: 'All Tax Deductors / Employers',
    description: 'Statutory deposit of tax deducted at source under Sections 192 (Salary), 194C (Contractor), 194J (Professional), 194I (Rent) for deductions made in September.',
    penaltyWarning: 'Mandatory interest of 1.5% per month or part of a month u/s 201(1A) from deduction date till payment.',
    urgency: 'high',
  },
  {
    id: 'gstr-1-monthly',
    dueDate: '2026-10-11',
    dayDisplay: '11',
    monthDisplay: 'Oct',
    title: 'GSTR-1 Monthly Return of Outward Supplies',
    category: 'GST',
    entity: 'Turnover > ₹5 Cr or Non-QRMP taxpayers',
    description: 'Mandatory reporting of B2B e-invoices, inter-state and intra-state outward supplies for September. Recipient ITC is blocked in GSTR-2B if delayed.',
    penaltyWarning: 'Late fee ₹50/day (₹20 for Nil return) plus blockage of E-Way Bill generation under Rule 138E.',
    urgency: 'high',
  },
  {
    id: 'gstr-1-iff-qrmp',
    dueDate: '2026-10-13',
    dayDisplay: '13',
    monthDisplay: 'Oct',
    title: 'Invoice Furnishing Facility (IFF) for QRMP Scheme',
    category: 'GST',
    entity: 'QRMP Taxpayers (Quarter 2)',
    description: 'Optional facility to upload B2B sales invoices for Month 2 (Sept) so buyers can avail seamless Input Tax Credit.',
    penaltyWarning: 'Non-filing prevents B2B buyers from claiming input tax credit in their monthly GSTR-3B.',
    urgency: 'medium',
  },
  {
    id: 'pf-esi-monthly',
    dueDate: '2026-10-15',
    dayDisplay: '15',
    monthDisplay: 'Oct',
    title: 'PF & ESI Monthly Contribution Deposit',
    category: 'Payroll & Labor',
    entity: 'Companies with 20+ (PF) / 10+ (ESI) employees',
    description: 'Remittance of Employees Provident Fund (EPF/EPS) and Employees State Insurance (ESIC) contributions deducted from payroll.',
    penaltyWarning: 'Disallowance of employer deduction under Section 36(1)(va) plus penal damages up to 25% under EPF Act.',
    urgency: 'medium',
  },
  {
    id: 'gstr-3b-monthly',
    dueDate: '2026-10-20',
    dayDisplay: '20',
    monthDisplay: 'Oct',
    title: 'GSTR-3B Summary Return & Tax Payment',
    category: 'GST',
    entity: 'All Monthly GST Taxpayers',
    description: 'Statutory summary return of outward and eligible inward supplies (ITC auto-populated from GSTR-2B) and payment of net GST liability.',
    penaltyWarning: 'Late fee of ₹50/day + 18% annual interest on net tax payable via cash ledger u/s 50.',
    urgency: 'high',
  },
  {
    id: 'gstr-3b-qrmp-cat1',
    dueDate: '2026-10-22',
    dayDisplay: '22',
    monthDisplay: 'Oct',
    title: 'GSTR-3B Quarterly Return (Category 1 States)',
    category: 'GST',
    entity: 'QRMP Scheme: South & West States (KA, MH, TN, TS, GJ, etc.)',
    description: 'Quarterly summary return for July-September quarter with ITC reconciliation against auto-generated GSTR-2B.',
    penaltyWarning: '₹50/day late fee + interest on delayed payments under the Fixed Sum / Self Assessment method.',
    urgency: 'high',
  },
  {
    id: 'dir-3-kyc',
    dueDate: '2026-10-31',
    dayDisplay: '31',
    monthDisplay: 'Oct',
    title: 'DIR-3 KYC / DIR-3 KYC WEB for DIN Holders',
    category: 'MCA & ROC',
    entity: 'All Directors holding active DIN / DPIN',
    description: 'Annual verification of personal credentials, mobile OTP, and email address of every Director who holds a DIN allotted by MCA.',
    penaltyWarning: 'DIN status becomes Deactivated / Suspended with a mandatory ₹5,000 late penalty per director upon resubmission.',
    urgency: 'high',
  },
  {
    id: 'tax-audit-report',
    dueDate: '2026-10-31',
    dayDisplay: '31',
    monthDisplay: 'Oct',
    title: 'Tax Audit Report Filing u/s 44AB (Form 3CA/3CB-3CD)',
    category: 'Income Tax & TDS',
    entity: 'Businesses with turnover > ₹1 Cr (Cash) or ₹10 Cr (Digital)',
    description: 'E-filing of Tax Audit Report by a practicing Chartered Accountant on the Income Tax E-filing portal.',
    penaltyWarning: 'Penalty under Section 271B equal to 0.5% of turnover or ₹1,50,000, whichever is lower.',
    urgency: 'high',
  },
  {
    id: 'tds-q2-return',
    dueDate: '2026-10-31',
    dayDisplay: '31',
    monthDisplay: 'Oct',
    title: 'Quarterly TDS Return Filing - Q2 (Form 24Q & 26Q)',
    category: 'Income Tax & TDS',
    entity: 'All Deductors (Corporate & Non-Corporate)',
    description: 'Quarterly e-TDS statement for July-September quarter for salary (24Q) and non-salary payments like contractor/rent/fees (26Q).',
    penaltyWarning: 'Mandatory ₹200 per day late fee u/s 234E till return is submitted, plus penalty up to ₹1,00,000 u/s 271H.',
    urgency: 'high',
  },
  {
    id: 'mca-aoc-4',
    dueDate: '2026-11-29',
    dayDisplay: '29',
    monthDisplay: 'Nov',
    title: 'MCA Form AOC-4 (Filing of Financial Statements)',
    category: 'MCA & ROC',
    entity: 'All Private Limited Companies, OPCs, Public Ltd',
    description: 'Filing of audited Balance Sheet, Profit & Loss statement, Director Report, and Auditor Report within 30 days of AGM.',
    penaltyWarning: 'Severe daily penalty of ₹100 per day of delay without ceiling, plus liability on directors.',
    urgency: 'high',
  },
  {
    id: 'mca-mgt-7',
    dueDate: '2026-12-29',
    dayDisplay: '29',
    monthDisplay: 'Dec',
    title: 'MCA Form MGT-7 / MGT-7A (Annual Return)',
    category: 'MCA & ROC',
    entity: 'All Companies registered with Ministry of Corporate Affairs',
    description: 'Annual return capturing shareholding structure, board meetings, director details, and corporate governance within 60 days of AGM.',
    penaltyWarning: 'Continuous penalty of ₹100 per day until compliance is cured.',
    urgency: 'medium',
  },
  {
    id: 'gst-annual-return-gstr9',
    dueDate: '2026-12-31',
    dayDisplay: '31',
    monthDisplay: 'Dec',
    title: 'GST Annual Return (GSTR-9) & Reconciliation (GSTR-9C)',
    category: 'GST',
    entity: 'Turnover > ₹2 Cr (GSTR-9) & > ₹5 Cr (GSTR-9C Self-Reconciliation)',
    description: 'Consolidated annual return of all monthly/quarterly filings, inward/outward supplies, tax paid, and ITC availed during the financial year.',
    penaltyWarning: 'Late fee of ₹50 to ₹200 per day subject to 0.50% of state turnover.',
    urgency: 'high',
  }
];

export const ComplianceCalendar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return STATUTORY_DEADLINES.filter((ev) => {
      const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
      const matchSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the late fee for delaying GSTR-3B monthly filing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under Section 47 of the CGST Act, a late fee of ₹50 per day (₹25 CGST + ₹25 SGST) is charged for delay. For Nil returns, the late fee is ₹20 per day. Additionally, 18% annual interest applies on the net cash tax liability.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens if a company delays filing MCA Form AOC-4 or MGT-7?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Delay in filing MCA Form AOC-4 or MGT-7 attracts an uncapped late filing fee of ₹100 per day under Section 403 of the Companies Act, 2013, alongside potential prosecution of company directors.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the penalty for missing DIR-3 KYC for DIN holders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If a Director fails to file DIR-3 KYC by the statutory deadline, the Ministry of Corporate Affairs deactivates the DIN. Reactivating the DIN requires payment of a mandatory penalty of ₹5,000 per DIN.'
        }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Statutory Compliance Calendar 2025-2026 for Indian Businesses | SN Associates & Co"
        description="Comprehensive statutory compliance calendar for Indian private limited companies, LLPs, and startups. Track monthly GST, TDS, MCA ROC, Advance Tax, and ITR filing deadlines with penalty guides."
        canonicalUrl="/compliance-calendar"
        keywords={[
          'statutory compliance calendar 2025-26 india',
          'gst due dates monthly',
          'mca aoc 4 mgt 7 due date',
          'tds return filing deadline',
          'dir 3 kyc last date',
          'corporate tax audit due date 44ab'
        ]}
        schemaData={schemaData}
      />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-4">
              <CalendarDays className="w-3.5 h-3.5" />
              Real-Time Statutory Regulatory Tracker (FY 2025-26)
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Indian Business <span className="text-indigo-600">Compliance Calendar</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Never miss a GST, TDS, Income Tax, or MCA ROC statutory deadline. Protect your business from compounding late fees, prosecution, and director disqualification.
            </p>
          </div>

          {/* Quick Stats / Urgency Warning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Risk MCA Late Fee</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">₹100 / Day No Ceiling</div>
                <p className="text-xs text-slate-500 mt-1">
                  Delaying AOC-4 & MGT-7 attracts ₹100/day per form indefinitely under Companies Act 2013.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TDS Delay Interest</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">1.5% Per Month</div>
                <p className="text-xs text-slate-500 mt-1">
                  Late deposit of deducted TDS attracts 1.5%/month penalty + ₹200/day 234E fee.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Peace of Mind</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">Zero-Penalty Guarantee</div>
                <p className="text-xs text-slate-500 mt-1">
                  Our retainer clients enjoy automated e-filing alerts, book reconciliations, and timely filing.
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Due Dates' },
                { id: 'GST', label: 'GST Filings' },
                { id: 'Income Tax & TDS', label: 'Income Tax & TDS' },
                { id: 'MCA & ROC', label: 'MCA & ROC' },
                { id: 'Payroll & Labor', label: 'Payroll (PF/ESI)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search form, tax, or penalty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Deadlines Timeline List */}
          <div className="space-y-4 mb-16">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No matching deadlines found</h3>
                <p className="text-xs text-slate-500 mt-1">Try broadening your search query or selecting a different category.</p>
              </div>
            ) : (
              filteredEvents.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between"
                >
                  {/* Left Date Badge & Title */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center flex-shrink-0 text-indigo-700">
                      <span className="text-xs uppercase font-bold tracking-wider">{item.monthDisplay}</span>
                      <span className="text-2xl font-extrabold leading-none mt-0.5">{item.dayDisplay}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Applicable to: <strong className="text-slate-700">{item.entity}</strong>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span><strong>Late Penalty:</strong> {item.penaltyWarning}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right CTA */}
                  <div className="flex sm:flex-col gap-2 w-full lg:w-auto flex-shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <Link
                      to="/book-consultation"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
                    >
                      File with CA
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/services"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors text-center whitespace-nowrap flex-1 sm:flex-initial"
                    >
                      Learn Checklist
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Email Subscription / Alert Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/50 mb-16 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-400/20">
                <BellRing className="w-3.5 h-3.5" />
                Free Monthly WhatsApp & Email Reminder Dispatch
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Receive Statutory Due Date Alerts 7 Days in Advance
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Join over 2,500+ Indian startup founders and business owners who rely on SN Associates & Co for zero-penalty compliance management.
              </p>

              {subscribed ? (
                <div className="mt-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span><strong>Thank you!</strong> You have been subscribed to our statutory compliance notification desk.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSubscribed(true);
                  }}
                  className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter official email or WhatsApp no."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 whitespace-nowrap"
                  >
                    Subscribe Alerts
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Statutory FAQs Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions on Indian Business Statutory Deadlines
            </h2>

            <div className="space-y-6 text-sm">
              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  What happens if I delay GSTR-3B monthly filing?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Under Section 47 of the CGST Act, a late fee of ₹50 per day (₹25 CGST + ₹25 SGST) is charged for delay. For Nil returns, the late fee is ₹20 per day. Additionally, 18% annual interest applies on the net cash tax liability, and e-way bill generation is suspended after 2 consecutive months of non-filing.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  What is the penalty for missing MCA Form AOC-4 or MGT-7 annual ROC filings?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Delay in filing MCA Form AOC-4 (Financial Statements) or MGT-7/7A (Annual Return) attracts an uncapped late filing fee of ₹100 per day per form under Section 403 of the Companies Act, 2013. If neglected for two years, the ROC may initiate strike-off proceedings and disqualify directors under Section 164(2).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Can small businesses opt for quarterly filing instead of monthly GST?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes, registered taxpayers with an aggregate annual turnover of up to ₹5 Crores can opt for the QRMP (Quarterly Return Monthly Payment) scheme. Under QRMP, GSTR-1 and GSTR-3B are filed once every quarter, while tax payments are made monthly using PMT-06 challans.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ComplianceCalendar;
