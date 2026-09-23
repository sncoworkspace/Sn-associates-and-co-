
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Linkedin, Instagram, Twitter, Youtube, Facebook, MessageCircle, ExternalLink } from 'lucide-react';
import { formDb } from '../services/localDb';
import { ADS_ID } from '../components/Analytics';
import { SOCIAL_LINKS } from '../data/socialData';

const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const submissionData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      company: formData.get('company'),
      message: formData.get('message'),
      created_at: new Date().toISOString()
    };

    try {
      // Use the new backend leads endpoint for email notifications
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
      });

      if (!response.ok) throw new Error('Failed to submit lead');

      // Trigger Google Ads Conversion
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${ADS_ID}/contact_form_submission`, // Replace 'contact_form_submission' with your actual label
        });
      }

      setFormStatus('success');
      form.reset();
      setSelectedService('');
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting form", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Contact Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Have a question about GST, Company Registration, or Filing? Reach out to us.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Office Address</h3>
                    <p className="text-slate-600">
                      #1, 1st Floor, Electronic City Main Road,<br />
                      Bettadasanapura, Bangalore-560100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Phone Numbers</h3>
                    <p className="text-slate-600 font-bold text-lg">+91 7406581456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email Us</h3>
                    <p className="text-slate-600">snco.workspace@gmail.com</p>
                    <p className="text-slate-600">audit.snassociates@gmail.com</p>
                  </div>
                </div>

                {/* Social Media Channels Grid */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Official Social Channels</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SOCIAL_LINKS.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors shrink-0">
                          {s.iconName === 'linkedin' && <Linkedin size={14} />}
                          {s.iconName === 'instagram' && <Instagram size={14} />}
                          {s.iconName === 'twitter' && <Twitter size={14} />}
                          {s.iconName === 'youtube' && <Youtube size={14} />}
                          {s.iconName === 'facebook' && <Facebook size={14} />}
                          {s.iconName === 'whatsapp' && <MessageCircle size={14} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{s.handle}</p>
                        </div>
                        <ExternalLink size={10} className="text-slate-300 group-hover:text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-80 relative overflow-hidden group">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=SN%20Associates%20and%20Co%2C%20Electronic%20City%20Main%20Road%2C%20Bettadasanapura%2C%20Bangalore&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="SN Associates Office Map"
                aria-label="Map showing office location"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

            {formStatus === 'success' && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2 animate-fadeIn">
                <CheckCircle size={20} />
                <span>Thank you! We have received your message and will contact you shortly.</span>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={20} />
                <span>Something went wrong. Please check your connection or call us directly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input type="text" id="name" name="name" autoComplete="name" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="John Doe" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" autoComplete="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" id="phone" name="phone" autoComplete="tel" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="+91 7406581456" />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                <select
                  id="service"
                  name="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                >
                  <option value="">Select a Service</option>
                  <option value="GST Registration/Filing">GST Registration/Filing</option>
                  <option value="Income Tax Filing">Income Tax Filing</option>
                  <option value="Company Incorporation">Company Incorporation</option>
                  <option value="Legal Services">Legal Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Company Name (Optional)</label>
                <input type="text" id="company" name="company" autoComplete="organization" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Your Company Ltd" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea id="message" name="message" rows={4} required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-lg transition shadow-md flex justify-center items-center gap-2">
                {formStatus === 'submitting' ? (
                  <>Sending... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
