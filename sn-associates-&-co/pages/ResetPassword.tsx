
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully!");
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-400 flex items-center justify-center p-4 py-20 relative">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-300 relative z-10 flex flex-col">
                <div className="bg-white px-10 py-16 text-center relative border-b border-slate-100">
                    <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-500 ease-out">
                        <img
                            src="/logo.png"
                            alt="SN Associates & Co Logo"
                            className="h-28 w-auto mx-auto object-contain"
                        />
                    </Link>
                    <h1 className="text-slate-900 font-serif font-bold text-2xl tracking-tighter uppercase mb-2">Reset Password</h1>
                    <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black opacity-80">Establish New Credentials</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleReset} className="space-y-5 animate-fadeIn">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl transition-all mt-4 active:scale-[0.98]">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Update Password"}
                        </button>
                    </form>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600/50" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Credential Update</span>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
