
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  CreditCard, 
  CheckCircle, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  Info,
  GraduationCap
} from 'lucide-react';
import { formDb } from '../services/localDb';
import { toast } from 'react-hot-toast';

const Enrollment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  
  // Program Details from URL
  const programName = searchParams.get('program') || '30-Day Intensive';
  const programPrice = Number(searchParams.get('price')) || 1500;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeProfession: '',
  });

  // Razorpay Simulation State
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const processPayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = `pay_enroll_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to database
      await formDb.submitEnrollment({
        ...formData,
        program: programName,
        price: programPrice,
        payment_status: 'success',
        payment_id: paymentId
      });

      setPaymentStep('success');
      setTimeout(() => setStep('success'), 1000);
      toast.success("Enrollment Successful!");
    } catch (error) {
      toast.error("Failed to process enrollment. Please try again.");
      setPaymentStep('method');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {step !== 'success' && (
          <div className="mb-8 flex items-center justify-between">
            <Link to="/snac-academy" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition">
              <ChevronLeft size={18} /> Back to Academy
            </Link>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-600'}`}>
                {step === 'form' ? '1' : <CheckCircle size={14} />}
              </div>
              <div className="w-8 h-px bg-slate-200"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                2
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          {step === 'form' && (
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Info */}
              <div className="md:w-1/3 bg-slate-900 p-10 text-white">
                <GraduationCap size={40} className="text-blue-400 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Enrollment</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  You are registering for the <span className="text-white font-bold">{programName}</span>. 
                  Please provide accurate details for your certification.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Fee Payable</p>
                    <p className="text-2xl font-black">₹{programPrice}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-green-400" /> Authorized Program
                  </div>
                </div>
              </div>

              {/* Form Area */}
              <div className="md:w-2/3 p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Personal Particulars</h3>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Full Legal Name</label>
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="As per Educational Records" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="primary@email.com" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Phone Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          name="phone" 
                          required 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">College or Profession</label>
                    <div className="relative">
                      <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="collegeProfession" 
                        required 
                        value={formData.collegeProfession}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Com Student, Accountant, etc." 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition transform active:scale-95 flex items-center justify-center gap-2">
                    Proceed to Payment <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-10 flex flex-col items-center justify-center min-h-[500px] bg-slate-50">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                    <div className="bg-[#2b83ea] p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <span className="text-[#2b83ea] font-black text-lg">S</span>
                           </div>
                           <div>
                               <h3 className="font-bold text-sm">SNAC Academy</h3>
                               <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Fee Gateway</p>
                           </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] opacity-80">Payable</div>
                            <div className="font-black text-xl">₹{programPrice}</div>
                        </div>
                    </div>

                    <div className="p-8 bg-white min-h-[300px]">
                        {paymentStep === 'method' && (
                            <div className="space-y-4 animate-fadeIn">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Secured Payment Methods</p>
                                <button onClick={processPayment} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="text-sm font-bold text-slate-700">Card / NetBanking</div>
                                        <div className="text-[10px] text-slate-400">Secure Bank Direct Transfer</div>
                                    </div>
                                </button>
                                <button onClick={processPayment} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Smartphone size={20} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="text-sm font-bold text-slate-700">UPI Payments</div>
                                        <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                                    </div>
                                </button>
                                <button onClick={() => setStep('form')} className="mt-8 w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition">Cancel and Edit Details</button>
                            </div>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                                <h3 className="font-bold text-slate-700">Securing Transaction...</h3>
                                <p className="text-xs text-slate-500 mt-2">Verifying with nodal banks.</p>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="font-bold text-slate-700 text-lg">Fee Received!</h3>
                                <p className="text-xs text-slate-500 mt-2">Redirecting to confirmation.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                         <ShieldCheck size={14} className="text-blue-600" />
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Razorpay Secured Gateway</p>
                    </div>
                </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-20 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Welcome to SNAC Academy</h2>
              <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto">
                Your enrollment for <span className="font-bold text-blue-600">{programName}</span> is complete. Our team will reach out to you within 24 hours with the next steps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="bg-slate-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-black transition shadow-lg">Back to Home</Link>
                <Link to="/snac-academy" className="bg-white border-2 border-slate-200 text-slate-700 font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition">Academy Dashboard</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
