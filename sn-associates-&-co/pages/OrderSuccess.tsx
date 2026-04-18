
import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Order } from '../types';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order;

  useEffect(() => {
    if (!order) {
        navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle size={40} />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 mb-8">
              Thank you for your purchase. A confirmation email has been sent to <span className="font-bold text-slate-700">{order.userEmail}</span>.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-100">
              <div className="flex justify-between mb-2">
                  <span className="text-slate-500 text-sm">Order ID:</span>
                  <span className="font-mono text-slate-800 font-bold">{order.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                  <span className="text-slate-500 text-sm">Date:</span>
                  <span className="text-slate-800 font-medium">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-4">
                  <span className="text-slate-500 text-sm">Payment ID:</span>
                  <span className="font-mono text-slate-800 font-medium text-xs">{order.paymentId}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Amount</span>
                  <span className="font-bold text-xl text-purple-600">₹{order.totalAmount}</span>
              </div>
          </div>

          <div className="flex flex-col gap-3">
              <Link to="/my-learning" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow flex justify-center items-center gap-2">
                  Go to My Learning <ArrowRight size={18} />
              </Link>
              <button className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg transition flex justify-center items-center gap-2">
                  <Download size={18} /> Download Invoice
              </button>
          </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
