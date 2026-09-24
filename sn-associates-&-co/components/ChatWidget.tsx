
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, ArrowRight, PhoneCall, Calculator, Rocket, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface ActionLink {
  label: string;
  url: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  action?: ActionLink;
}

const QUICK_CHIPS = [
  { label: '🚀 Register Company', query: 'How do I register a new company or startup?', action: { label: 'Startup Services', url: '/services?filter=startups' } },
  { label: '🧮 Tax Calculator', query: 'Compare Old vs New Tax Regime', action: { label: 'Open Tax Calculator', url: '/resources' } },
  { label: '📞 Book Free Call', query: 'I would like to book a free 15-minute consultation', action: { label: 'Book Strategy Call', url: '/book-consultation' } },
  { label: '⚡ GST Filing', query: 'What are the requirements for GST registration and filing?', action: { label: 'GST Compliance', url: '/services' } }
];

const ChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Hello! I’m the SN Associates & Co Assistant. How can I help you with GST, ITR, Company Registration, Tax Planning, or Business Compliance today?',
      action: { label: 'Book 15-Min Free Call', url: '/book-consultation' }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendQuery = async (userMessage: string, customAction?: ActionLink) => {
    if (!userMessage.trim() || isLoading) return;

    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Provide immediate smart response if matched to a quick action
    if (customAction) {
      setTimeout(() => {
        let reply = "Here is what you need! You can check the details or book directly:";
        if (customAction.url.includes('book-consultation')) {
          reply = "Our senior CA team offers a complimentary 15-minute discovery consultation to discuss your business and tax needs.";
        } else if (customAction.url.includes('resources')) {
          reply = "You can use our interactive FY 2024-25 / 2025-26 Tax Regime Comparison Calculator and download free startup toolkits.";
        } else if (customAction.url.includes('startups')) {
          reply = "We offer end-to-end company formation (Pvt Ltd, LLP, OPC) with ROC name approval, DIN, DSC, and MOA/AOA drafted in 7–10 days.";
        } else {
          reply = "We take care of monthly GSTR-1, GSTR-3B, Input Tax Credit reconciliation, and annual GST audits with zero penalty guarantees.";
        }

        setMessages((prev) => [...prev, {
          role: 'model',
          text: reply,
          action: customAction
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const apiKey = process.env.API_KEY || (window as any).ENV_API_KEY || '';
      if (!apiKey) {
        setMessages((prev) => [...prev, {
          role: 'model',
          text: "Thanks for reaching out! You can schedule a direct consultation with our expert CAs or call us at +91 7406581456.",
          action: { label: 'Book Free Call Now', url: '/book-consultation' }
        }]);
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an expert AI assistant for "SN Associates & Co", a premier chartered accountant and tax consultancy firm in Bangalore. 
      You help with GST, ITR, Company Registration, Audits, and Legal compliance. 
      Keep answers professional, polite, and concise (under 3 sentences). Direct users to book a consultation for tailored financial advice.`;

      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: { systemInstruction }
      });

      setMessages((prev) => [...prev, {
        role: 'model',
        text: response.text || "I'm having trouble responding. Please reach out to our team at +91 7406581456.",
        action: { label: 'Schedule Consultation', url: '/book-consultation' }
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'model',
        text: "We're here to assist you. Book a free 15-minute consultation to speak directly with our team.",
        action: { label: 'Book Free Call', url: '/book-consultation' }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  const handleActionClick = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-[330px] sm:w-[380px] max-h-[540px] flex flex-col overflow-hidden mb-4 border border-slate-200 animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center border border-blue-400/40">
                <Bot size={18} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  SNA Smart Assistant
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400">Fast Tax & Compliance Guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition p-1"><X size={18} /></button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/70 space-y-3.5 min-h-[280px] max-h-[340px]">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-md' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-sm shadow-sm'
                }`}>
                  <p>{msg.text}</p>
                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action!.url)}
                      className="mt-2.5 w-full flex items-center justify-between gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-[11px] transition border border-blue-200/60 group"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-2.5 px-4 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-blue-600" />
                  <span className="text-[11px] text-slate-500">Checking with CA advisory...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Intent Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuery(chip.query, chip.action)}
                className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full transition border border-slate-200/60"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white flex gap-2">
            <input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask anything or book consultation..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-full transition shadow-md flex items-center justify-center shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle chat assistant"
        className="pointer-events-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative border-2 border-white/20"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition pointer-events-none hidden md:block">
              Chat with CA Assistant
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
