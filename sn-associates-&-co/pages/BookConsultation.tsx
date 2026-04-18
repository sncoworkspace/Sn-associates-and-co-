
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Globe, Calendar, CheckCircle, Loader2, Ban, ChevronDown, Users, Briefcase } from 'lucide-react';
import { formDb, paymentDb, authDb } from '../services/localDb';
import { emailService } from '../services/emailService';
import AuthModal from '../components/AuthModal';
import { ADS_ID } from '../components/Analytics';

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM"
];


const BookConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'consultant' | 'picker' | 'details' | 'success'>('consultant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<any | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  const getBusinessDays = (count: number) => {
    const dates = [];
    let current = new Date();
    while (dates.length < count) {
      if (current.getDay() !== 0) { // Skip Sundays
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getBusinessDays(14);


  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        let list = await formDb.getConsultants();
        if(!list || list.length === 0) {
            // Mock fallback if DB is empty for demo purposes
            list = [
                { id: "00000000-0000-0000-0000-000000000001", name: 'Nagendra M', specialty: 'General Tax & Corporate Law', base_fee: 1000 },
                { id: "00000000-0000-0000-0000-000000000002", name: 'Srinivas S', specialty: 'GST & Audit Expert', base_fee: 1500 }
            ];
        }
        setConsultants(list);
      } catch (e) {
         console.error(e);
      }
    };
    fetchConsultants();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if(!selectedConsultant) return;
      const start = dates[0].toISOString().split('T')[0];
      const end = dates[dates.length - 1].toISOString().split('T')[0];
      try {
        const slots = await formDb.getPublicBookedSlots(start, end, selectedConsultant.id);
        const map: Record<string, string[]> = {};
        slots.forEach((s: any) => {
          if (!map[s.booked_date]) map[s.booked_date] = [];
          map[s.booked_date].push(s.booked_time);
        });
        setBookedMap(map);
      } catch (err) {
        console.error("Failed to fetch slots", err);
      }
    };
    fetchSlots();
  }, [selectedConsultant]);

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];
  const isTimeBooked = (time: string) => {
    if (!selectedDate) return false;
    const key = getDateKey(selectedDate);
    return bookedMap[key]?.includes(time);
  };


  const scrollDates = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  const processPayment = async (amount: number, contact: any) => {
    // 1. Create Order AT THE SAME TIME as storing Pending DB entry to prevent race condition!
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          amount, 
          currency: 'INR',
          bookingDetails: {
              consultant_id: selectedConsultant?.id,
              date: getDateKey(selectedDate!),
              time: selectedTime,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              notes: contact.notes || "",
              user_id: authDb.getCurrentUser()?.id || null
          }
      })
    });
    
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initialize booking. Please try again.');
    }
    
    const order = await response.json();
    if (!order.id) throw new Error('Failed to create order');

    return new Promise((resolve, reject) => {
      if (!(window as any).Razorpay) {
        reject(new Error('Razorpay SDK failed to load. Please check your internet connection or disable ad-blockers.'));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "SN Associates & Co",
        description: `Consultation with ${selectedConsultant?.name}`,
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          // 2. Verify Payment & Confirm DB Status Together
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              is_booking: true // Tells server to upgrade status to confirmed
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === 'success') {
            resolve({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            });
          } else {
            reject(new Error('Payment verification failed! Please contact support.'));
          }
        },
        prefill: {
          name: contact.name,
          email: contact.email,
          contact: contact.phone
        },
        theme: {
          color: "#2563EB"
        },
        modal: {
            ondismiss: function() {
                reject(new Error("Payment cancelled."));
            }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        reject(new Error(response.error.description || 'Payment failed'));
      });
      rzp.open();
    });

  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedConsultant) return;

    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const notes = formData.get('notes') as string;
    const amount = Number(selectedConsultant.base_fee);

    // --- Validation Logic ---
    const errors: Record<string, string> = {};
    if (!name || name.trim().length < 3) errors.name = "Full name is required (min 3 chars)";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.email = "Please enter a valid email address";

    // Clean phone number: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    // If it starts with 91 and has 12 digits, strip the 91
    const finalPhone = (cleanPhone.length === 12 && cleanPhone.startsWith('91')) ? cleanPhone.slice(2) : cleanPhone;
    
    if (finalPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    setFormErrors({});
    // ------------------------

    try {

      // Step 1: Process Payment (This now safely interacts with server to lock slot FIRST)
      const paymentDetails: any = await processPayment(amount, { name, email, phone, notes });

      const currentUser = authDb.getCurrentUser();

      // Store Payment Log (Booking is already handled on server securely during processPayment!)
      await paymentDb.createPayment({
        userId: currentUser?.id, // Null if guest
        name, email, phone,
        serviceName: `Consultation - ${selectedConsultant.name}`,
        amount: amount,
        razorpayOrderId: paymentDetails.orderId,
        razorpayPaymentId: paymentDetails.paymentId,
        paymentStatus: 'success',
        createdAt: new Date().toISOString()
      });

      // Send Confirmation Email
      try {
        await emailService.sendNotification('Consultation Booking', {
          name,
          email,
          phone,
          amount,
          date: selectedDate?.toLocaleDateString(),
          time: selectedTime,
          service: `Consultation with ${selectedConsultant.name}`,
          notes,
          payment_id: paymentDetails.paymentId
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email", emailErr);
      }

      setStep('success');

      // Trigger Google Ads Conversion
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${ADS_ID}/booked_consultation`, // Replace 'booked_consultation' with your actual label
          'value': 1000.0,
          'currency': 'INR',
          'transaction_id': paymentDetails.paymentId
        });
      }

      // Step 3: Check Auth
      if (!currentUser) {
        setShowAuthModal(true);
      }
      // If logged in, they just see the success screen, and payment is already linked via userId above.

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => navigate('/login?redirect=/dashboard')}
        onRegister={() => navigate('/login?mode=register&redirect=/dashboard')}
      />

      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Book a Consultation</h1>
          <p className="text-slate-400 text-sm">Schedule a 1-on-1 expert session with our firm.</p>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {step === 'consultant' && (
            <div className="p-8 animate-fadeIn">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Users size={20} className="text-blue-600" /> 1. Select a Consultant</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultants.length === 0 ? (
                  <div className="col-span-full py-10 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : (
                  consultants.map((c) => (
                    <button 
                      key={c.id} 
                      onClick={() => setSelectedConsultant(c)}
                      className={`text-left p-6 rounded-2xl border-2 transition-all ${selectedConsultant?.id === c.id ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
                        <span className="bg-white text-blue-600 font-bold px-3 py-1 rounded-full border border-blue-100 text-sm shadow-sm">₹{c.base_fee}</span>
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-2"><Briefcase size={14} className="text-blue-400"/> {c.specialty}</p>
                    </button>
                  ))
                )}
              </div>
              <button 
                onClick={() => setStep('picker')} 
                disabled={!selectedConsultant} 
                className="mt-8 w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-5 rounded-2xl transition-all disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
              >
                Find Available Timings <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 'picker' && (
            <div className="p-8 animate-fadeIn">
              <button onClick={() => { setStep('consultant'); setSelectedDate(null); setSelectedTime(null); }} className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 mb-8 group"><ChevronLeft size={16} /> Back to consultants</button>
              
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><Calendar size={20} className="text-blue-600" /> 2. Choose a Date</h2>
                <p className="text-sm text-slate-500 mb-6 pl-7">Viewing availability for <strong>{selectedConsultant?.name}</strong></p>
                <div className="relative flex items-center px-6">
                  <button onClick={() => scrollDates('left')} className="absolute left-0 z-10 p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600 active:scale-95"><ChevronLeft size={20} /></button>
                  <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x w-full" style={{ scrollbarWidth: 'none' }}>
                    {dates.map((date, index) => {
                      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                      return (
                        <button key={index} onClick={() => { setSelectedDate(date); setSelectedTime(null); }} className={`flex-shrink-0 snap-start w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-xl font-bold mt-1">{date.getDate()}</span>
                          <span className="text-[10px] font-medium">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => scrollDates('right')} className="absolute right-0 z-10 p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600 active:scale-95"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="mb-10 min-h-[300px]">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock size={20} className="text-blue-600" /> 3. Select Time</h2>
                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                    <Calendar size={32} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">Please select a date first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fadeIn">
                    {timeSlots.map((time) => {
                      const isBooked = isTimeBooked(time);
                      const isSelected = selectedTime === time;
                      
                      // Check if time is in the past for today
                      let isPast = false;
                      if (selectedDate && selectedDate.toDateString() === new Date().toDateString()) {
                        const [t, modifier] = time.split(' ');
                        let [hours, minutes] = t.split(':').map(Number);
                        if (modifier === 'PM' && hours < 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;
                        
                        const slotTime = new Date();
                        slotTime.setHours(hours, minutes, 0, 0);
                        if (slotTime < new Date()) isPast = true;
                      }

                      const isDisabled = isBooked || isPast;

                      return (
                        <button 
                          key={time} 
                          disabled={isDisabled} 
                          onClick={() => setSelectedTime(time)} 
                          className={`relative py-4 px-2 rounded-xl text-sm font-bold border transition-all ${isDisabled ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 text-slate-600 bg-white hover:border-blue-400 hover:bg-blue-50/30'}`}
                        >
                          <span className={isDisabled ? 'line-through opacity-50' : ''}>{time}</span>
                          {isBooked ? (
                            <span className="text-[9px] uppercase text-red-400 font-black block">Reserved</span>
                          ) : isPast ? (
                            <span className="text-[9px] uppercase text-slate-400 font-black block">Passed</span>
                          ) : null}
                        </button>
                      );
                    })}

                  </div>
                )}
              </div>

              <button onClick={() => setStep('details')} disabled={!selectedDate || !selectedTime} className="w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-5 rounded-2xl transition-all disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-3">
                Continue to Details <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="p-8 animate-fadeIn">
              <button onClick={() => setStep('picker')} className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 mb-8 group"><ChevronLeft size={16} /> Back to slot picker</button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Details</h2>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Full Name *</label>
                  <input type="text" name="name" required className={`w-full p-4 bg-slate-50 border ${formErrors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none`} placeholder="John Doe" />
                  {formErrors.name && <p className="text-red-500 text-[10px] font-bold ml-1">{formErrors.name}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Email *</label>
                    <input type="email" name="email" required className={`w-full p-4 bg-slate-50 border ${formErrors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none`} placeholder="john@company.com" />
                    {formErrors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Phone *</label>
                    <input type="tel" name="phone" required className={`w-full p-4 bg-slate-50 border ${formErrors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none`} placeholder="+91" />
                    {formErrors.phone && <p className="text-red-500 text-[10px] font-bold ml-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Meeting Notes</label>
                  <textarea name="notes" rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Tell us what you'd like to discuss..."></textarea>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="text-sm text-blue-800 font-bold">Consultation Fee ({selectedConsultant?.name})</div>
                  <div className="text-xl font-black text-blue-600">₹{selectedConsultant?.base_fee || 1000}</div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
                  {isSubmitting ? <Loader2 size={24} className="animate-spin mx-auto" /> : `Pay ₹${selectedConsultant?.base_fee || 1000} & Confirm Appointment`}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[500px] animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce shadow-lg"><CheckCircle size={48} /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">Your appointment for <span className="font-bold text-slate-900">{selectedDate?.toLocaleDateString()} at {selectedTime}</span> has been confirmed.</p>
              <button onClick={() => navigate('/')} className="bg-slate-900 text-white font-bold px-10 py-4 rounded-full">Back to Home</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
