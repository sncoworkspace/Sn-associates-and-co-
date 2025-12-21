import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// -----------------------------------------------------------------------------
// INSTRUCTIONS FOR GOOGLE SHEETS:
// 1. Ensure your Google Apps Script "doPost(e)" function parses JSON:
//
//    function doPost(e) {
//      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//      var data = JSON.parse(e.postData.contents);
//      var timestamp = new Date();
//      sheet.appendRow([timestamp, data.name, data.email, data.phone, data.service, data.message]);
//      return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
//        .setMimeType(ContentService.MimeType.JSON);
//    }
//
// 2. Deploy as Web App -> Execute as 'Me' -> Who has access: 'Anyone'.
// -----------------------------------------------------------------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxOJfHZ5vaORuZ1wgss2xpwl_VA41BEX37yyUNHeG4xcRR8EtjfkCLua7CN_Oh7ie0iQ/exec"; 

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Construct a JSON payload matching your request
    const payload = {
      name: formData.get('name'), // Maps to 'first name'
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'), // Maps to 'Service Interested In'
      message: formData.get('message'),
      selected: formData.get('service'), // Maps to 'selected' (redundant but requested)
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        // mode: 'no-cors' is required for Google Apps Script Web Apps when calling from client-side
        // to avoid CORS errors in the browser console. The response is opaque (status 0).
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Use text/plain to avoid preflight OPTIONS check issues
        }
      });

      // Since mode is no-cors, we assume success if no network error occurred.
      setFormStatus('success');
      form.reset();
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
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
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
              </div>
            </div>

            {/* Google Map Embed */}
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
                 loading="lazy"
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
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="+91 7406581456"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                <select 
                  id="service" 
                  name="service"
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
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-lg transition shadow-md flex justify-center items-center gap-2"
              >
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