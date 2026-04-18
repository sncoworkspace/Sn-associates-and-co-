
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, User as UserIcon, Phone, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const isCheckoutFlow = searchParams.get('flow') === 'checkout';

    useEffect(() => {
        if (authService.getCurrentUser()) {
            navigate(authService.getCurrentUser()?.role === 'admin' ? '/admin' : '/my-learning');
        }
    }, [navigate]);

    const handleSuccess = (isAdmin = false) => {
        if (isAdmin) {
            navigate('/admin');
        } else if (isCheckoutFlow) {
            navigate('/checkout');
        } else {
            navigate('/my-learning');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await authService.login(email, password);
            setLoading(false);

            if (result.success) {
                toast.success("Welcome, " + (result.user?.name || 'User'));
                handleSuccess(result.user?.role === 'admin');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setLoading(false);
            setError("Connection failed. Please try again.");
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await authService.resetPassword(email);
            setLoading(false);
            if (result.success) {
                toast.success("Recovery link sent! Please check your email.");
                setMode('login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setLoading(false);
            setError("Failed to send recovery link.");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const result = await authService.register(name, email, password, phone);
            setLoading(false);

            if (result.success) {
                toast.success("Account created! Please check your email.");
                setMode('login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setLoading(false);
            setError("Registration failed.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await authService.signInWithGoogle();
            // Redirect happens automatically
        } catch (err: any) {
            setLoading(false);
            setError("Google induction failed: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-400 flex items-center justify-center p-4 py-20 relative">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-300 relative z-10 flex flex-col">

                {/* White Header for Perfect Logo Visibility (Matches Navbar) */}
                <div className="bg-white px-10 py-16 text-center relative border-b border-slate-100">
                    <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-500 ease-out">
                        <img
                            src="https://image2url.com/images/1764921906714-ca9522a0-9679-4611-822e-55e3ef363a5a.png"
                            alt="Logo"
                            className="h-32 w-auto mx-auto object-contain"
                        />
                    </Link>
                    <h1 className="text-slate-900 font-serif font-bold text-2xl tracking-tighter uppercase mb-2">SN ASSOCIATES & CO.</h1>
                    <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black opacity-80">Professional Access Portal</p>
                </div>

                <div className="p-8">
                    {/* Navigation Tabs - Always visible for better UX */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200">
                        <button
                            onClick={() => { setMode('login'); setError(null); }}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' || mode === 'forgot-password' ? 'bg-white text-blue-700 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); }}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-blue-700 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-[11px] p-4 rounded-xl mb-6 font-bold border border-red-100 animate-fadeIn">
                            {error}
                        </div>
                    )}

                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-5 animate-fadeIn">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@email.com" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-11 pr-11 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98] group">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        Authorize & Sign In
                                        <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center mt-6">
                                <button type="button" onClick={() => setMode('forgot-password')} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em]">Recover Account</button>
                            </p>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-white px-4 text-slate-300">Or Continue With</span></div>
                            </div>

                            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs py-4 rounded-2xl border border-slate-200 shadow-sm transition-all flex justify-center items-center gap-3 active:scale-[0.98]">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Identity Authentication via Google
                            </button>
                        </form>
                    )}

                    {mode === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-5 animate-fadeIn">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="As per Identity Records" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@email.com" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" className="w-full pl-11 pr-11 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl transition-all mt-4 active:scale-[0.98]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Establish Profile"}
                            </button>
                        </form>
                    )}

                    {mode === 'forgot-password' && (
                        <form onSubmit={handleForgotPassword} className="space-y-6 animate-fadeIn text-center">
                            <h3 className="font-bold text-slate-800 text-lg">Account Recovery</h3>
                            <p className="text-xs text-slate-500 leading-relaxed px-4">Provide your registered email address and we will dispatch a secure authentication link for password reset.</p>
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="primary@email.com" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm" />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Send Reset Token"}
                            </button>
                            <button type="button" onClick={() => setMode('login')} className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase tracking-[0.2em] mx-auto mt-6 transition-colors">
                                <ArrowLeft size={12} /> Return to Portal
                            </button>
                        </form>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600/50" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure AES-256 Encrypted Session</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
