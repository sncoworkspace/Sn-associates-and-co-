
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from '../data/courseData';
import { Star, Globe, AlertCircle, Check, PlayCircle, FileText, Lock, ShieldCheck, ShoppingCart, Video, CheckCircle } from 'lucide-react';
import { cartDb } from '../services/localDb';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  
  const product = courses.find(c => c.id === id);

  if (!product) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  const handleBuyNow = () => {
    cartDb.addToCart(product);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    cartDb.addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Toast Notification */}
      {showToast && (
          <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="text-green-400" size={20} />
              <div>
                  <h4 className="font-bold text-sm">Added to Cart</h4>
                  <p className="text-xs text-slate-400">{product.title}</p>
              </div>
              <button onClick={() => navigate('/cart')} className="ml-4 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded hover:bg-slate-100">
                  View Cart
              </button>
          </div>
      )}

      {/* Dark Hero Section */}
      <div className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 relative z-10">
          <div className="md:w-2/3 pr-0 md:pr-12">
            {/* Breadcrumbs */}
            <div className="text-blue-300 text-sm font-bold mb-4 flex gap-2">
              <Link to="/store" className="hover:underline">Store</Link> {'>'}
              <span className="text-blue-100">{product.type}s</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.title}</h1>
            <p className="text-lg text-slate-300 mb-6">{product.description}</p>
            
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1">
                 <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold text-xs">Bestseller</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                 <span>{product.rating}</span>
                 <div className="flex"><Star size={14} fill="currentColor" /></div>
              </div>
              <div className="text-blue-200">
                ({product.students} students)
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-300">
               <span className="flex items-center gap-1">Created by <span className="text-blue-400 underline">{product.author}</span></span>
               <span className="flex items-center gap-1"><AlertCircle size={14} /> Last updated {product.updatedDate}</span>
               <span className="flex items-center gap-1"><Globe size={14} /> {product.language}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 relative">
        
        {/* Left Column: Content */}
        <div className="md:w-2/3">
           
           {/* What you'll learn */}
           <div className="border border-slate-200 p-6 rounded-lg mb-8 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                       <Check size={18} className="text-slate-900 shrink-0" />
                       <span>{feature}</span>
                    </div>
                 ))}
                 <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={18} className="text-slate-900 shrink-0" />
                    <span>Complete understanding of compliance requirements</span>
                 </div>
                 <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={18} className="text-slate-900 shrink-0" />
                    <span>Practical application in real-world scenarios</span>
                 </div>
              </div>
           </div>

           {/* Course Content Accordion */}
           <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                 {product.content.map((section, idx) => (
                    <div key={idx} className="border-b border-slate-200 last:border-0">
                       <div className="bg-slate-50 p-4 font-bold text-slate-800 flex justify-between cursor-pointer hover:bg-slate-100">
                          <span>{section.title}</span>
                          <span className="text-xs font-normal text-slate-500">{section.items.length} lectures</span>
                       </div>
                       <div className="bg-white">
                          {section.items.map((item, i) => (
                             <div key={i} className="p-3 pl-6 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                   {product.type === 'Course' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                   {item}
                                </div>
                                {idx === 0 && i === 0 ? (
                                   <span className="text-xs text-blue-600 font-bold cursor-pointer">Preview</span>
                                ) : (
                                   <Lock size={14} className="text-slate-400" />
                                )}
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Instructor */}
           <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Instructor</h2>
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=200" alt="Instructor" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 text-lg underline text-blue-700">{product.author}</h3>
                    <p className="text-sm text-slate-500 mb-2">Senior Auditor & Legal Consultant</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                       With over 10 years of experience in Taxation and Corporate Law, {product.author} has helped thousands of businesses navigate the complex Indian regulatory landscape.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Sticky Card (Desktop) */}
        <div className="md:w-1/3 relative">
           <div className="sticky top-24 bg-white shadow-xl border border-slate-200 rounded-lg overflow-hidden">
              {/* Preview Image/Video */}
              <div className="h-48 bg-slate-900 relative group cursor-pointer">
                 <img src={product.image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                       <PlayCircle size={32} className="text-slate-900 ml-1" />
                    </div>
                 </div>
                 <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-white drop-shadow-md">Preview this course</div>
              </div>

              <div className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
                    <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-green-600">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                 </div>

                 <div className="flex flex-col gap-3 mb-6">
                    <button 
                      onClick={handleBuyNow}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded text-lg transition shadow"
                    >
                       Buy Now
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-white border border-slate-900 hover:bg-slate-50 text-slate-900 font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                       <ShoppingCart size={18} /> Add to Cart
                    </button>
                 </div>
                 
                 <div className="text-center text-xs text-slate-500 mb-4">
                    30-Day Money-Back Guarantee
                 </div>

                 <div className="space-y-3 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">This course includes:</p>
                    <div className="flex items-center gap-3"><Video size={16} className="text-slate-900" /> {product.type === 'Course' ? '10 hours video' : 'Downloadable PDF'}</div>
                    <div className="flex items-center gap-3"><FileText size={16} className="text-slate-900" /> Full lifetime access</div>
                    <div className="flex items-center gap-3"><Globe size={16} className="text-slate-900" /> Access on mobile and TV</div>
                    <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-slate-900" /> Certificate of completion</div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
