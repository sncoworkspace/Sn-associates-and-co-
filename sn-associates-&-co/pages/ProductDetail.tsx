
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productDb, cartDb } from '../services/localDb';
import { Product } from '../types';
import { Star, Globe, AlertCircle, Check, PlayCircle, FileText, Lock, ShieldCheck, ShoppingCart, Video, CheckCircle, Loader2, Layout } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;
        try {
            const data = await productDb.getById(id);
            setProduct(data);
        } catch (e) {
            console.error("Detail error", e);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
  );

  if (!product) return <div className="p-20 text-center font-bold">Product not found in SNA Library.</div>;

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
      {showToast && (
          <div className="fixed top-24 right-4 z-[100] bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-white/10">
              <CheckCircle className="text-green-400" size={20} />
              <div>
                  <h4 className="font-bold text-sm">Added to Cart</h4>
                  <p className="text-xs text-slate-400 truncate max-w-[150px]">{product.title}</p>
              </div>
              <button onClick={() => navigate('/cart')} className="ml-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Cart
              </button>
          </div>
      )}

      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 relative z-10">
          <div className="md:w-2/3 pr-0 md:pr-12">
            <div className="text-blue-300 text-xs font-bold mb-4 flex gap-2 items-center uppercase tracking-widest">
              <Link to="/store" className="hover:underline">Academy Store</Link> <span>/</span>
              <span className="text-blue-100">{product.type}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-serif">{product.title}</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">{product.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm mb-10">
              <div className="flex items-center gap-2 text-amber-400 font-black">
                 <span className="text-lg">{product.rating}</span>
                 <div className="flex"><Star size={18} fill="currentColor" /></div>
              </div>
              <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-blue-100">
                {product.students} Global Learners
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                 <span className="text-blue-400">By {product.author}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-2"><AlertCircle size={14} className="text-blue-400" /> Updated {product.updatedDate}</span>
               <span className="flex items-center gap-2"><Globe size={14} className="text-blue-400" /> {product.language}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 relative">
        <div className="md:w-2/3">
           <div className="border border-slate-200 p-8 rounded-[2rem] mb-12 bg-slate-50/50 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Path Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-slate-700">
                       <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                       <span className="text-sm font-medium">{feature}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Syllabus & Curriculum</h2>
              <div className="space-y-4">
                 {product.content.map((section: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                       <div className="bg-slate-50 p-5 font-bold text-slate-800 flex justify-between items-center">
                          <span className="flex items-center gap-3"><Layout size={20} className="text-blue-600" /> {section.title}</span>
                          <span className="text-[10px] font-black uppercase text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{section.items?.length || 0} Topics</span>
                       </div>
                       <div className="bg-white">
                          {section.items?.map((item: string, i: number) => (
                             <div key={i} className="p-4 pl-12 flex items-center justify-between hover:bg-slate-50 border-t border-slate-100 first:border-0 transition-colors">
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                   {product.type === 'Course' ? <Video size={16} className="text-purple-500" /> : <FileText size={16} className="text-green-500" />}
                                   <span className="font-medium">{item}</span>
                                </div>
                                {idx === 0 && i === 0 ? (
                                   <span className="text-[10px] text-blue-600 font-black uppercase bg-blue-50 px-2 py-0.5 rounded">Preview</span>
                                ) : (
                                   <Lock size={14} className="text-slate-300" />
                                )}
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="md:w-1/3 relative">
           <div className="sticky top-24 bg-white shadow-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden group">
              <div className="h-56 bg-slate-900 relative cursor-pointer overflow-hidden">
                 <img src={product.image} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition active:scale-95">
                       <PlayCircle size={32} className="text-slate-900 ml-1" />
                    </div>
                 </div>
                 <div className="absolute bottom-6 left-0 right-0 text-center font-black text-white text-xs uppercase tracking-widest drop-shadow-lg">Watch Promo</div>
              </div>

              <div className="p-8">
                 <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-black text-slate-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="text-xl text-slate-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% SAVING
                            </span>
                        </>
                    )}
                 </div>

                 <div className="flex flex-col gap-4 mb-8">
                    <button onClick={handleBuyNow} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl text-lg transition shadow-xl shadow-slate-900/10 active:scale-95">
                       Unlock Immediate Access
                    </button>
                    <button onClick={handleAddToCart} className="w-full bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 active:scale-95">
                       <ShoppingCart size={20} /> Add to Collection
                    </button>
                 </div>
                 
                 <div className="space-y-4 py-6 border-t border-slate-100 text-sm text-slate-600 font-medium">
                    <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Technical Specification:</p>
                    <div className="flex items-center gap-3"><Video size={18} className="text-blue-600" /> {product.type === 'Course' ? 'HD Video Content' : 'Printable E-Book Asset'}</div>
                    <div className="flex items-center gap-3"><FileText size={18} className="text-blue-600" /> Full Perpetual License</div>
                    <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-blue-600" /> Official SNA Certificate</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
