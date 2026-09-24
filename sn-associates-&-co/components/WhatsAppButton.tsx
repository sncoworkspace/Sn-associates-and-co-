import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  // Primary contact number
  const phoneNumber = "917406581456";
  const message = encodeURIComponent("Hello, I would like to know more about your services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" className="text-green-500" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold whitespace-nowrap">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;