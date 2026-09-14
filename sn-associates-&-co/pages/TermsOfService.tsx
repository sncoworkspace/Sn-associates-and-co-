import React from 'react';
import { Scale, FileCheck, AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-400/30 shadow-xs">
                            <Scale size={14} className="text-blue-400" /> Legal Documentation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-white !text-white tracking-tight drop-shadow-sm">Terms of Service</h1>
                        <p className="text-slate-200 text-lg font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed text-lg">

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <FileCheck className="text-blue-600" size={24} />
                            1. Introduction
                        </h2>
                        <p>
                            Welcome to SN Associates & Co. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Services</h2>
                        <p className="mb-4">
                            SN Associates & Co provides tax, legal, compliance, and digital solutions. All services are subject to availability and acceptance by us. We reserve the right to refuse service to anyone for any reason at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Accounts</h2>
                        <p>
                            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <AlertTriangle className="text-amber-500" size={24} />
                            4. Limitation of Liability
                        </h2>
                        <p>
                            In no event shall SN Associates & Co, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <ul className="mt-4 space-y-2 font-bold text-slate-900">
                            <li>By email: snco.workspace@gmail.com</li>
                            <li>By phone: +91 7406581456</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
