
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Lock, CreditCard, Loader2, ShieldCheck, Check, Smartphone, Info } from 'lucide-react';
import { cartDb, authDb, orderDb } from '../services/localDb';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');
  const [googleLoading, setGoogleLoading] = useState(false);

  const user = authDb.getCurrentUser();

  useEffect(() => {
    const items = cartDb.getCart();
    if (items.length > 0) {
      setCartItems(items);
    } else {
      navigate('/store'); 
    }
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleGoogleQuickLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await authService.loginWithGoogle();
      if (result.success) {
        toast.success("Authenticated as " + result.user.name);
        window.dispatchEvent(new Event("storage"));
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const initiatePayment = () => {
      if (!user) {
          toast.error("Please log in to continue with checkout");
          return;
      }
      setShowRazorpayModal(true);
      setPaymentStep('method');
  };

  const processPayment = () => {
      setPaymentStep('processing');
      setTimeout(() => {
          setPaymentStep('success');
          setTimeout(() => {
             completeOrder();
          }, 1500);
      }, 2000);
  };

  const completeOrder = () => {
      const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
      const newOrder = orderDb.createOrder(user!.id, cartItems, total, paymentId);
      cartDb.clearCart();
      toast.success("Purchase Complete!");
      navigate('/order-success', { state: { order: newOrder } });
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Secure Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
           
           {/* Order Summary */}
           <div className="flex-1 space-y-6">
              {!user && (
                 <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition">
                        <Lock size={120} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Identification Required</h2>
                        <p className="text-blue-100 text-sm mb-6 max-w-sm">
                            To ensure your course access is secured, please identify yourself before payment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleGoogleQuickLogin}
                                disabled={googleLoading}
                                className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition active:scale-95 disabled:opacity-50"
                            >
                                {googleLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <svg width="18" height="18" viewBox="0 0 18 18">
                                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                                        <path d="M3.964 10.705A5.41 5.41 0 0 1 3.682 9c0-.591.101-1.17.282-1.705V4.963H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
                                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.963L3.964 7.295C4.672 5.168 6.656 3.58 9 3.58z" fill="#EA4335"/>
                                    </svg>
                                )}
                                Sign in with Google
                            </button>
                            <button 
                                onClick={() => navigate('/login?flow=checkout')}
                                className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl border border-blue-500 hover:bg-blue-800 transition active:scale-95"
                            >
                                Login with Credentials
                            </button>
                        </div>
                    </div>
                 </div>
              )}

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h2 className="font-bold text-lg mb-4 text-slate-800">Review Items</h2>
                 <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                            <div className="flex-grow">
                                <h3 className="font-bold text-sm text-slate-900 leading-tight">{item.title}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                            </div>
                            <span className="font-bold text-slate-700">₹{item.price}</span>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="font-bold text-lg mb-4 text-slate-800">Billing Address</h2>
                  {user ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Standard Digital License</p>
                      </div>
                  ) : (
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                          <Info size={18} />
                          <p className="text-xs font-medium">Please sign in to confirm your billing details.</p>
                      </div>
                  )}
              </div>
           </div>

           {/* Checkout Sidebar */}
           <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-24">
                 <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Payment Summary</h2>
                 <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Course Value</span>
                        <span>₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                        <span>SNA Discount</span>
                        <span>-₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0) - total}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-900">Total Payable</span>
                        <span className="font-black text-2xl text-blue-700">₹{total}</span>
                    </div>
                 </div>

                 <button 
                    onClick={initiatePayment}
                    disabled={!user}
                    className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-slate-900/10 transition-all flex justify-center items-center gap-2 active:scale-95"
                 >
                    <ShieldCheck size={20} /> Checkout with Razorpay
                 </button>
                 
                 <div className="mt-4 flex items-center justify-center gap-2">
                    <img src="https://image2url.com/images/1764923101234-a1b2c3d4.png" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                    <img src="https://image2url.com/images/1764923105678-b2c3d4e5.png" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                    <img src="https://image2url.com/images/1764923110987-c3d4e5f6.png" alt="UPI" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                 </div>
                 
                 <p className="text-center text-[10px] text-slate-400 mt-6 flex justify-center items-center gap-1">
                    <Lock size={10} /> 256-bit SSL Secure Payment Gateway
                 </p>
              </div>
           </div>
        </div>

        {/* --- RAZORPAY MODAL SIMULATION --- */}
        {showRazorpayModal && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden relative">
                    <div className="bg-[#2b83ea] p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                              <span className="text-[#2b83ea] font-bold text-xs">R</span>
                           </div>
                           <div>
                               <h3 className="font-bold text-sm">SN Associates & Co</h3>
                               <p className="text-[10px] opacity-80">Test Mode</p>
                           </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-80">Amount</div>
                            <div className="font-bold">₹{total}.00</div>
                        </div>
                    </div>

                    <div className="p-6 bg-[#f9f9f9] min-h-[300px]">
                        {paymentStep === 'method' && (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Preferred Payment Methods</p>
                                <button onClick={processPayment} className="w-full bg-white p-3 rounded shadow-sm border border-slate-200 flex items-center gap-3 hover:bg-slate-50 transition">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><CreditCard size={16} className="text-slate-600" /></div>
                                    <div className="text-left flex-1">
                                        <div className="text-sm font-bold text-slate-700">Card</div>
                                        <div className="text-[10px] text-slate-400">Visa, MasterCard, RuPay</div>
                                    </div>
                                </button>
                                <button onClick={processPayment} className="w-full bg-white p-3 rounded shadow-sm border border-slate-200 flex items-center gap-3 hover:bg-slate-50 transition">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><Smartphone size={16} className="text-slate-600" /></div>
                                    <div className="text-left flex-1">
                                        <div className="text-sm font-bold text-slate-700">UPI / QR</div>
                                        <div className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm</div>
                                    </div>
                                </button>
                                <button onClick={() => setShowRazorpayModal(false)} className="mt-6 w-full text-slate-400 text-xs hover:text-red-500 font-bold uppercase tracking-wider">Cancel Payment</button>
                            </div>
                        )}
                        {paymentStep === 'processing' && (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                <h3 className="font-bold text-slate-700">Processing Payment...</h3>
                                <p className="text-xs text-slate-500 mt-2">Connecting with Razorpay servers.</p>
                            </div>
                        )}
                        {paymentStep === 'success' && (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <Check size={32} />
                                </div>
                                <h3 className="font-bold text-slate-700">Payment Successful!</h3>
                                <p className="text-xs text-slate-500 mt-2">Redirecting to order confirmation...</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-2 border-t border-slate-100 text-center">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secured by Razorpay</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
