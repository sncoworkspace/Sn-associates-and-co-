
import React from 'react';
import { TestimonialItem } from '../types';
import { Quote, Star, ExternalLink, MessageSquare } from 'lucide-react';

interface EnhancedTestimonial extends TestimonialItem {
  image: string;
}

const testimonials: EnhancedTestimonial[] = [
  {
    id: '1',
    quote: "SN Associates handled my Private Limited incorporation seamlessly. They explained every step clearly and handled all the ROC compliance. Highly recommended for startups!",
    author: "Rajesh K.",
    role: "Tech Startup Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '2',
    quote: "I've been filing my ITR with them for 4 years now. Professional, timely, and they always find the best deductions. The peace of mind is worth every penny.",
    author: "Priya S.",
    role: "Freelance Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '3',
    quote: "Their virtual office service is a lifesaver for my remote business. I got my GST registration done using their address without any hassle.",
    author: "Anand M.",
    role: "E-commerce Seller",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '4',
    quote: "Professionalism at its best. The team is very knowledgeable about the latest GST amendments. They saved us from potential penalties with their timely audit.",
    author: "Suresh Gowda",
    role: "Restaurant Owner",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '5',
    quote: "Responsive and trustworthy. I approached them for legal drafting of my partnership deed, and they delivered a solid document within 2 days.",
    author: "Meera Nair",
    role: "Consultant",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '6',
    quote: "Best tax consultants in Electronic City. Very approachable and they genuinely care about client compliance.",
    author: "David L.",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

const Testimonials: React.FC = () => {
  const googleReviewUrl = "https://www.google.com/search?q=SN+Associates+and+Co+Electronic+City+Reviews";

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight text-white">Client Success Stories</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Built on trust and professional excellence. Here's what our business partners say.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Google Review Mastery Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                 <img 
                   src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
                   alt="Google" 
                   className="w-6 h-6 object-contain" 
                 />
                 <span className="font-bold text-slate-900 text-lg">Google Reviews</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="text-4xl font-black text-slate-900">4.9</span>
                 <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                 </div>
              </div>
              <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Based on 500+ Verified Client Ratings</p>
           </div>
           
           <div className="h-px w-full md:w-px md:h-20 bg-slate-100"></div>

           <div className="flex flex-col items-center">
              <a 
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl hover:scale-105 active:scale-95 group"
              >
                Write a Google Review <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">Share your experience with us</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-200 relative group hover:shadow-2xl hover:border-blue-200 transition-all duration-500">
              <Quote className="text-blue-50 absolute top-6 left-6" size={48} />
              <div className="relative z-10 pt-8">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 italic mb-8 leading-relaxed text-sm">"{item.quote}"</p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all">
                    <img src={item.image} alt={item.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.author}</h4>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
