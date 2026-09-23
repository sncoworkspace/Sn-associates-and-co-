import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Calculator, ArrowRight, CheckCircle2, ShieldCheck, 
  HelpCircle, TrendingDown, DollarSign, Award, Phone, MessageSquare
} from 'lucide-react';

export const IncomeTaxCalculatorPage: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [hra, setHra] = useState<number>(100000);
  const [homeLoanInt, setHomeLoanInt] = useState<number>(0);
  const [nps, setNps] = useState<number>(50000);

  const calc = useMemo(() => {
    const gross = Math.max(0, grossIncome || 0);

    // --- NEW REGIME (FY 2025-26) ---
    const newStdDed = 75000;
    const newTaxable = Math.max(0, gross - newStdDed);
    let newTax = 0;

    if (newTaxable <= 300000) {
      newTax = 0;
    } else if (newTaxable <= 700000) {
      newTax = (newTaxable - 300000) * 0.05;
    } else if (newTaxable <= 1000000) {
      newTax = 20000 + (newTaxable - 700000) * 0.10;
    } else if (newTaxable <= 1200000) {
      newTax = 20000 + 30000 + (newTaxable - 1000000) * 0.15;
    } else if (newTaxable <= 1500000) {
      newTax = 20000 + 30000 + 30000 + (newTaxable - 1200000) * 0.20;
    } else {
      newTax = 20000 + 30000 + 30000 + 60000 + (newTaxable - 1500000) * 0.30;
    }

    // 87A rebate for New Regime if taxable income <= 7,00,000
    if (newTaxable <= 700000) {
      newTax = 0;
    }
    const newCess = newTax * 0.04;
    const newTotal = Math.round(newTax + newCess);

    // --- OLD REGIME ---
    const oldStdDed = 50000;
    const total80C = Math.min(150000, Math.max(0, sec80C || 0));
    const total80D = Math.min(75000, Math.max(0, sec80D || 0));
    const totalHra = Math.max(0, hra || 0);
    const totalHomeLoan = Math.min(200000, Math.max(0, homeLoanInt || 0));
    const totalNps = Math.min(50000, Math.max(0, nps || 0));

    const totalOldDeductions = oldStdDed + total80C + total80D + totalHra + totalHomeLoan + totalNps;
    const oldTaxable = Math.max(0, gross - totalOldDeductions);
    let oldTax = 0;

    if (oldTaxable <= 250000) {
      oldTax = 0;
    } else if (oldTaxable <= 500000) {
      oldTax = (oldTaxable - 250000) * 0.05;
    } else if (oldTaxable <= 1000000) {
      oldTax = 12500 + (oldTaxable - 500000) * 0.20;
    } else {
      oldTax = 12500 + 100000 + (oldTaxable - 1000000) * 0.30;
    }

    // 87A rebate for Old Regime if taxable income <= 5,00,000
    if (oldTaxable <= 500000) {
      oldTax = 0;
    }
    const oldCess = oldTax * 0.04;
    const oldTotal = Math.round(oldTax + oldCess);

    const diff = Math.abs(oldTotal - newTotal);
    const recommended = newTotal <= oldTotal ? 'new' : 'old';

    return {
      gross,
      newStdDed,
      newTaxable,
      newTotal,
      totalOldDeductions,
      oldTaxable,
      oldTotal,
      diff,
      recommended
    };
  }, [grossIncome, sec80C, sec80D, hra, homeLoanInt, nps]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="Income Tax Calculator FY 2025-26 | Old vs New Regime Comparison"
        description="Compare Old vs New Tax Regime for FY 2025-26 (AY 2026-27). Instant tax calculation with standard deduction, Section 80C, 80D, HRA, and home loan interest deductions."
        canonicalUrl="/tools/income-tax-calculator"
        keywords={[
          'Income Tax Calculator FY 2025-26',
          'Old vs New Tax Regime Calculator',
          'Calculate Income Tax India',
          'Budget 2025 Tax Slabs',
          'Section 87A Rebate Calculator',
          'Tax Planning Bangalore CA'
        ]}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Calculator size={14} /> Updated for FY 2025–26 (AY 2026–27)
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Old vs New <span className="text-blue-400">Income Tax Calculator</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Find out which tax regime saves you more money this financial year. Instant side-by-side comparison including deductions and 87A rebates.
          </p>
        </div>
      </section>

      {/* Calculator Body */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Inputs Column */}
            <div className="md:col-span-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                <DollarSign size={18} className="text-blue-600" /> Income & Deduction Inputs
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Gross Annual Income (₹)
                </label>
                <input
                  id="gross-income-input"
                  name="grossIncome"
                  aria-label="Gross Annual Income in Rupees"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Old Regime Deductions
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Section 80C (EPF, PPF, ELSS, Insurance) — Max ₹1.5L
                    </label>
                    <input
                      id="sec-80c-input"
                      name="sec80C"
                      aria-label="Section 80C Deduction"
                      type="number"
                      value={sec80C}
                      onChange={(e) => setSec80C(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Section 80D Health Insurance (Self & Parents) — Up to ₹75K
                    </label>
                    <input
                      id="sec-80d-input"
                      name="sec80D"
                      aria-label="Section 80D Health Insurance Deduction"
                      type="number"
                      value={sec80D}
                      onChange={(e) => setSec80D(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      House Rent Allowance (HRA Exemption)
                    </label>
                    <input
                      id="hra-input"
                      name="hra"
                      aria-label="House Rent Allowance Exemption"
                      type="number"
                      value={hra}
                      onChange={(e) => setHra(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Home Loan Interest u/s 24 — Max ₹2L
                    </label>
                    <input
                      id="home-loan-interest-input"
                      name="homeLoanInterest"
                      aria-label="Home Loan Interest Deduction under Section 24"
                      type="number"
                      value={homeLoanInt}
                      onChange={(e) => setHomeLoanInt(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      NPS Additional Contribution u/s 80CCD(1B) — Max ₹50K
                    </label>
                    <input
                      id="nps-input"
                      name="npsContribution"
                      aria-label="NPS Additional Contribution under Section 80CCD"
                      type="number"
                      value={nps}
                      onChange={(e) => setNps(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Column */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              {/* Recommendation Banner */}
              <div className={`p-5 rounded-2xl border ${
                calc.recommended === 'new' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <Award size={18} className={calc.recommended === 'new' ? 'text-emerald-600' : 'text-blue-600'} />
                  <span>Tax Recommendation</span>
                </div>
                <div className="text-xl font-black">
                  {calc.recommended === 'new' ? 'New Tax Regime is Better!' : 'Old Tax Regime is Better!'}
                </div>
                <p className="text-xs mt-1 leading-relaxed">
                  You save approximately <strong>₹{calc.diff.toLocaleString('en-IN')}</strong> by opting for the {calc.recommended === 'new' ? 'New' : 'Old'} Regime.
                </p>
              </div>

              {/* Side-by-side Table */}
              <div className="grid grid-cols-2 gap-4">
                {/* New Regime Card */}
                <div className={`p-5 rounded-2xl border ${
                  calc.recommended === 'new' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-slate-900">New Regime</span>
                    {calc.recommended === 'new' && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-600 text-white rounded-md">Save ₹{calc.diff.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Std. Deduction:</span>
                      <span className="font-medium text-slate-900">₹{calc.newStdDed.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className="font-medium text-slate-900">₹{calc.newTaxable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Tax:</span>
                      <span className="text-base text-blue-600">₹{calc.newTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Old Regime Card */}
                <div className={`p-5 rounded-2xl border ${
                  calc.recommended === 'old' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-slate-900">Old Regime</span>
                    {calc.recommended === 'old' && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-blue-600 text-white rounded-md">Save ₹{calc.diff.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span className="font-medium text-slate-900">₹{calc.totalOldDeductions.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className="font-medium text-slate-900">₹{calc.oldTaxable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Tax:</span>
                      <span className="text-base text-blue-600">₹{calc.oldTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Link
                  to="/services/income-tax-filing"
                  className="w-full block text-center py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all"
                >
                  File Your ITR with Senior CA
                </Link>
                <a
                  href="https://wa.me/917406581456?text=Hi%20SN%20Associates,%20I%20used%20your%20Tax%20Calculator%20and%20want%20to%20file%20my%20ITR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Discuss Calculation with CA on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IncomeTaxCalculatorPage;