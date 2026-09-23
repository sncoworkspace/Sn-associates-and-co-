import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { 
  Calculator, Receipt, ArrowRight, CheckCircle2, 
  HelpCircle, RefreshCw, Copy, Check, Phone, MessageSquare
} from 'lucide-react';

export const GstCalculatorPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const rates = [0, 5, 12, 18, 28];

  const calc = useMemo(() => {
    const rawAmt = Math.max(0, amount || 0);
    let net = 0;
    let gst = 0;
    let gross = 0;

    if (isInclusive) {
      gross = rawAmt;
      net = gross / (1 + rate / 100);
      gst = gross - net;
    } else {
      net = rawAmt;
      gst = (net * rate) / 100;
      gross = net + gst;
    }

    const cgst = isInterState ? 0 : gst / 2;
    const sgst = isInterState ? 0 : gst / 2;
    const igst = isInterState ? gst : 0;

    return {
      net: Math.round(net * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      gross: Math.round(gross * 100) / 100
    };
  }, [amount, rate, isInclusive, isInterState]);

  const copyBreakdown = () => {
    const text = `GST Calculation Breakdown:
Base Net Amount: ₹${calc.net.toLocaleString('en-IN')}
GST Rate: ${rate}% (${isInclusive ? 'Inclusive' : 'Exclusive'})
Total GST: ₹${calc.gst.toLocaleString('en-IN')}
${isInterState ? `IGST: ₹${calc.igst.toLocaleString('en-IN')}` : `CGST: ₹${calc.cgst.toLocaleString('en-IN')} | SGST: ₹${calc.sgst.toLocaleString('en-IN')}`}
Total Gross Amount: ₹${calc.gross.toLocaleString('en-IN')}
Calculated via SN Associates & Co (https://snassociatesandco.com/tools/gst-calculator)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="GST Calculator India 2025 | Inclusive & Exclusive Tax Calculator"
        description="Free, accurate GST Calculator for Indian businesses. Calculate GST Exclusive & GST Inclusive amounts, CGST, SGST, and IGST breakdowns across 5%, 12%, 18%, and 28% slabs."
        canonicalUrl="/tools/gst-calculator"
        keywords={[
          'GST Calculator India',
          'Calculate GST Online',
          'GST Inclusive Calculator',
          'GST Exclusive Calculator',
          'CGST SGST IGST Calculator',
          'Reverse GST Calculator'
        ]}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Calculator size={14} /> Free Financial Utility
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Online <span className="text-blue-400">GST Calculator</span> India
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto">
            Instantly compute forward or reverse GST with complete CGST, SGST, and IGST splits across all standard statutory tax brackets.
          </p>
        </div>
      </section>

      {/* Interactive Tool Card */}
      <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                  <input
                    id="gst-amount-input"
                    name="gstAmount"
                    aria-label="Enter invoice amount in rupees"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Slabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  GST Tax Rate Slab
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {rates.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRate(r)}
                      className={`py-3 rounded-xl font-black text-sm transition-all ${
                        rate === r 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Calculation Mode
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setIsInclusive(false)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        !isInclusive ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      GST Exclusive (+ Tax)
                    </button>
                    <button
                      onClick={() => setIsInclusive(true)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        isInclusive ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      GST Inclusive (- Tax)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Supply Nature
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setIsInterState(false)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        !isInterState ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Intra-State (CGST+SGST)
                    </button>
                    <button
                      onClick={() => setIsInterState(true)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        isInterState ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Inter-State (IGST)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Column */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 md:p-8 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Calculation Results</span>
                  <button
                    onClick={copyBreakdown}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-all"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Base Net Amount:</span>
                    <span className="font-bold text-white text-base">₹{calc.net.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Total GST ({rate}%):</span>
                    <span className="font-bold text-amber-400 text-base">₹{calc.gst.toLocaleString('en-IN')}</span>
                  </div>

                  {!isInterState ? (
                    <>
                      <div className="flex justify-between items-center text-xs text-slate-400 pl-3 border-l-2 border-blue-500">
                        <span>CGST ({(rate / 2)}%):</span>
                        <span>₹{calc.cgst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400 pl-3 border-l-2 border-blue-500">
                        <span>SGST ({(rate / 2)}%):</span>
                        <span>₹{calc.sgst.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-xs text-slate-400 pl-3 border-l-2 border-indigo-500">
                      <span>IGST ({rate}%):</span>
                      <span>₹{calc.igst.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold text-slate-200">Total Invoice Amount:</span>
                    <span className="text-2xl font-black text-emerald-400">₹{calc.gross.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  to="/services/gst-registration-filing"
                  className="w-full block text-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Need Assistance with GST Filing?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slab Reference Table */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">GST Rate Slab Guide for Goods & Services</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-600">
              <tr>
                <th className="p-4">GST Rate</th>
                <th className="p-4">Key Applicable Goods</th>
                <th className="p-4">Key Applicable Services</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 font-bold text-blue-600">0% (Nil)</td>
                <td className="p-4">Fresh vegetables, unbranded grains, milk, salt</td>
                <td className="p-4">Education services, basic healthcare</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-blue-600">5%</td>
                <td className="p-4">Packaged food items, medicines, apparel under ₹1000</td>
                <td className="p-4">Transport services (rail, air economy), small restaurants</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-blue-600">12%</td>
                <td className="p-4">Processed foods, computers, business books</td>
                <td className="p-4">State lottery tickets, non-AC hotel rooms</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-blue-600">18%</td>
                <td className="p-4">Capital goods, industrial machinery, software</td>
                <td className="p-4">IT services, Chartered Accountant fees, telecom, hotels</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-blue-600">28%</td>
                <td className="p-4">Automobiles, luxury items, aerated drinks</td>
                <td className="p-4">5-star luxury accommodation, racing events</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default GstCalculatorPage;