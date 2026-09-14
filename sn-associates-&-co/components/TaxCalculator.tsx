import React, { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, HelpCircle, PhoneCall, TrendingUp, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TaxCalculator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(50000);
  const [nps80CCD, setNps80CCD] = useState<number>(50000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);

  // Quick preset incomes
  const incomePresets = [
    { label: '₹7.5 Lakhs', val: 750000 },
    { label: '₹12 Lakhs', val: 1200000 },
    { label: '₹18 Lakhs', val: 1800000 },
    { label: '₹25 Lakhs', val: 2500000 },
    { label: '₹50 Lakhs', val: 5000000 },
  ];

  const taxCalculation = useMemo(() => {
    // 1. NEW REGIME (FY 2024-25 / FY 2025-26 - Budget 2024 revisions)
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossIncome - newStdDeduction);
    let newTax = 0;

    if (newTaxableIncome <= 700000) {
      // 87A rebate makes tax 0 for taxable income <= 7L
      newTax = 0;
    } else {
      let rem = newTaxableIncome;
      // 0 - 3L: Nil
      rem = Math.max(0, rem - 300000);
      // 3L - 7L: 5%
      const slab1 = Math.min(rem, 400000);
      newTax += slab1 * 0.05;
      rem -= slab1;
      // 7L - 10L: 10%
      const slab2 = Math.min(rem, 300000);
      newTax += slab2 * 0.10;
      rem -= slab2;
      // 10L - 12L: 15%
      const slab3 = Math.min(rem, 200000);
      newTax += slab3 * 0.15;
      rem -= slab3;
      // 12L - 15L: 20%
      const slab4 = Math.min(rem, 300000);
      newTax += slab4 * 0.20;
      rem -= slab4;
      // Above 15L: 30%
      if (rem > 0) {
        newTax += rem * 0.30;
      }
    }
    // 4% Cess
    const newTotalTax = Math.round(newTax * 1.04);

    // 2. OLD REGIME
    const oldStdDeduction = 50000;
    const capped80C = Math.min(150000, section80C);
    const capped80D = Math.min(100000, section80D);
    const cappedNPS = Math.min(50000, nps80CCD);
    const cappedHomeLoan = Math.min(200000, homeLoanInterest);

    const totalOldDeductions = oldStdDeduction + capped80C + capped80D + hraExemption + cappedNPS + cappedHomeLoan;
    const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);
    let oldTax = 0;

    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    } else {
      let rem = oldTaxableIncome;
      // 0 - 2.5L: Nil
      rem = Math.max(0, rem - 250000);
      // 2.5L - 5L: 5%
      const slab1 = Math.min(rem, 250000);
      oldTax += slab1 * 0.05;
      rem -= slab1;
      // 5L - 10L: 20%
      const slab2 = Math.min(rem, 500000);
      oldTax += slab2 * 0.20;
      rem -= slab2;
      // Above 10L: 30%
      if (rem > 0) {
        oldTax += rem * 0.30;
      }
    }
    const oldTotalTax = Math.round(oldTax * 1.04);

    const savings = Math.abs(oldTotalTax - newTotalTax);
    const betterRegime = newTotalTax <= oldTotalTax ? 'NEW' : 'OLD';

    return {
      newTaxableIncome,
      newTotalTax,
      newMonthlyInHand: Math.round((grossIncome - newTotalTax) / 12),
      oldTaxableIncome,
      oldTotalTax,
      oldMonthlyInHand: Math.round((grossIncome - oldTotalTax) / 12),
      savings,
      betterRegime,
      totalOldDeductions
    };
  }, [grossIncome, section80C, section80D, hraExemption, nps80CCD, homeLoanInterest]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/20">
            <Sparkles size={14} /> Free Financial Utility
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
            Income Tax Calculator <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">(New vs Old Regime)</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Updated with Budget 2024 revisions: Standard deduction ₹75,000 & ₹7.75 Lakhs zero-tax benefit under New Regime.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Verified by SN Associates CAs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Input Controls (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gross Annual Income */}
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-200">Annual Gross Income (CTC / Turnover)</label>
              <span className="text-lg font-bold text-blue-400 font-mono">{formatINR(grossIncome)}</span>
            </div>
            <input
              type="range"
              min={300000}
              max={10000000}
              step={50000}
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {incomePresets.map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setGrossIncome(preset.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    grossIncome === preset.val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deductions Accordion / Section */}
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Deductions & Exemptions</span>
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-medium">For Old Regime Only</span>
              </h4>
              <span className="text-xs text-slate-400">Total: {formatINR(taxCalculation.totalOldDeductions)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* 80C */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Sec 80C (EPF/ELSS/PPF)</span>
                  <span className="text-slate-400">{formatINR(section80C)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={150000}
                  step={10000}
                  value={section80C}
                  onChange={(e) => setSection80C(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* 80D */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Sec 80D (Health Insurance)</span>
                  <span className="text-slate-400">{formatINR(section80D)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100000}
                  step={5000}
                  value={section80D}
                  onChange={(e) => setSection80D(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* HRA */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">HRA Exemption (Rent Paid)</span>
                  <span className="text-slate-400">{formatINR(hraExemption)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={10000}
                  value={hraExemption}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* NPS 80CCD */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">NPS 80CCD (1B)</span>
                  <span className="text-slate-400">{formatINR(nps80CCD)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={5000}
                  value={nps80CCD}
                  onChange={(e) => setNps80CCD(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results & Comparison (Right Column) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 rounded-2xl p-5 text-center shadow-lg">
            <span className="text-emerald-400 text-[11px] font-black uppercase tracking-wider block mb-1">Recommended Choice</span>
            <div className="text-xl md:text-2xl font-bold text-white">
              {taxCalculation.betterRegime === 'NEW' ? 'New Tax Regime is Better!' : 'Old Tax Regime is Better!'}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              You save <span className="text-emerald-400 font-bold">{formatINR(taxCalculation.savings)}</span> in annual taxes.
            </p>
          </div>

          {/* Cards Comparison Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* New Regime Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              taxCalculation.betterRegime === 'NEW' 
                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">New Regime</span>
                {taxCalculation.betterRegime === 'NEW' && (
                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">WINNER</span>
                )}
              </div>
              <div className="text-xs text-slate-400">Total Tax Payable:</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {formatINR(taxCalculation.newTotalTax)}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                Monthly In-Hand: <br />
                <span className="text-emerald-400 font-semibold">{formatINR(taxCalculation.newMonthlyInHand)}</span>
              </div>
            </div>

            {/* Old Regime Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              taxCalculation.betterRegime === 'OLD' 
                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'bg-slate-800/40 border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Old Regime</span>
                {taxCalculation.betterRegime === 'OLD' && (
                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">WINNER</span>
                )}
              </div>
              <div className="text-xs text-slate-400">Total Tax Payable:</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {formatINR(taxCalculation.oldTotalTax)}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                Monthly In-Hand: <br />
                <span className="text-emerald-400 font-semibold">{formatINR(taxCalculation.oldMonthlyInHand)}</span>
              </div>
            </div>
          </div>

          {/* High Conversion CTA Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 mt-auto">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Save Up to 30% More With Expert CA Planning</h5>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Our Chartered Accountants review salary structures, business expenses, and capital gains exemptions.
                </p>
              </div>
            </div>

            <Link
              to="/book-consultation?service=Tax%20Planning%20and%20ITR%20Filing"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Book Free 15-Min Tax Review</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
