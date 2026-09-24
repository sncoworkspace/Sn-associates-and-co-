
import React, { useState, useEffect } from 'react';
import { NavItem, User } from '../types';
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Youtube, Instagram, Twitter, MessageCircle, ShoppingBag, LogOut, User as UserIcon, ShoppingCart, Shield, LayoutDashboard, Briefcase, GraduationCap, BookOpen, Settings, Lock, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import ChatWidget from './ChatWidget';
import VoiceAssistant from './VoiceAssistant';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import Analytics from './Analytics';
import MobileBottomNav from './MobileBottomNav';
import { authDb, cartDb } from '../services/localDb';
import { SOCIAL_LINKS } from '../data/socialData';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Compliance Calendar', path: '/compliance-calendar' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Resources', path: '/resources' },
  { label: 'Blog', path: '/blog' },
  { label: 'SNAC Academy', path: '/snac-academy' },
  { label: 'Courses', path: '/store' },
  { label: 'Careers', path: '/careers' },
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

        {/* Top bar with prominent contact details as per user request */}
        <div className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-11 md:h-12 opacity-100'}`}>
          <div className="container mx-auto px-4 md:px-6 h-full flex justify-between items-center whitespace-nowrap">
            <div className="flex items-center space-x-3 sm:space-x-5">
              <a 
                href="tel:+917406581456" 
                className="flex items-center gap-2 font-bold text-white hover:text-emerald-300 transition-colors bg-white/10 hover:bg-white/15 px-3 md:px-4 py-1.5 rounded-full text-xs sm:text-sm md:text-base tracking-wide border border-white/10 shadow-sm group"
                title="Call SN Associates & Co directly"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone size={14} className="fill-emerald-400" />
                </span>
                <span>+91 7406581456</span>
              </a>

              <a 
                href="mailto:snco.workspace@gmail.com" 
                className="flex items-center gap-2 font-bold text-white hover:text-blue-300 transition-colors bg-white/10 hover:bg-white/15 px-3 md:px-4 py-1.5 rounded-full text-xs sm:text-sm md:text-base tracking-wide border border-white/10 shadow-sm group"
                title="Email SN Associates & Co"
              >
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail size={14} />
                </span>
                <span>snco.workspace@gmail.com</span>
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Mon - Sat: 9:30 AM - 6:30 PM</span>
              </span>

              {/* Social Media Quick Bar */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    aria-label={s.name}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-xs"
                  >
                    {s.iconName === 'linkedin' && <Linkedin size={13} />}
                    {s.iconName === 'instagram' && <Instagram size={13} />}
                    {s.iconName === 'twitter' && <Twitter size={13} />}
                    {s.iconName === 'youtube' && <Youtube size={13} />}
                    {s.iconName === 'facebook' && <Facebook size={13} />}
                    {s.iconName === 'whatsapp' && <MessageCircle size={13} />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <header className={`bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center transition-all duration-300 ease-in-out relative ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'}`}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full">

            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <img src="/logo.png" alt="SN Associates & Co" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-9 md:h-11' : 'h-11 md:h-14'}`} />
              <div className="flex flex-col justify-center">
                <span className={`font-serif font-bold transition-all duration-300 leading-tight text-slate-900 tracking-tight group-hover:text-blue-900 ${isScrolled ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>SN ASSOCIATES & CO.</span>
                <span className={`text-[8px] md:text-[9px] text-slate-500 tracking-widest uppercase font-semibold hidden sm:block transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 scale-95' : 'opacity-100 h-auto'}`}>Tax, Legal & Tech Experts</span>
              </div>
            </Link>

            <nav className="hidden xl:flex space-x-1 items-center">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`text-xs xl:text-sm font-medium px-2 xl:px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${location.pathname === item.path ? 'bg-slate-100 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'}`}>
                  {item.label === 'Compliance Calendar' && <Calendar size={14} className="text-blue-500" />}
                  {item.label === 'Case Studies' && <Sparkles size={14} className="text-blue-500" />}
                  {item.label === 'SNAC Academy' && <GraduationCap size={14} className="text-blue-500" />}
                  {item.label === 'Courses' && <BookOpen size={14} className="text-blue-500" />}
                  {item.label === 'Careers' && <Briefcase size={14} className="text-blue-500" />}
                  {item.label === 'Resources' && <Sparkles size={14} className="text-blue-500" />}
                  {item.label === 'Blog' && <BookOpen size={14} className="text-blue-500" />}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 md:gap-3 shrink-0 ml-auto md:ml-0">
              {/* Primary High-Converting CTA */}
              <Link 
                to="/book-consultation" 
                className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar size={13} />
                <span>Book Free Call</span>
              </Link>

              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition" aria-label="Shopping Cart">
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
                <div className="hidden lg:flex gap-2 ml-1 shrink-0">
                  <Link to="/login" className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition border border-slate-200">Log In</Link>
                </div>
              )}
              <button className="xl:hidden text-slate-700 p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition" onClick={toggleMenu} aria-label="Toggle Menu">{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-hidden xl:hidden z-[70]">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <Link 
                  to="/book-consultation" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-2.5 rounded-xl shadow-md"
                >
                  <Calendar size={16} />
                  <span>Book Free Consultation</span>
                </Link>
              </div>
              <div className="p-4 bg-slate-900 text-white flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Support Hotline:</span>
                <a 
                  href="tel:+917406581456" 
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl font-bold text-base text-emerald-400"
                >
                  <Phone size={18} />
                  <span>+91 7406581456</span>
                </a>
                <a 
                  href="mailto:snco.workspace@gmail.com" 
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl font-bold text-sm text-blue-300"
                >
                  <Mail size={16} />
                  <span>snco.workspace@gmail.com</span>
                </a>
              </div>
              <nav className="flex flex-col p-4 space-y-1 max-h-[60vh] overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className={`text-sm font-medium px-4 py-3 rounded-lg flex items-center gap-2 ${location.pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connect With Us</p>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 flex items-center justify-center shadow-2xs"
                    >
                      {s.iconName === 'linkedin' && <Linkedin size={14} />}
                      {s.iconName === 'instagram' && <Instagram size={14} />}
                      {s.iconName === 'twitter' && <Twitter size={14} />}
                      {s.iconName === 'youtube' && <Youtube size={14} />}
                      {s.iconName === 'facebook' && <Facebook size={14} />}
                      {s.iconName === 'whatsapp' && <MessageCircle size={14} />}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Admin Quick Shortcut */}
      {user?.role === 'admin' && (
        <button onClick={() => navigate('/admin')} className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-full shadow-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all active:scale-95 border-2 border-white">
          <Settings size={16} className="animate-spin-slow" /> Control Panel
        </button>
      )}

      <div className={`transition-all duration-300 w-full flex-none ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-28'}`}></div>
      <main className="flex-grow relative z-0 pb-20 lg:pb-0">{children}</main>
      <WhatsAppButton />
      <VoiceAssistant />
      <ChatWidget />
      <Footer />
      <MobileBottomNav />
      <CookieConsent />
      <Analytics />
    </div>
  );
};

export default Layout;
