import React from 'react';
import { Award, Users, Target, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Founded in 2015, we are bridging the gap between traditional auditing and modern business needs.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                SN Associates & Co was established in 2015 with a singular vision: to provide accessible, high-quality tax and legal advisory services to businesses in Bangalore. What started as a small consultancy has grown into a trusted partner for thousands of clients, ranging from freelancers to established private limited companies.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We recognized that the regulatory landscape in India can be complex for entrepreneurs. Our firm was built to decode these complexities, offering a blend of legal expertise (LLB) and financial acumen (Audit/Commerce) under one roof.
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <img 
                src="https://image2url.com/images/1764922709936-f439a564-5199-4dec-a0e7-13421f67f9a8.jpg" 
                alt="Legal books and laptop" 
                className="rounded-lg shadow-md w-full object-cover h-64 md:h-auto" 
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Founder & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
           <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">The Founder</h2>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                 <div className="w-48 h-64 rounded-lg flex-shrink-0 overflow-hidden bg-slate-200 border border-slate-100 shadow-sm">
                   <img 
                      src="https://image2url.com/images/1764921610274-02af8ecd-5779-4cb4-8c10-03ae1ad5ea51.png" 
                      alt="S. Nagarjuna" 
                      className="w-full h-full object-cover object-top" 
                      loading="lazy"
                   />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                   <h3 className="font-bold text-xl text-slate-900">Nagendra M</h3>
                   <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-100 mt-1">Founder & Certified Auditor</div>
                   <p className="text-slate-600 font-medium text-sm mb-3">Tax & Legal Consultant At SN Associates And Co (R)</p>
                   <p className="text-slate-500 text-sm leading-relaxed">
                     Leading with a vision to simplify compliance for Indian businesses. Bringing expert insights from both financial and legal domains.
                   </p>
                 </div>
              </div>
           </div>
           
           <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Mission</h2>
             <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Target size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Simplify Compliance</h4>
                    <p className="text-sm text-slate-600">Making tax and legal processes understandable and stress-free.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Award size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Build Trust</h4>
                    <p className="text-sm text-slate-600">Maintaining the highest standards of integrity in every filing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Enable Growth</h4>
                    <p className="text-sm text-slate-600">Handling the red tape so you can focus on your business goals.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>

        {/* Office Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Visit Our Office</h2>
          <p className="text-slate-600 mb-2">#1, 1st Floor, Electronic City Main Road, Bettadasanapura, Bangalore-560100</p>
          <div className="flex justify-center items-center gap-2 text-blue-700 font-medium mt-4">
             <Clock size={18} />
             <span>Monday – Saturday: 9:30 AM – 6:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;