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
                        <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20">
                            <Shield size={14} /> Legal Documentation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Privacy Policy</h1>
                        <p className="text-slate-400 text-lg">Last Updated: {new Date().toLocaleDateString()}</p>
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

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Third-Party Services</h2>
                        <p>
                            We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
