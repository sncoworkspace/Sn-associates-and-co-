
import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Star, Zap, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const openPositions = [
  {
    id: '1',
    title: 'Audit Associate',
    department: 'Audit & Assurance',
    location: 'Bangalore (On-site)',
    type: 'Full-time',
    experience: '1-3 Years',
    description: 'Looking for a diligent Audit Associate to handle statutory and internal audits for our corporate clients.',
    requirements: ['Experience with Tally & MS Excel', 'Knowledge of Accounting Standards', 'B.Com/CA Inter preferred']
  },
  {
    id: '2',
    title: 'GST & Tax Consultant',
    department: 'Indirect Taxation',
    location: 'Bangalore (On-site)',
    type: 'Full-time',
    experience: '2+ Years',
    description: 'Manage GST filings, reconciliations, and departmental inquiries for MSME and startup clients.',
    requirements: ['Expertise in GST portal filings', 'Good communication skills', 'Problem-solving mindset']
  },
  {
    id: '3',
    title: 'Marketing Executive',
    department: 'Digital & Growth',
    location: 'Bangalore (Hybrid)',
    type: 'Full-time',
    experience: '0-2 Years',
    description: 'Help grow our digital presence and the SNAC Academy brand through lead generation and social media strategy.',
    requirements: ['Creative mindset', 'Understanding of social media ads', 'Passionate about business growth']
  }
];

const Careers: React.FC = () => {
  const HR_EMAIL = "snco.workspace@gmail.com";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-blue-400/20 mb-6">Join our Team</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">Shape the Future of <br/><span className="text-blue-500">Tax & Legal Experts</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Join Bangalore's most tech-forward compliance firm. We’re looking for passionate individuals to help us simplify business for thousands of entrepreneurs.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Users size={24} /></div>
               <h3 className="font-bold text-xl mb-3">Collaborative Culture</h3>
               <p className="text-slate-500 text-sm">We believe in growing together. Our environment fosters mentorship and open communication across all levels.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
               <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Zap size={24} /></div>
               <h3 className="font-bold text-xl mb-3">Innovation First</h3>
               <p className="text-slate-500 text-sm">From AI tools to automated workflows, we leverage the latest technology to stay ahead of the compliance curve.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><ShieldCheck size={24} /></div>
               <h3 className="font-bold text-xl mb-3">Integrity & Impact</h3>
               <p className="text-slate-500 text-sm">Our work builds the backbone of the economy. We take pride in maintaining the highest ethical standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Current Openings</h2>
                <p className="text-slate-500">Find your next challenge at SN Associates & Co.</p>
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{openPositions.length} Positions Available</span>
              </div>
            </div>

            <div className="space-y-6">
              {openPositions.map((job) => (
                <div key={job.id} className="group bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{job.department}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.type}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-6">
                        <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</div>
                        <div className="flex items-center gap-1.5"><Clock size={14} /> {job.experience} Exp</div>
                      </div>
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">{job.description}</p>
                      <div className="space-y-2">
                         {job.requirements.map((req, idx) => (
                           <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                              <CheckCircle2 size={12} className="text-blue-500" /> {req}
                           </div>
                         ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a 
                        href={`mailto:${HR_EMAIL}?subject=Job Application: ${job.title}`}
                        className="w-full md:w-auto bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 text-center"
                      >
                        Apply Now <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-blue-600 rounded-3xl p-10 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase size={120} /></div>
               <div className="relative z-10">
                 <h2 className="text-2xl font-bold mb-4">Don't see a fit?</h2>
                 <p className="text-blue-100 mb-8 max-w-lg mx-auto">We're always looking for exceptional talent in Tax, Law, and Technology. Send us your CV and we'll keep you in mind for future opportunities.</p>
                 <a 
                    href={`mailto:${HR_EMAIL}?subject=General Career Inquiry & CV`}
                    className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition shadow-xl active:scale-95"
                 >
                    Email CV to Team
                 </a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
