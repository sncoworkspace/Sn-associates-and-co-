import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Globe, Shield, Scale, Clock, ArrowRight } from 'lucide-react';

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
                            <img src="/logo-base.png" alt="SN Associates" className="h-12 w-auto object-contain bg-white rounded p-1" />
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-white text-lg leading-tight tracking-tight">SN ASSOCIATES & CO.</span>
                                <span className="text-[10px] text-blue-400 tracking-widest uppercase font-bold">Tax & Legal Experts</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Empowering businesses with comprehensive tax, legal, and compliance solutions since 2015. We simplify the complex so you can focus on growth.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.linkedin.com/company/sn-associates"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow SN Associates & Co on LinkedIn"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://www.facebook.com/snassociates"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow SN Associates & Co on Facebook"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/snassociates"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow SN Associates & Co on Instagram"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Globe size={18} className="text-blue-500" /> Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Compliance Calendar', path: '/compliance-calendar' },
                                { name: 'Client Case Studies', path: '/case-studies' },
                                { name: 'Resources & E-Books', path: '/resources' },
                                { name: 'SNAC Academy', path: '/snac-academy' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Contact Us', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-blue-500" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services & Calculators */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Scale size={18} className="text-blue-500" /> Statutory Services & Tools
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { name: 'Company Registration (SPICe+)', path: '/services/company-registration' },
                                { name: 'GST Registration & Returns', path: '/services/gst-registration-filing' },
                                { name: 'Income Tax & Section 44AB', path: '/services/income-tax-filing' },
                                { name: 'Trademark & Brand Protection', path: '/services/trademark-registration' },
                                { name: 'Startup India & 80-IAC Holiday', path: '/services/startup-india-msme' },
                                { name: 'GST Slabs & ITC Calculator', path: '/tools/gst-calculator' },
                                { name: 'Old vs New Tax Calculator', path: '/tools/income-tax-calculator' },
                                { name: 'MCA Stamp Duty Estimator', path: '/tools/incorporation-estimator' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-slate-400 hover:text-blue-400 transition-colors text-sm block truncate">
                                        {item.name}
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
                    <div className="flex items-center gap-6">
                        <Link to="/privacy-policy" className="text-slate-500 hover:text-white text-xs font-medium transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="text-slate-500 hover:text-white text-xs font-medium transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/contact" className="text-slate-500 hover:text-white text-xs font-medium transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
