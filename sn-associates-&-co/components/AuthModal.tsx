import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, LogIn, X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    onRegister: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm">
                        <Lock size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Please login or create an account to view your payment history and access your dashboard.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={onLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            <LogIn size={20} />
                            Login to Continue
                        </button>

                        <button
                            onClick={onRegister}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <UserPlus size={20} />
                            Create New Account
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Secure access powered by SN Associates & Co
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
