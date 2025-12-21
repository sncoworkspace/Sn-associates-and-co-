
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, User as UserIcon, Phone, KeyRound, ArrowLeft, CheckCircle, ShieldCheck, Info } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Modes: 'login-email', 'login-phone', 'signup', 'forgot-password'
  const [mode, setMode] = useState<'login-email' | 'login-phone' | 'signup' | 'forgot-password'>('login-email');
  
  const [error, setError] = useState<string | null>(null);

  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  const isCheckoutFlow = searchParams.get('flow') === 'checkout';

  useEffect(() => {
    // If already logged in, redirect
    if (authService.getCurrentUser()) {
      navigate('/my-learning');
    }
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Artificial delay for realism
    setTimeout(() => {
        const result = authService.login(email, password);
        setLoading(false);
        
        if (result.success) {
            toast.success("Welcome back, " + result.user?.name);
            handleSuccess(result.user?.role === 'admin');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    }, 800);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await authService.loginWithGoogle();
      if (result.success) {
        toast.success("Authenticated via Google");
        handleSuccess(result.user?.role === 'admin');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("Google connection failed. Please try again.");
      toast.error("Social login failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }

    setLoading(true);
    setTimeout(() => {
        const result = authService.register(name, email, password, phone);
        setLoading(false);

        if (result.success) {
            toast.success("Account created successfully!");
            handleSuccess();
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    }, 1200);
  };

  const handleSendOtp = async () => {
      if (phone.length < 10) {
          setError("Please enter a valid 10-digit phone number");
          return;
      }
      setLoading(true);
      const code = await authService.sendOTP(phone);
      setGeneratedOtp(code);
      setLoading(false);
      toast.success("OTP sent successfully");
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (otp !== generatedOtp) {
          setError("The OTP entered is incorrect");
          toast.error("Verification failed");
          return;
      }
      
      const result = authService.loginWithOTP(phone);
      if (result.success) {
          toast.success("Logged in successfully");
          handleSuccess();
      } else {
          setError(result.message);
          toast.error(result.message);
      }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await authService.resetPassword(email);
      setLoading(false);
      toast.success("Recovery link sent to " + email);
      setMode('login-email');
  };

  const handleSuccess = (isAdmin = false) => {
      if (isAdmin) {
          navigate('/admin');
      } else if (isCheckoutFlow) {
          navigate('/checkout');
      } else {
          navigate('/my-learning');
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200/60 relative z-10 flex flex-col">
        
        {/* Brand Header */}
        <div className="bg-slate-900 p-8 text-center border-b border-slate-800">
          <Link to="/" className="inline-block mb-4">
             <img src="https://image2url.com/images/1764921906714-ca9522a0-9679-4611-822e-55e3ef363a5a.png" alt="SNA" className="h-12 w-auto mx-auto brightness-0 invert" />
          </Link>
          <h1 className="text-white font-bold text-xl tracking-tight">SN Associates & Co.</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Client Access Portal</p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          {mode !== 'forgot-password' && (
              <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                  <button 
                      onClick={() => { setMode('login-email'); setError(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode.startsWith('login') ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      Sign In
                  </button>
                  <button 
                      onClick={() => { setMode('signup'); setError(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      Create Account
                  </button>
              </div>
          )}

          {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-xl mb-6 font-bold border border-red-100 flex items-center gap-2 animate-fadeIn">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                  {error}
              </div>
          )}

          {/* --- SOCIAL SIGN IN (GOOGLE) --- */}
          {(mode === 'login-email' || mode === 'signup') && (
            <div className="space-y-4 mb-6">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin text-blue-600" size={20} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.705A5.41 5.41 0 0 1 3.682 9c0-.591.101-1.17.282-1.705V4.963H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.963L3.964 7.295C4.672 5.168 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                )}
                <span className="text-sm">{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
              </button>
              
              <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400"><span className="bg-white px-3">or credentials</span></div>
              </div>
            </div>
          )}

          {/* --- EMAIL LOGIN FORM --- */}
          {mode === 'login-email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Email Address</label>
                      <div className="relative group">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@company.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                          <button type="button" onClick={() => setMode('forgot-password')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Forgot?</button>
                      </div>
                      <div className="relative group">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>
                  </div>
                  
                  <button disabled={loading || googleLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2 mt-6 active:scale-[0.98]">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                  </button>

                  <div className="pt-4 text-center">
                      <button type="button" onClick={() => setMode('login-phone')} className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                          <Phone size={12} /> Alternative: Phone OTP Login
                      </button>
                  </div>
              </form>
          )}

          {/* --- PHONE OTP LOGIN FORM --- */}
          {mode === 'login-phone' && (
              <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Mobile Number</label>
                      <div className="relative group">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10 Digit Number" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" disabled={!!generatedOtp} />
                      </div>
                  </div>
                  
                  {generatedOtp && (
                      <div className="space-y-1.5 animate-fadeIn">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Verification Code</label>
                          <div className="relative group">
                              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="4 Digit OTP" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm tracking-widest" />
                          </div>
                      </div>
                  )}

                  <div className="flex flex-col gap-3">
                      {!generatedOtp ? (
                          <button onClick={handleSendOtp} disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition flex justify-center items-center">
                              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send SMS Code"}
                          </button>
                      ) : (
                          <button onClick={handleOtpLogin} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-green-700 transition">
                              Verify & Sign In
                          </button>
                      )}
                      
                      <button onClick={() => { setMode('login-email'); setGeneratedOtp(null); setOtp(''); }} className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest pt-2">
                          <ArrowLeft size={10} /> Back to email
                      </button>
                  </div>
              </div>
          )}

          {/* --- SIGN UP FORM --- */}
          {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Full Legal Name</label>
                      <div className="relative group">
                          <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="As per PAN / Aadhaar" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm" />
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Work Email</label>
                      <div className="relative group">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm" />
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Set Password</label>
                      <div className="relative group">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm" />
                      </div>
                  </div>
                  
                  <button disabled={loading || googleLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition mt-4 active:scale-[0.98]">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Private Account"}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4 px-4">
                      By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                  </p>
              </form>
          )}

          {/* --- FORGOT PASSWORD --- */}
          {mode === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-5 animate-fadeIn">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <Info className="text-blue-500 shrink-0" size={18} />
                      <p className="text-xs text-blue-700 leading-relaxed">
                          Enter your registered email. If an account exists, we'll send a secure link to reset your credentials.
                      </p>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
                      <div className="relative group">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Recover your account" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm" />
                      </div>
                  </div>
                  <div className="flex flex-col gap-3">
                      <button disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg transition flex justify-center items-center">
                          {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Recovery Link"}
                      </button>
                      <button type="button" onClick={() => setMode('login-email')} className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest pt-2">
                          <ArrowLeft size={10} /> Back to Sign In
                      </button>
                  </div>
              </form>
          )}
        </div>

        {/* Trust Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
           <p className="text-[9px] text-slate-400 text-center max-w-[200px]">
              Secure connection verified by SN Associates & Co. Infrastructure.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
