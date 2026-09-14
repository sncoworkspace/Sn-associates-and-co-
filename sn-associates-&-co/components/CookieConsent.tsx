import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Sliders, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true under DPDP
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        const savedConsent = localStorage.getItem('sn_cookie_consent');
        if (!savedConsent) {
            const timer = setTimeout(() => setIsVisible(true), 1200);
            return () => clearTimeout(timer);
        } else {
            try {
                const parsed = JSON.parse(savedConsent);
                setPreferences({
                    necessary: true,
                    analytics: !!parsed.analytics,
                    marketing: !!parsed.marketing
                });
            } catch {
                // Fallback for legacy string
            }
        }

        // Global event to reopen preferences from footer or profile
        const handleOpenSettings = () => {
            setShowCustomizeModal(true);
            setIsVisible(true);
        };
        window.addEventListener('open-cookie-settings', handleOpenSettings);
        return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
    }, []);

    const savePreferences = (analytics: boolean, marketing: boolean) => {
        const payload: CookiePreferences = {
            necessary: true,
            analytics,
            marketing,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('sn_cookie_consent', JSON.stringify(payload));
        localStorage.setItem('cookieConsent', 'true'); // legacy compatibility
        setPreferences({ necessary: true, analytics, marketing });
        setIsVisible(false);
        setShowCustomizeModal(false);
    };

    const handleAcceptAll = () => {
        savePreferences(true, true);
    };

    const handleRejectNonEssential = () => {
        savePreferences(false, false);
    };

    const handleSaveCustom = () => {
        savePreferences(preferences.analytics, preferences.marketing);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Main Sticky Bottom Notice */}
            <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[100] animate-slideUp">
                <div className="max-w-6xl mx-auto bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-5 text-white">
                    <div className="flex items-start gap-4 text-center lg:text-left">
                        <div className="bg-blue-600/20 text-blue-400 p-3 rounded-2xl shrink-0 hidden sm:flex border border-blue-500/20">
                            <Cookie size={26} />
                        </div>
                        <div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                <h3 className="font-bold text-sm md:text-base">DPDP & Privacy Notice (E-Commerce Rules, 2026)</h3>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    Statutory Compliant
                                </span>
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
                                Under India's Digital Personal Data Protection (DPDP) Act and E-Commerce rules, we give you full control over how your data and cookies are processed. Strictly necessary cookies are required for security and login, while analytics and personalization require your explicit consent.
                                <Link to="/privacy-policy" className="text-blue-400 hover:underline ml-1.5 font-medium">Read Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full lg:w-auto">
                        <button
                            onClick={() => setShowCustomizeModal(true)}
                            className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                            <Sliders size={14} /> Customize
                        </button>
                        <button
                            onClick={handleRejectNonEssential}
                            className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition"
                        >
                            Reject Non-Essential
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition transform active:scale-95"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>

            {/* Granular Preference Customization Modal */}
            {showCustomizeModal && (
                <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <Shield className="text-blue-400" size={22} />
                                <h3 className="font-bold text-base">Cookie & Data Consent Preferences</h3>
                            </div>
                            <button onClick={() => setShowCustomizeModal(false)} className="text-slate-400 hover:text-white p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Category 1: Strictly Necessary */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm text-slate-900">Strictly Necessary Cookies</h4>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Always Active</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Essential for site security, session maintenance, Razorpay payment verification, and client portal authentication. Cannot be disabled.
                                </p>
                            </div>

                            {/* Category 2: Analytics & Performance */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm text-slate-900">Analytics & Performance Cookies</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Enables anonymous telemetry, page load speeds, and error diagnostics to help us improve website reliability for taxpayers and businesses.
                                </p>
                            </div>

                            {/* Category 3: Personalization & Advisory */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm text-slate-900">Personalization & Advisory Cookies</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Remembers your preferred Tax Calculator parameters and provides relevant statutory deadline reminders.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                            >
                                Reject Non-Essential
                            </button>
                            <button
                                onClick={handleSaveCustom}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-md"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
