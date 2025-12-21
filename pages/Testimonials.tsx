import React from 'react';
import { TestimonialItem } from '../types';
import { Quote } from 'lucide-react';

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    quote: "SN Associates handled my Private Limited incorporation seamlessly. They explained every step clearly and handled all the ROC compliance. Highly recommended for startups!",
    author: "Rajesh K.",
    role: "Tech Startup Founder"
  },
  {
    id: '2',
    quote: "I've been filing my ITR with them for 4 years now. Professional, timely, and they always find the best deductions. The peace of mind is worth every penny.",
    author: "Priya S.",
    role: "Freelance Designer"
  },
  {
    id: '3',
    quote: "Their virtual office service is a lifesaver for my remote business. I got my GST registration done using their address without any hassle.",
    author: "Anand M.",
    role: "E-commerce Seller"
  },
  {
    id: '4',
    quote: "Professionalism at its best. The team is very knowledgeable about the latest GST amendments. They saved us from potential penalties with their timely audit.",
    author: "Suresh Gowda",
    role: "Restaurant Owner"
  },
  {
    id: '5',
    quote: "Responsive and trustworthy. I approached them for legal drafting of my partnership deed, and they delivered a solid document within 2 days.",
    author: "Meera Nair",
    role: "Consultant"
  },
  {
    id: '6',
    quote: "Best tax consultants in Electronic City. Very approachable and they genuinely care about client compliance.",
    author: "David L.",
    role: "Small Business Owner"
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Client Success Stories</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">We take pride in the trust our clients place in us. Here's what they have to say.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-slate-50 p-8 rounded-xl border border-slate-100 relative">
              <Quote className="text-blue-200 absolute top-6 left-6" size={40} />
              <div className="relative z-10 pt-8">
                <p className="text-slate-700 italic mb-6 leading-relaxed">"{item.quote}"</p>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.author}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{item.role}</p>
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