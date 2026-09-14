
import React, { useState, useEffect } from 'react';
import { NavItem, User } from '../types';
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Youtube, Instagram, ShoppingBag, LogOut, User as UserIcon, ShoppingCart, Shield, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import ChatWidget from './ChatWidget';
import { authDb, cartDb } from '../services/localDb';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'News', path: '/news' },
  { label: 'Store', path: '/store' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const syncState = () => {
    setUser(authDb.getCurrentUser());
    setCartCount(cartDb.getCount());
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    window.addEventListener('cart-updated', syncState);
    return () => {
        window.removeEventListener('storage', syncState);
        window.removeEventListener('cart-updated', syncState);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    authDb.logout();
    syncState();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Unified Fixed Header Assembly - Strict heights and transform: translateZ(0) for stability */}
      <div className="fixed top-0 left-0 right-0 z-[60] shadow-sm transform translate-z-0 transition-none overflow-visible">
        
        {/* Top bar - Fixed height 32px */}
        <div className="bg-slate-900 text-slate-300 text-[10px] md:text-xs h-8 flex items-center px-4 hidden md:flex border-b border-white/5 transition-none">
          <div className="container mx-auto flex justify-between items-center whitespace-nowrap">
            <div className="flex space-x-6">
              <span className="flex items-center gap-2"><Phone size={12} className="text-blue-400" /> +91 7406581456</span>
              <span className="flex items-center gap-2"><Mail size={12} className="text-blue-400" /> snco.workspace@gmail.com</span>
            </div>
            <div className="flex space-x-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-amber-400 font-bold flex items-center gap-1 hover:underline"><Shield size={12} /> Admin Access</Link>
              )}
              <span>Mon - Sat: 9:30 AM - 6:30 PM</span>
            </div>
          </div>
        </div>

        {/* Main Navigation - Fixed height: 64px (mobile) / 64px (desktop) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center transition-none relative">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">
            
            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
               <img 
                 src="/logo.png" 
                 alt="SN Associates & Co" 
                 className="h-8 md:h-10 w-auto object-contain"
               />
               <div className="flex flex-col justify-center">
                 <span className="font-serif font-bold text-base md:text-lg leading-tight text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                   SN ASSOCIATES & CO.
                 </span>
                 <span className="text-[8px] md:text-[10px] text-slate-500 tracking-widest uppercase font-medium hidden sm:block">Tax & Legal Experts</span>
               </div>
            </Link>

            <nav className="hidden xl:flex space-x-1 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs md:text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-slate-100 text-blue-700 font-bold' 
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-3 shrink-0">
               <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {cartCount}
                      </span>
                  )}
               </Link>

               {user && (
                 <Link to="/my-learning" className="hidden md:flex p-2 text-slate-600 hover:text-blue-600 transition" title="Client Dashboard">
                   <LayoutDashboard size={20} />
                 </Link>
               )}

               {user ? (
                 <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm transition-none ${user.role === 'admin' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                      {user.name.charAt(0).toUpperCase()}
                   </div>
                   <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 transition" title="Logout">
                     <LogOut size={18} />
                   </button>
                 </div>
               ) : (
                 <div className="hidden md:flex gap-2 ml-2">
                    <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition border border-slate-200">Log In</Link>
                    <Link to="/login" className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Sign Up</Link>
                 </div>
               )}

              <button 
                className="xl:hidden text-slate-700 p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition ml-1"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-hidden animate-fadeIn xl:hidden z-[70]">
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col gap-2">
                   {user ? (
                      <>
                        <Link to="/my-learning" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold text-blue-700 bg-blue-50 rounded-lg flex items-center gap-2">
                          <LayoutDashboard size={18} /> Client Dashboard
                        </Link>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="px-4 py-3 font-bold text-red-600 text-left hover:bg-red-50 rounded-lg">Log Out</button>
                      </>
                   ) : (
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Log In / Sign Up</Link>
                   )}
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Content Spacer - Precisely tuned for Top Bar (32px) + Header (64px) = 96px on MD+, 64px on mobile */}
      <div className="h-16 md:h-24 w-full flex-none" aria-hidden="true"></div>

      <main className="flex-grow relative z-0">
        {children}
      </main>

      <WhatsAppButton />
      <ChatWidget />

      <footer className="bg-slate-900 text-slate-500 py-16 relative z-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6 text-white">
              <span className="font-bold text-xl font-serif tracking-tight">SN ASSOCIATES & CO.</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-slate-400">
              Expert tax, legal, and compliance advisory for the modern era. ISO 9001 Certified for Quality Management Systems.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Facebook size={18} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Instagram size={18} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Our Firm</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Practice Areas</Link></li>
              <li><Link to="/news" className="hover:text-white transition">Knowledge Hub</Link></li>
              <li><Link to="/testimonials" className="hover:text-white transition">Client Success</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-white transition">GST Compliance</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Income Tax Filing</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Company Setup</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Virtual Office</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="shrink-0 text-blue-500" />
                <span className="text-slate-400 text-xs">#1, Electronic City Main Rd, Bangalore-560100</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-blue-500" />
                <span className="text-slate-400">+91 7406581456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-blue-500" />
                <span className="text-slate-400">snco.workspace@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} SN Associates & Co. Secure Client Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
