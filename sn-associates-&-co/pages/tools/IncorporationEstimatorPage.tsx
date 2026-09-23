import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calculator, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Award, 
  FileText, 
  Users, 
  IndianRupee,
  Share2
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

interface StateDuty {
  name: string;
  code: string;
  baseMoaAoaStamp: number;
  perLakhAboveTen: number;
  avgTimelineDays: number;
}

const STATE_DUTY_RATES: Record<string, StateDuty> = {
  karnataka: { name: 'Karnataka (Bangalore)', code: 'KA', baseMoaAoaStamp: 1000, perLakhAboveTen: 100, avgTimelineDays: 5 },
  maharashtra: { name: 'Maharashtra (Mumbai/Pune)', code: 'MH', baseMoaAoaStamp: 2000, perLakhAboveTen: 150, avgTimelineDays: 6 },
  delhi: { name: 'Delhi / NCR', code: 'DL', baseMoaAoaStamp: 700, perLakhAboveTen: 50, avgTimelineDays: 4 },
  tamilnadu: { name: 'Tamil Nadu (Chennai)', code: 'TN', baseMoaAoaStamp: 1200, perLakhAboveTen: 100, avgTimelineDays: 5 },
  telangana: { name: 'Telangana (Hyderabad)', code: 'TS', baseMoaAoaStamp: 1100, perLakhAboveTen: 80, avgTimelineDays: 5 },
  gujarat: { name: 'Gujarat (Ahmedabad)', code: 'GJ', baseMoaAoaStamp: 1000, perLakhAboveTen: 75, avgTimelineDays: 5 },
  up: { name: 'Uttar Pradesh (Noida/Lucknow)', code: 'UP', baseMoaAoaStamp: 1500, perLakhAboveTen: 100, avgTimelineDays: 6 },
  other: { name: 'Other Indian States / UTs', code: 'OT', baseMoaAoaStamp: 1000, perLakhAboveTen: 100, avgTimelineDays: 7 },
};

