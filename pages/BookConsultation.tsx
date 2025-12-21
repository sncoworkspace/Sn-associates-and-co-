import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Globe, Calendar, CheckCircle, Loader2 } from 'lucide-react';

// Google Apps Script URL (Reusing the one from Contact page for now, 
// ensuring the script can handle the 'booking' type if you decide to update the script, 
// otherwise it will just log the message in the message column)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxOJfHZ5vaORuZ1wgss2xpwl_VA41BEX37yyUNHeG4xcRR8EtjfkCLua7CN_Oh7ie0iQ/exec";

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM"
];

const BookConsultation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi");
  const [step, setStep] = useState<'picker' | 'details' | 'success'>('picker');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate next 14 days
  const getNextDays = (days: number) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getNextDays(14);

  const scrollDates = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDateDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateNum = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const bookingDateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: "Consultation Booking", // Fixed service type
      message: `Booking Request: ${bookingDateStr} at ${selectedTime} (${timezone}). User Note: ${formData.get('notes')}`,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      setStep('success');
    } catch (error) {
      console.error("Booking failed", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Book a Consultation</h1>
          <p className="text-slate-300">Schedule a 1-on-1 session with our tax & legal experts.</p>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {step === 'picker' && (
            <div className="p-8">
              {/* Section 1: Date Picker */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" /> 
                  When should we meet?
                </h2>
                
                <div className="relative flex items-center">
                  <button 
                    onClick={() => scrollDates('left')}
                    className="absolute left-0 z-10 p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600 hover:bg-slate-50 -ml-4 md:-ml-6"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {dates.map((date, index) => {
                      const isSelected = selectedDate && isSameDate(selectedDate, date);
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 snap-start w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-[#C5A572] bg-[#FFFCF5] text-[#856404] shadow-md transform scale-105' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-[#C5A572]' : 'text-slate-400'}`}>
                            {formatDateDay(date)}
                          </span>
                          <span className={`text-lg font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                            {formatDateNum(date)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => scrollDates('right')}
                    className="absolute right-0 z-10 p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600 hover:bg-slate-50 -mr-4 md:-mr-6"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Section 2: Time Picker */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  Select time of day
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-lg text-sm font-bold border transition-all duration-200 ${
                        selectedTime === time
                          ? 'border-[#C5A572] bg-[#FFFCF5] text-[#856404] ring-1 ring-[#C5A572]'
                          : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Timezone */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-blue-600" />
                  Timezone
                </h2>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-lg appearance-none text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                    <option>(GMT+0:00) London</option>
                    <option>(GMT-4:00) New York</option>
                    <option>(GMT-7:00) Los Angeles</option>
                    <option>(GMT+4:00) Dubai</option>
                    <option>(GMT+8:00) Singapore</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setStep('details')}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-4 rounded-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg"
              >
                Continue to Details
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="p-8">
              <button 
                onClick={() => setStep('picker')}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 mb-6"
              >
                <ChevronLeft size={16} /> Back to slots
              </button>
              
              <div className="mb-8 bg-[#FFFCF5] border border-[#C5A572] rounded-xl p-6">
                 <h3 className="text-[#856404] font-bold text-lg mb-2">Booking Summary</h3>
                 <div className="text-slate-700 space-y-1">
                   <p className="flex items-center gap-2"><Calendar size={16} /> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                   <p className="flex items-center gap-2"><Clock size={16} /> {selectedTime}</p>
                   <p className="flex items-center gap-2"><Globe size={16} /> {timezone}</p>
                 </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-6">Enter your details</h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                  <input type="text" name="name" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                    <input type="email" name="email" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 99999 99999" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                  <textarea name="notes" rows={3} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Topic of discussion (e.g. GST Registration, Income Tax Notice)"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Confirming... <Loader2 size={20} className="animate-spin" /></>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
             <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
                <p className="text-slate-600 max-w-md mx-auto mb-8 text-lg">
                  We have received your booking request for <span className="font-bold text-slate-800">{selectedDate?.toLocaleDateString()} at {selectedTime}</span>.
                  <br/>Our team will call you shortly to confirm the appointment.
                </p>
                <button 
                  onClick={() => {
                    setStep('picker');
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition"
                >
                  Book Another
                </button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
