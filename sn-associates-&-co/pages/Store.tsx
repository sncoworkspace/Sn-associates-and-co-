import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, Briefcase, Star, ArrowRight, Loader2 } from 'lucide-react';
import { getProductImageUrl, handleImageError } from '../utils/imageAssets';
import { Link } from 'react-router-dom';
import { productDb } from '../services/localDb';
import { Product } from '../types';

const Store: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'E-Book' | 'Course'>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await productDb.getAll();
        setProducts(data);
      } catch (e) {
        console.error("Store error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.type.toLowerCase() === (filter === 'E-Book' ? 'ebook' : filter.toLowerCase()));

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Professional Academy Store</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Certified courses and expert e-books for tax, compliance, and legal mastery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 inline-flex flex-wrap justify-center gap-1">
            {['All', 'E-Book', 'Course', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === type
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Accessing Library...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full shadow-sm"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={getProductImageUrl(product.id, product.title, product.image)} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => handleImageError(e, product.title, product.id)}
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[9px] font-black uppercase shadow-lg text-white ${
                    product.type.toLowerCase().includes('course') ? 'bg-purple-600' : 
                    product.type.toLowerCase().includes('ebook') ? 'bg-green-600' : 'bg-amber-600'
                  }`}>
                    {product.type}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2 leading-tight h-10">{product.title}</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">{product.author}</p>

                  <div className="flex items-center gap-1 mb-4">
                    <span className="font-bold text-amber-500 text-xs">{product.rating || '5.0'}</span>
                    <div className="flex text-amber-400">
                      <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-slate-400">({product.students || 0} Learners)</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold">No products available in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
