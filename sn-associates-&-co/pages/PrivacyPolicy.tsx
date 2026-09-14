import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-400/30 shadow-xs">
                            <Shield size={14} className="text-blue-400" /> Legal Documentation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-white !text-white tracking-tight drop-shadow-sm">Privacy Policy</h1>
                        <p className="text-slate-200 text-lg font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed text-lg">

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Eye className="text-blue-600" size={24} />
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            At SN Associates & Co, we collect information to provide better services to our clients. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and business details provided via our contact forms.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our website, including pages visited and time spent.</li>
                            <li><strong>Cookies:</strong> We use cookies to improve user experience and analyze website traffic.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <Lock className="text-blue-600" size={24} />
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-4">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                            <li>To provide and maintain our services.</li>
                            <li>To notify you about changes to our services.</li>
                            <li>To provide customer support.</li>
                            <li>To gather analysis or valuable information so that we can improve our services.</li>
                            <li>To monitor the usage of our services.</li>
                            <li>To detect, prevent and address technical issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <FileText className="text-blue-600" size={24} />
                            3. Data Security
                        </h2>
                        <p>
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section id="dpdp-rights" className="p-6 bg-blue-50/70 rounded-2xl border border-blue-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                            <Shield className="text-blue-700" size={24} />
                            4. Digital Personal Data Protection (DPDP) Act, 2023 Compliance
                        </h2>
                        <p className="mb-4 text-slate-700 text-base">
                            Under the Digital Personal Data Protection (DPDP) Act, 2023 and The Consumer Protection (E-Commerce) (Amendment) Rules, 2026, SN Associates & Co acts as a Data Fiduciary. We adhere strictly to purpose limitation, storage limitation, and data minimization principles for all taxpayers, students, and businesses.
                        </p>
                        
                        <h3 className="font-bold text-slate-900 text-lg mb-2">Your Statutory Data Principal Rights:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-700 marker:text-blue-600 mb-6">
                            <li><strong>Right to Access:</strong> You have the right to request a summary of your personal data held by us, identities of data fiduciaries/processors, and description of processing activities.</li>
                            <li><strong>Right to Correction & Updating:</strong> You may update or rectify inaccurate or outdated personal details directly through your Client Portal.</li>
                            <li><strong>Right to Erasure / Deletion:</strong> You can request permanent erasure of your personal data and account closure through the "Data & Privacy Controls" tab in your Client Portal or by emailing our Grievance Officer.</li>
                            <li><strong>Right of Grievance Redressal:</strong> You have the right to register grievances with our dedicated Data Protection & Grievance Officer.</li>
                            <li><strong>Right to Nominate:</strong> You may designate a legal representative or nominee to exercise your data rights in the event of death or incapacity.</li>
                        </ul>

                        <div className="bg-white p-4 rounded-xl border border-blue-200/80 text-sm text-slate-600">
                            <strong className="text-slate-900">Statutory Exception Note:</strong> Financial transaction records, invoices, and statutory tax filings (ITR / GST) will be retained for a mandatory period of 7 financial years pursuant to the provisions of Section 44AA of the Income Tax Act, 1961 and Section 36 of the CGST Act, 2017.
                        </div>
                    </section>

                    <section className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Lock className="text-emerald-400" size={24} />
                            5. Grievance Officer & Nodal Contact (E-Commerce Rules, 2026)
                        </h2>
                        <p className="text-slate-300 text-base mb-4">
                            In accordance with Rule 5(4) of the Consumer Protection (E-Commerce) Rules and the DPDP Rules, the details of our designated Data Protection & Grievance Officer are published below:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white/5 p-5 rounded-xl border border-white/10">
                            <div>
                                <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Grievance Officer</span>
                                <strong className="text-white text-base">Mr. Nagendra M</strong>
                                <p className="text-slate-300 text-xs">Senior Partner & Compliance Head</p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Entity Name</span>
                                <strong className="text-white text-base">SN Associates & Co</strong>
                                <p className="text-slate-300 text-xs">Bangalore Chartered Accountancy & Advisory</p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Office Address</span>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    #1, 1st Floor, Electronic City Main Road, Bettadasanapura, Bangalore - 560100, Karnataka, India
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Statutory Response SLA</span>
                                <p className="text-emerald-400 text-xs font-semibold">
                                    Acknowledgement: Within 48 Hours<br />
                                    Resolution: Within 30 Days
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm">
                            <a href="mailto:snco.workspace@gmail.com?subject=DPDP%20Data%20Request%20/%20Grievance" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition">
                                Email Grievance Officer
                            </a>
                            <a href="tel:+917406581456" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition border border-white/15">
                                Call: +91 7406581456
                            </a>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. General Inquiries & Support</h2>
                        <p className="mb-4">
                            For standard inquiries, appointment changes, or corporate services, contact our support desk:
                        </p>
                        <ul className="space-y-2 font-bold text-slate-900">
                            <li>Primary Email: snco.workspace@gmail.com</li>
                            <li>Hotline: +91 7406581456</li>
                            <li>Hours: Monday – Saturday (9:30 AM – 6:30 PM IST)</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
