import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, MessageCircle, Phone, Mail } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
  const isServicesActive = location.pathname.startsWith('/services');
  const isContactActive = location.pathname === '/contact' || location.pathname === '/book-consultation';

  const phoneNumber = '917406581456';
  const whatsappMessage = encodeURIComponent('Hello SN Associates & Co, I would like to consult regarding statutory tax and business compliance.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHomeActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home size={20} className={isHomeActive ? 'stroke-[2.5]' : 'stroke-2'} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </Link>

        {/* 2. Services */}
        <Link
          to="/services"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isServicesActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Briefcase size={20} className={isServicesActive ? 'stroke-[2.5]' : 'stroke-2 text-amber-600'} />
            {isServicesActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Services</span>
        </Link>

        {/* 3. WhatsApp (Direct Chat) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-emerald-600 hover:text-emerald-700 transition-colors"
          title="Chat on WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition-transform">
            <MessageCircle size={18} fill="white" className="text-emerald-500" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-emerald-600">WhatsApp</span>
        </a>

        {/* 4. Call (Direct Dial) */}
        <a
          href="tel:+917406581456"
          className="flex flex-col items-center justify-center py-1 text-amber-700 hover:text-amber-800 transition-colors"
          title="Call SN Associates & Co"
        >
          <div className="relative">
            <Phone size={20} className="stroke-[2.2] text-amber-600" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium text-amber-700">Call</span>
        </a>

        {/* 5. Contact */}
        <Link
          to="/contact"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isContactActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Mail size={20} className={isContactActive ? 'stroke-[2.5]' : 'stroke-2 text-blue-500'} />
            {isContactActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Contact</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
