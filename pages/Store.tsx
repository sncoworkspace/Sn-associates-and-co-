import React, { useState } from 'react';
import { BookOpen, Video, Star, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courseData';

const Store: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'E-Book' | 'Course'>('All');

  const filteredProducts = filter === 'All' 
    ? courses 
    : courses.filter(p => p.type === filter);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Learning Store</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Master Taxation, Law, and Compliance with our premium E-Books and Video Courses.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 inline-flex">
            {['All', 'E-Book', 'Course'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === type 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link 
              to={`/product/${product.id}`}
              key={product.id} 
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {product.rating > 4.7 && (
                   <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase">
                      Bestseller
                   </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2 leading-tight h-10">
                  {product.title}
                </h3>
                
                <p className="text-xs text-slate-500 mb-2 truncate">
                  {product.author}
                </p>

                <div className="flex items-center gap-1 mb-2">
                   <span className="font-bold text-amber-500 text-sm">{product.rating}</span>
                   <div className="flex text-amber-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                     ))}
                   </div>
                   <span className="text-xs text-slate-400">({product.students})</span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                   <div>
                     <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                     <span className="text-xs text-slate-400 line-through ml-2">₹{product.originalPrice}</span>
                   </div>
                   <div className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;