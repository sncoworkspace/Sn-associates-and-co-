
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartDb } from '../services/localDb';
import { Product } from '../types';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial load
    setCartItems(cartDb.getCart());

    // Listen for updates
    const handleStorageChange = () => {
        setCartItems(cartDb.getCart());
    };
    
    window.addEventListener('cart-updated', handleStorageChange);
    return () => window.removeEventListener('cart-updated', handleStorageChange);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const removeItem = (id: string) => {
    cartDb.removeFromCart(id);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
                <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-6">Looks like you haven't added any courses yet.</p>
                <Link to="/store" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                    Keep Shopping
                </Link>
            </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-4">
                    <p className="font-bold text-slate-700">{cartItems.length} Course{cartItems.length > 1 ? 's' : ''} in Cart</p>
                    {cartItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 flex gap-4 items-start shadow-sm">
                            <Link to={`/product/${item.id}`} className="w-24 h-16 bg-slate-200 rounded overflow-hidden shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </Link>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900 line-clamp-2 pr-4">{item.title}</h3>
                                    <span className="font-bold text-purple-700">₹{item.price}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{item.author}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {item.rating} ★
                                    </span>
                                    <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-700 mb-4">Total:</h2>
                        <div className="text-4xl font-bold text-slate-900 mb-2">₹{total}</div>
                        <p className="text-slate-500 text-sm mb-6 line-through">₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0)}</p>
                        
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition flex justify-center items-center gap-2"
                        >
                            Checkout <ArrowRight size={20} />
                        </button>

                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-bold">₹{total}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Discount</span>
                                <span className="font-bold text-green-600">-₹{cartItems.reduce((sum, i) => sum + i.originalPrice, 0) - total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
