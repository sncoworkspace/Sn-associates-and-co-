import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle, Mail, Phone, MapPin, Globe, Shield, Scale, Clock, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 border-t border-slate-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <img src="/logo.png" alt="SN Associates & Co" className="h-12 w-auto object-contain bg-white/95 rounded-lg p-1.5 shadow-md group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-white text-lg leading-tight tracking-tight">SN ASSOCIATES & CO.</span>
                                <span className="text-[10px] text-blue-400 tracking-widest uppercase font-bold">Tax & Legal Experts</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Empowering businesses with comprehensive tax, legal, and compliance solutions since 2015. We simplify the complex so you can focus on growth.
                        </p>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Connect With Us</p>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`${s.name} - ${s.handle}`}
                                        aria-label={s.name}
                                        className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500"
                                        style={{ backgroundColor: undefined }}
                                    >
                                        {s.iconName === 'linkedin' && <Linkedin size={16} />}
                                        {s.iconName === 'instagram' && <Instagram size={16} />}
                                        {s.iconName === 'twitter' && <Twitter size={16} />}
                                        {s.iconName === 'youtube' && <Youtube size={16} />}
                                        {s.iconName === 'facebook' && <Facebook size={16} />}
                                        {s.iconName === 'whatsapp' && <MessageCircle size={16} />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Globe size={18} className="text-blue-500" /> Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {['About Us', 'Services', 'Blog', 'News', 'Resources', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-blue-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Scale size={18} className="text-blue-500" /> Top Services
                        </h4>
                        <ul className="space-y-3">
                            {[
                                'Company Registration',
                                'GST Filing & Compliance',
                                'Income Tax Returns',
                                'Trademark Registration',
                                'Virtual CFO Services',
                                'Startup India Registration'
                            ].map((item) => (
                                <li key={item}>
                                    <Link to="/services" className="text-slate-400 hover:text-blue-400 transition-colors text-sm block truncate">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Phone size={18} className="text-blue-500" /> Get in Touch
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0 mt-1">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        #1, 1st Floor, Electronic City Main Road, Bettadasanapura, Bangalore-560100
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0 mt-1">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Support</p>
                                    <p className="text-slate-300 text-sm font-bold hover:text-white transition-colors">
                                        <a href="tel:+917406581456">+91 7406581456</a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0 mt-1">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</p>
                                    <p className="text-slate-300 text-sm font-bold hover:text-white transition-colors">
                                        <a href="mailto:snco.workspace@gmail.com">snco.workspace@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        &copy; {currentYear} SN Associates & Co. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        <Link to="/privacy-policy" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">
                            Privacy Policy & DPDP Rights
                        </Link>
                        <Link to="/terms-of-service" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">
                            Terms of Service
                        </Link>
                        <button 
                            onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))} 
                            className="text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                            <span>🍪</span>
                            <span>Cookie Preferences</span>
                        </button>
                        <Link to="/contact" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">
                            Grievance Officer
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