export const IncorporationEstimatorPage: React.FC = () => {
  const [entityType, setEntityType] = useState<'pvt_ltd' | 'llp' | 'opc' | 'section8'>('pvt_ltd');
  const [selectedState, setSelectedState] = useState<string>('karnataka');
  const [capitalLakhs, setCapitalLakhs] = useState<number>(1);
  const [directorsCount, setDirectorsCount] = useState<number>(2);
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [includeTrademark, setIncludeTrademark] = useState<boolean>(false);
  const [includeStartupIndia, setIncludeStartupIndia] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const stateData = STATE_DUTY_RATES[selectedState] || STATE_DUTY_RATES.karnataka;

  const calculation = useMemo(() => {
    // 1. MCA ROC Government Fee
    // Zero ROC filing fee for authorized capital up to Rs 15 Lakhs for Pvt Ltd / OPC
    let mcaFee = 0;
    if (entityType === 'pvt_ltd' || entityType === 'opc') {
      if (capitalLakhs > 15) {
        mcaFee = (capitalLakhs - 15) * 400 + 1000;
      } else {
        mcaFee = 0;
      }
    } else if (entityType === 'llp') {
      mcaFee = capitalLakhs <= 1 ? 500 : capitalLakhs <= 5 ? 2000 : 4000;
    } else if (entityType === 'section8') {
      mcaFee = 2000;
    }

    // 2. State Stamp Duty
    let stampDuty = stateData.baseMoaAoaStamp;
    if (capitalLakhs > 10) {
      stampDuty += (capitalLakhs - 10) * stateData.perLakhAboveTen;
    }

    // 3. Class 3 DSC with token
    const dscCost = directorsCount * 999;

    // 4. Name Approval
    const nameApprovalFee = 0;

    // 5. CA/CS Drafting & SPICe+ Professional Liaison
    let professionalFee = 3999;
    if (entityType === 'llp') professionalFee = 3499;
    if (entityType === 'opc') professionalFee = 2999;
    if (entityType === 'section8') professionalFee = 7999;

    // 6. Optional Add-ons
    const gstCost = includeGst ? 1499 : 0;
    const tmCost = includeTrademark ? 4999 : 0;
    const startupIndiaCost = includeStartupIndia ? 2499 : 0;

    const govtTotal = mcaFee + stampDuty;
    const essentialsTotal = govtTotal + dscCost + professionalFee;
    const addOnsTotal = gstCost + tmCost + startupIndiaCost;
    const grandTotal = essentialsTotal + addOnsTotal;

    const timeline = stateData.avgTimelineDays + (entityType === 'section8' ? 5 : 0);

    return {
      mcaFee,
      stampDuty,
      dscCost,
      nameApprovalFee,
      professionalFee,
      gstCost,
      tmCost,
      startupIndiaCost,
      govtTotal,
      essentialsTotal,
      addOnsTotal,
      grandTotal,
      timeline
    };
  }, [entityType, selectedState, capitalLakhs, directorsCount, includeGst, includeTrademark, includeStartupIndia, stateData]);

  const handleCopySummary = () => {
    const text = `SN Associates & Co - Company Incorporation Cost Estimate
Entity: ${entityType.toUpperCase().replace('_', ' ')}
State: ${stateData.name}
Authorized Capital: ₹${capitalLakhs} Lakhs
Directors / Partners: ${directorsCount}
----------------------------------------
MCA Government ROC Fee: ₹${calculation.mcaFee} (Zero Fee <= ₹15L)
State Stamp Duty: ₹${calculation.stampDuty}
Class 3 DSC (${directorsCount} Nos): ₹${calculation.dscCost}
CA/CS Drafting & SPICe+ Filing: ₹${calculation.professionalFee}
${includeGst ? `GST Registration: ₹${calculation.gstCost}\n` : ''}${includeTrademark ? `Trademark Class Filing: ₹${calculation.tmCost}\n` : ''}${includeStartupIndia ? `DPIIT Recognition: ₹${calculation.startupIndiaCost}\n` : ''}----------------------------------------
Estimated Total: ₹${calculation.grandTotal}
Turnaround: ${calculation.timeline} Business Days
Get started: https://snassociatesandco.com/services/company-registration`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Company Incorporation & Stamp Duty Estimator India',
    operatingSystem: 'Any',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    description: 'Calculate state-wise MCA SPICe+ incorporation costs, stamp duties, DSC fees, and timeline for Private Limited, LLP, and OPC companies in India.'
  };

  return (
    <>
      <SEOHead
        title="Company Registration Cost & Stamp Duty Estimator | SN Associates & Co"
        description="Estimate private limited company, LLP, and OPC incorporation costs, MCA statutory stamp duty across Karnataka, Maharashtra, Delhi, Tamil Nadu, and timeline in India."
        canonicalUrl="/tools/incorporation-estimator"
        keywords={[
          'company registration cost calculator',
          'mca stamp duty karnataka pvt ltd',
          'pvt ltd incorporation fee india',
          'llp registration cost bangalore',
          'mca spice plus zero fee',
          'private limited company setup cost'
        ]}
        schemaData={schemaData}
      />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-4">
              <Calculator className="w-3.5 h-3.5" />
              MCA SPICe+ & State Stamp Duty Engine (FY 2025-26)
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Company Incorporation <span className="text-indigo-600">Cost & Timeline Estimator</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Calculate exact statutory MCA filing fees, state-wise MoA/AoA stamp duties, DSC tokens, and end-to-end chartered accountant setup packages with zero hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Configure Business Parameters
              </h2>

              {/* Entity Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Select Legal Structure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'pvt_ltd', label: 'Private Limited', sub: 'Best for Startups' },
                    { id: 'llp', label: 'LLP', sub: 'Low Compliance' },
                    { id: 'opc', label: 'One Person (OPC)', sub: 'Solo Founder' },
                    { id: 'section8', label: 'Section 8', sub: 'Non-Profit / NGO' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setEntityType(type.id as any);
                        if (type.id === 'opc') setDirectorsCount(1);
                        else if (directorsCount < 2) setDirectorsCount(2);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        entityType === type.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900">{type.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{type.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>State of Registered Office</span>
                  <span className="text-xs font-normal text-slate-500">Dictates MoA/AoA Stamp Duty</span>
                </label>
                <div className="relative">
                  <select
                    id="state-select"
                    name="selectedState"
                    aria-label="Select state of registered office"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Object.entries(STATE_DUTY_RATES).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Authorized Capital Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="capital-range-slider" className="text-sm font-semibold text-slate-800">
                    Authorized Share Capital
                  </label>
                  <span className="text-base font-bold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-lg border border-indigo-100">
                    ₹{capitalLakhs} {capitalLakhs === 1 ? 'Lakh' : 'Lakhs'}
                  </span>
                </div>
                <input
                  id="capital-range-slider"
                  name="capitalLakhs"
                  aria-label="Select authorized share capital in lakhs"
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={capitalLakhs}
                  onChange={(e) => setCapitalLakhs(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-medium">
                  <span>₹1 Lakh (Standard)</span>
                  <span className="text-emerald-600 font-semibold">Zero MCA Fee up to ₹15L</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              {/* Number of Directors / Partners */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Number of Directors / Partners (Each requires Class-3 DSC)
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      disabled={entityType === 'opc' && cnt > 1}
                      onClick={() => setDirectorsCount(cnt)}
                      className={`flex-1 py-2 rounded-xl border text-center font-bold text-sm transition-all ${
                        directorsCount === cnt
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : entityType === 'opc' && cnt > 1
                          ? 'border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
                {entityType === 'opc' && (
                  <p className="text-xs text-amber-700 mt-1.5">
                    * One Person Company requires exactly 1 Director plus 1 nominee.
                  </p>
                )}
              </div>

              {/* Recommended Growth Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">
                  Fast-Track Add-ons (Recommended for Day-1 Operations)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 cursor-pointer transition-all bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        id="addon-gst-checkbox"
                        name="addonGst"
                        type="checkbox"
                        checked={includeGst}
                        onChange={(e) => setIncludeGst(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Goods & Services Tax (GST) Registration</div>
                        <div className="text-xs text-slate-500">Includes ARN generation, bank validation & certificate</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">+₹1,499</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 cursor-pointer transition-all bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        id="addon-startup-checkbox"
                        name="addonStartup"
                        type="checkbox"
                        checked={includeStartupIndia}
                        onChange={(e) => setIncludeStartupIndia(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">DPIIT Startup India Recognition & MSME Udyam</div>
                        <div className="text-xs text-slate-500">Unlocks 3-year 80-IAC tax holiday & tender priority</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">+₹2,499</span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 cursor-pointer transition-all bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        id="addon-trademark-checkbox"
                        name="addonTrademark"
                        type="checkbox"
                        checked={includeTrademark}
                        onChange={(e) => setIncludeTrademark(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Trademark (Brand Name / Logo) - 1 Class</div>
                        <div className="text-xs text-slate-500">Full trademark search, TM-A drafting & MSME 50% fee subsidy</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">+₹4,999</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Cost Breakdown & Output Column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">Estimated Total Cost</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5 flex items-baseline gap-1">
                      <span>₹{calculation.grandTotal.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-normal text-slate-400">all-inclusive</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Est. Timeline</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                      <Clock className="w-3.5 h-3.5" />
                      {calculation.timeline} Days
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-b border-slate-800 pb-5 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      MCA SPICe+ ROC Filing Fee
                      {capitalLakhs <= 15 && entityType === 'pvt_ltd' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">100% Free</span>
                      )}
                    </span>
                    <span className="font-semibold text-white">
                      {calculation.mcaFee === 0 ? '₹0' : `₹${calculation.mcaFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      {stateData.code} State MoA/AoA Stamp Duty
                    </span>
                    <span className="font-semibold text-white">₹{calculation.stampDuty.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      Class-3 DSC + Token ({directorsCount} Director{directorsCount > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold text-white">₹{calculation.dscCost.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      PAN, TAN, DIN & Name Reservation
                    </span>
                    <span className="font-semibold text-emerald-400">Included (Free)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      CA/CS Drafting, Form Filing & Liaison
                    </span>
                    <span className="font-semibold text-white">₹{calculation.professionalFee.toLocaleString('en-IN')}</span>
                  </div>

                  {calculation.addOnsTotal > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <div className="flex justify-between items-center text-indigo-300 font-medium text-xs mb-1">
                        <span>Selected Add-ons (GST, Startup, TM)</span>
                        <span>₹{calculation.addOnsTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Link
                    to="/services/company-registration"
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30 text-sm"
                  >
                    Proceed with Incorporation
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs border border-slate-700"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copied ? 'Copied Breakdown to Clipboard!' : 'Share / Copy Cost Estimate'}
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  SN Associates Guarantee
                </h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>100% Name Approval Guarantee:</strong> Free resubmission if MCA raises a phonetic conflict objection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Zero Hidden Costs:</strong> Covers MCA portal fees, MoA, AoA drafting, and physical DSC crypto USB tokens.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Post-Incorporation Compliance:</strong> Free statutory First Board Meeting resolutions and Auditor Appointment (Form ADT-1) guidance.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Educational Content & Stamp Duty Insights for SEO */}
          <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Understanding Indian Company Incorporation Fees & MCA SPICe+ Rules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  SPICe+ Zero MCA Fee Scheme
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Under the Ministry of Corporate Affairs (MCA) reform, companies incorporated with an authorized capital up to ₹15,00,000 pay ₹0 in government ROC filing fees. Only state stamp duty and DSC charges apply.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  State-Specific Stamp Duty
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Stamp duty is levied by the state where your registered office is situated under the Indian Stamp Act. For example, Karnataka charges ₹1,000 for standard MoA/AoA, whereas Maharashtra charges ₹2,000.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Mandatory Post-Setup Steps
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Within 180 days of incorporation, all companies must file MCA Form INC-20A (Commencement of Business) after depositing share capital into the corporate bank account.
                </p>
              </div>
            </div>

            {/* State Stamp Duty Comparison Table */}
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              State-wise MoA & AoA Stamp Duty Reference (Up to ₹10 Lakhs Capital)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-4">State</th>
                    <th className="py-2.5 px-4">MoA Stamp Duty</th>
                    <th className="py-2.5 px-4">AoA Stamp Duty</th>
                    <th className="py-2.5 px-4">Form SPICe+ Stamp</th>
                    <th className="py-2.5 px-4">Est. ROC Approval Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Karnataka (Bangalore)</td>
                    <td className="py-2.5 px-4">₹500</td>
                    <td className="py-2.5 px-4">₹500</td>
                    <td className="py-2.5 px-4">₹20</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">4 - 5 Days</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Maharashtra (Mumbai/Pune)</td>
                    <td className="py-2.5 px-4">₹1,000</td>
                    <td className="py-2.5 px-4">₹1,000</td>
                    <td className="py-2.5 px-4">₹100</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">5 - 6 Days</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Delhi / NCR</td>
                    <td className="py-2.5 px-4">₹200</td>
                    <td className="py-2.5 px-4">₹500</td>
                    <td className="py-2.5 px-4">₹10</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">3 - 4 Days</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Tamil Nadu (Chennai)</td>
                    <td className="py-2.5 px-4">₹600</td>
                    <td className="py-2.5 px-4">₹600</td>
                    <td className="py-2.5 px-4">₹20</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">5 Days</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Telangana (Hyderabad)</td>
                    <td className="py-2.5 px-4">₹500</td>
                    <td className="py-2.5 px-4">₹600</td>
                    <td className="py-2.5 px-4">₹20</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">4 - 5 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Ready to incorporate your company with zero hassle?</h4>
                <p className="text-slate-500 text-xs mt-0.5">Speak directly with our senior corporate chartered accountants and company secretaries in Bangalore.</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/book-consultation"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  Book Free Discovery Call
                </Link>
                <Link
                  to="/services/company-registration"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  View Full Registration Guide
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default IncorporationEstimatorPage;
