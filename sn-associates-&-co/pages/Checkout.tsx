
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Lock, CreditCard, Loader2, ShieldCheck, Check, Smartphone, Info } from 'lucide-react';
import { cartDb, authDb, orderDb } from '../services/localDb';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showRazorpayModal, setShowRazorpayModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');

    const user = authDb.getCurrentUser();

    useEffect(() => {
        const items = cartDb.getCart();
        if (items.length > 0) {
            setCartItems(items);
        } else {
            navigate('/store');
        }
    }, [navigate]);

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const processRazorpayPayment = async (amount: number) => {
        try {
            setLoading(true);
            // 1. Create Order
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR' })
            });
            const order = await response.json();

            if (!order.id) throw new Error('Failed to create order');

            return new Promise((resolve, reject) => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "SN Associates & Co",
                    description: "Course Purchase",
                    image: "/logo-base.png",
                    order_id: order.id,
                    handler: async function (response: any) {
                        // 2. Verify Payment
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.status === 'success') {
                            resolve({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id
                            });
                        } else {
                            reject(new Error('Payment verification failed'));
                        }
                    },
                    prefill: {
                        name: user!.name,
                        email: user!.email,
                        contact: user!.phone || ''
                    },
                    theme: {
                        color: "#1e40af"
                    }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    reject(new Error(response.error.description));
                });
                rzp.open();
            });
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async () => {
        if (!user) {
            toast.error("Please log in to continue with checkout");
            return;
        }

        try {
            const paymentDetails: any = await processRazorpayPayment(total);
            await completeOrder(paymentDetails.paymentId);
        } catch (error: any) {
            console.error("Payment failed", error);
            toast.error(error.message || "Payment process interrupted");
        }
    };

    const completeOrder = async (paymentId: string) => {
        try {
            // Must await order creation because it hits Supabase and updates local storage
            const newOrder = await orderDb.createOrder(user!.id, cartItems, total, paymentId);
            cartDb.clearCart();
            toast.success("Purchase Complete!");

            // Delay navigation slightly to let the success animation be seen
            setTimeout(() => {
                navigate('/order-success', { state: { order: newOrder } });
            }, 800);
        } catch (error) {
            console.error("Order processing failed", error);
            toast.error("An error occurred during finalization. Please contact support.");
        }
    };

    if (cartItems.length === 0) return null;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Secure Checkout</h1>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Order Summary */}
                    <div className="flex-1 space-y-6">
                        {!user && (
                            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition">
                                    <Lock size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-2">Identification Required</h2>
                                    <p className="text-blue-100 text-sm mb-6 max-w-sm">
                                        To ensure your course access is secured, please identify yourself before payment.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => navigate('/login?flow=checkout')}
                                            className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl border border-white hover:bg-blue-50 transition active:scale-95 shadow-lg"
                                        >
                                            Login with Credentials
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 text-slate-800">Review Items</h2>
                            <div className="space-y-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-sm text-slate-900 leading-tight">{item.title}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                                        </div>
                                        <span className="font-bold text-slate-700">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 text-slate-800">Billing Address</h2>
                            {user ? (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Standard Digital License</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                                    <Info size={18} />
                                    <p className="text-xs font-medium">Please sign in to confirm your billing details.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checkout Sidebar */}
                    <div className="md:w-1/3">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-24">
                            <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Payment Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Course Value</span>
                                    <span>₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 font-bold">
                                    <span>SNA Discount</span>
                                    <span>-₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0) - total}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total Payable</span>
                                    <span className="font-black text-2xl text-blue-700">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={initiatePayment}
                                disabled={!user}
                                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-slate-900/10 transition-all flex justify-center items-center gap-2 active:scale-95"
                            >
                                <ShieldCheck size={20} /> Checkout with Razorpay
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2">
                                <img src="https://image2url.com/images/1764923101234-a1b2c3d4.png" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                                <img src="https://image2url.com/images/1764923105678-b2c3d4e5.png" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                                <img src="https://image2url.com/images/1764923110987-c3d4e5f6.png" alt="UPI" className="h-4 opacity-50 grayscale hover:grayscale-0 transition cursor-default" />
                            </div>

                            <p className="text-center text-[10px] text-slate-400 mt-6 flex justify-center items-center gap-1">
                                <Lock size={10} /> 256-bit SSL Secure Payment Gateway
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Checkout;
