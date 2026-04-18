import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slideUp">
            <div className="max-w-6xl mx-auto bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                <div className="bg-blue-600/20 p-3 rounded-full shrink-0">
                    <Cookie className="text-blue-400" size={24} />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-white font-bold mb-1">We value your privacy</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                        <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 ml-1 underline decoration-blue-400/30 underline-offset-2">Read our Privacy Policy</Link>.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* 
            <button 
                onClick={handleDecline}
                className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
                Decline
            </button> 
            */}
                    <button
                        onClick={handleAccept}
                        className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={handleDecline}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
