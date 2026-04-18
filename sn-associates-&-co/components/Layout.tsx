
import React, { useState, useEffect } from 'react';
import { NavItem, User } from '../types';
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Youtube, Instagram, ShoppingBag, LogOut, User as UserIcon, ShoppingCart, Shield, LayoutDashboard, Briefcase, GraduationCap, BookOpen, Settings, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import ChatWidget from './ChatWidget';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import Analytics from './Analytics';
import { authDb, cartDb } from '../services/localDb';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'News', path: '/news' },
  { label: 'SNAC Academy', path: '/snac-academy' },
  { label: 'Courses', path: '/store' },
  { label: 'Careers', path: '/careers' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact', path: '/contact' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const syncState = () => {
    setUser(authDb.getCurrentUser());
    setCartCount(cartDb.getCount());
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    window.addEventListener('cart-updated', syncState);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('cart-updated', syncState);
      window.removeEventListener('scroll', handleScroll);
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

      {/* Dynamic Sticky Header Assembly */}
      <div className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 transform translate-z-0 overflow-visible ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>

        {/* Top bar */}
        <div className={`bg-slate-900 text-slate-300 text-[10px] md:text-xs hidden md:flex items-center px-4 border-b border-white/5 overflow-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-8 opacity-100'}`}>
          <div className="container mx-auto flex justify-between items-center whitespace-nowrap">
            <div className="flex space-x-6">
              <span className="flex items-center gap-2"><Phone size={12} className="text-blue-400" /> +91 7406581456</span>
              <span className="flex items-center gap-2"><Mail size={12} className="text-blue-400" /> snco.workspace@gmail.com</span>
            </div>
            <div className="flex space-x-4 items-center">

              <span className="opacity-20">|</span>
              <span>Mon - Sat: 9:30 AM - 6:30 PM</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <header className={`bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center transition-all duration-300 ease-in-out relative ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'}`}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">

            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <img src="https://image2url.com/images/1764921906714-ca9522a0-9679-4611-822e-55e3ef363a5a.png" alt="SN Associates" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-9 md:h-11' : 'h-12 md:h-16'}`} />
              <div className="flex flex-col justify-center">
                <span className={`font-serif font-bold transition-all duration-300 leading-tight text-slate-900 tracking-tight group-hover:text-blue-900 ${isScrolled ? 'text-sm md:text-base' : 'text-base md:text-xl'}`}>SN ASSOCIATES & CO.</span>
                <span className={`text-[8px] md:text-[10px] text-slate-500 tracking-widest uppercase font-medium hidden sm:block transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 scale-95' : 'opacity-100 h-auto'}`}>Tax & Legal Experts</span>
              </div>
            </Link>

            <nav className="hidden xl:flex space-x-1 items-center">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`text-xs xl:text-sm font-medium px-2 xl:px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${location.pathname === item.path ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'}`}>
                  {item.label === 'SNAC Academy' && <GraduationCap size={14} className="text-blue-500" />}
                  {item.label === 'Courses' && <BookOpen size={14} className="text-blue-500" />}
                  {item.label === 'Careers' && <Briefcase size={14} className="text-blue-500" />}
                  {item.label === 'Resources' && <BookOpen size={14} className="text-blue-500" />}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-3 shrink-0 ml-auto md:ml-0">
              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition">
                <ShoppingCart size={isScrolled ? 18 : 20} className="transition-all duration-300" />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>
              {user && <Link to="/my-learning" className="hidden lg:flex p-2 text-slate-600 hover:text-blue-600 transition"><LayoutDashboard size={isScrolled ? 18 : 20} /></Link>}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1 shrink-0">
                  <div className={`rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm transition-all duration-300 ${isScrolled ? 'w-7 h-7' : 'w-8 h-8'} ${user.role === 'admin' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 transition"><LogOut size={isScrolled ? 16 : 18} /></button>
                </div>
              ) : (
                <div className="hidden lg:flex gap-2 ml-2 shrink-0">
                  <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition border border-slate-200">Log In</Link>
                  <Link to="/login" className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Sign Up</Link>
                </div>
              )}
              <button className="xl:hidden text-slate-700 p-2 bg-slate-100 rounded-lg" onClick={toggleMenu}>{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-hidden xl:hidden z-[70]">
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className={`text-sm font-medium px-4 py-3 rounded-lg flex items-center gap-2 ${location.pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}

              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Admin Quick Shortcut */}
      {user?.role === 'admin' && (
        <button onClick={() => navigate('/admin')} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-full shadow-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all active:scale-95 border-2 border-white">
          <Settings size={16} className="animate-spin-slow" /> Control Panel
        </button>
      )}

      <div className={`transition-all duration-300 w-full flex-none ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-28'}`}></div>
      <main className="flex-grow relative z-0">{children}</main>
      <WhatsAppButton />
      <ChatWidget />
      <Footer />
      <CookieConsent />
      <Analytics />
    </div>
  );
};

export default Layout;
