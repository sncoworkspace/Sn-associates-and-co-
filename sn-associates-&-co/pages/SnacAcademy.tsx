
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Briefcase, Rocket, CheckCircle2, Phone, Clock, Star, Users,
  MapPin, ArrowRight, ShieldCheck, HeartHandshake, BookOpen, Globe, Lightbulb, Loader2
} from 'lucide-react';
import { productDb } from '../services/localDb';
import { Product } from '../types';

const SnacAcademy: React.FC = () => {
  const [internships, setInternships] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInternships = async () => {
      try {
        const data = await productDb.getAll();
        setInternships(data.filter(p => p.type === 'Internship'));
      } catch (err) {
        console.error("Failed to fetch internships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-[#0f172a] text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-blue-400/20 mb-8">Professional Excellence & Entrepreneurship</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
              Launch Your Own <br />
              <span className="text-blue-500 italic">Tax Consultant Empire.</span>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed mb-12 max-w-3xl">
              We don't just teach theory. We build <strong>business mindsets</strong>. SNAC Academy trains professionals and students to master GST and Taxation so they can start their own expert offices immediately after education—no 5-year clerkship required.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/store" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-blue-600/20 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                Apply for Next Batch <ArrowRight size={20} />
              </Link>
              <Link to="/store" className="bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-5 rounded-2xl backdrop-blur-md border border-white/10 transition flex items-center justify-center gap-2">
                Explore Mastery Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">Skip the Under-Paid Internships. <br /><span className="text-blue-600">Start Your Own Office.</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Most graduates spend years working under CAs for nominal stipends. SNAC Academy changes the game. Our practical-first approach ensures you have the <strong>live portal experience</strong> needed to handle clients independently from day one.
              </p>
              <div className="space-y-4">
                {[
                  "Lifetime Professional Support for your practice.",
                  "Training on Live Portals (GST, ITR, MCA).",
                  "Business Mindset & Client Acquisition strategy.",
                  "Practical Accounting & Internal Audit mastery.",
                  "Office Setup Guidance from legal and tech experts."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
              <div className="bg-white p-3 rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" alt="Training Session" className="rounded-2xl w-full grayscale-[20%] hover:grayscale-0 transition" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl max-w-xs animate-bounce-slow">
                <Star className="text-yellow-400 mb-4" fill="currentColor" />
                <p className="font-bold text-lg mb-2">100% Practical</p>
                <p className="text-xs text-slate-400">Everything you learn is applied to real business scenarios we handle in our firm every day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Programs - DYNAMIC */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Experimental Learning</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Certified Internship Programs</h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
              Perfect for students and graduates who want to bridge the gap between education and professional practice. Pay the fees, learn the craft, and take home a recognized certificate.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${internships.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 max-w-6xl mx-auto`}>
              {internships.map((program, idx) => (
                <div key={program.id} className={`bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group ${idx === 1 && internships.length === 3 ? 'bg-slate-900 text-white shadow-2xl shadow-blue-900/20 relative scale-105' : ''}`}>
                  {idx === 1 && internships.length === 3 && (
                    <div className="absolute top-6 right-6 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${idx === 1 && internships.length === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    {idx === 0 ? <Clock size={28} /> : idx === 1 ? <Rocket size={28} /> : <Briefcase size={28} />}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${idx === 1 && internships.length === 3 ? 'text-white' : 'text-slate-900'}`}>{program.title}</h3>
                  <p className="text-slate-400 text-sm mb-6">{program.description}</p>
                  <div className={`text-4xl font-black mb-8 ${idx === 1 && internships.length === 3 ? 'text-blue-400' : 'text-slate-900'}`}>
                    ₹{program.price}<span className="text-sm font-normal text-slate-400 ml-1">/ program</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {program.features.map((feature, fIdx) => (
                      <li key={fIdx} className={`flex items-center gap-2 text-xs ${idx === 1 && internships.length === 3 ? 'text-slate-300' : 'text-slate-600'}`}>
                        <CheckCircle2 size={14} className={idx === 1 && internships.length === 3 ? 'text-blue-400' : 'text-green-500'} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/product/${program.id}`}
                    className={`w-full inline-block py-4 rounded-xl font-bold transition text-center ${idx === 1 && internships.length === 3 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                  >
                    View Details
                  </Link>
                </div>
              ))}
              {internships.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">
                  New internship programs coming soon!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mastery Modules */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="text-blue-500 font-bold text-4xl mb-4"><Lightbulb size={40} /></div>
              <h4 className="text-xl font-bold">GST Mastery</h4>
              <p className="text-slate-400 text-sm">GSTR-1, GSTR-3B, Registration, and Scrutiny handling on live portals.</p>
            </div>
            <div className="space-y-4">
              <div className="text-purple-500 font-bold text-4xl mb-4"><BookOpen size={40} /></div>
              <h4 className="text-xl font-bold">ITR Mastery</h4>
              <p className="text-slate-400 text-sm">Filing for Salaried, Business, and Corporates with expert tax planning.</p>
            </div>
            <div className="space-y-4">
              <div className="text-amber-500 font-bold text-4xl mb-4"><Globe size={40} /></div>
              <h4 className="text-xl font-bold">Registration Expert</h4>
              <p className="text-slate-400 text-sm">MSME, FSSAI, Shop Act, and Company registration procedures.</p>
            </div>
            <div className="space-y-4">
              <div className="text-green-500 font-bold text-4xl mb-4"><ShieldCheck size={40} /></div>
              <h4 className="text-xl font-bold">Accounting Pro</h4>
              <p className="text-slate-400 text-sm">Mastering Tally Prime and generating audit-ready financial statements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-5 rotate-45"><HeartHandshake size={300} /></div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">Open your office this year.</h2>
            <p className="text-slate-600 text-xl mb-12 max-w-2xl mx-auto font-medium">Join SNAC Academy for the practical experience you've been missing. Available in <span className="text-blue-600">Online & Offline</span> batches.</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/contact" className="bg-slate-900 text-white font-bold px-12 py-5 rounded-full hover:bg-black transition-all shadow-xl active:scale-95">
                Register for Admissions
              </Link>
              <a href="tel:+917406581456" className="flex items-center gap-3 font-bold text-slate-700 hover:text-blue-600 transition">
                <Phone size={20} /> Speak to a Counselor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SnacAcademy;
