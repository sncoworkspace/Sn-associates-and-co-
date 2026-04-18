
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, SecurityLog, Product } from '../types';
import {
  ShieldCheck,
  Activity,
  Cloud,
  Eye,
  Download,
  BookOpen,
  Video,
  FileText
} from 'lucide-react';
import { securityDb, productDb } from '../services/localDb';
import { authService } from '../services/authService';

const getDirectDriveLink = (url: string, type: 'image' | 'view' | 'download' = 'view') => {
  if (!url) return '';
  const regex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|d\/)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(regex);
  if (!match) return url;
  const fileId = match[1];
  if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
  if (type === 'download') return `https://drive.google.com/uc?export=download&id=${fileId}`;
  return `https://drive.google.com/file/d/${fileId}/view`;
};

const MyLearning: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'security'>('courses');
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchData = useCallback(async () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsSyncing(true);
      try {
        const [userLogs, allProducts] = await Promise.all([
          securityDb.getLogs(currentUser.id),
          productDb.getAll()
        ]);
        setLogs(userLogs);

        // Filter products that the user has purchased
        const userProducts = allProducts.filter(p => currentUser.purchasedCourses.includes(p.id));
        setPurchasedProducts(userProducts);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsSyncing(false);
        setLoadingProducts(false);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();

    // Listen for storage changes (triggered when checkout completes and updates user in localStorage)
    const handleStorageChange = () => {
      fetchData();
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(fetchData, 30000); // Sync every 30s

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchData]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">Client Portal</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <Cloud size={14} className={`text-green-400 ${isSyncing ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                  {isSyncing ? 'Syncing Supabase...' : 'Connected'}
                </span>
              </div>
            </div>
            <p className="text-slate-400">Manage your secure SNA cloud resources.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 sticky top-16 md:top-24 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {['courses', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 font-bold text-sm border-b-2 transition-all capitalize ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab === 'courses' ? `My Library (${purchasedProducts.length})` : 'Security & Access'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {loadingProducts ? (
              <div className="col-span-full py-20 text-center text-slate-400">Loading your library...</div>
            ) : purchasedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col group h-full">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase text-white ${product.type === 'E-Book' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                      {product.type}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 text-lg">{product.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{product.description}</p>

                  <div className="mt-auto space-y-3">
                    {product.type === 'E-Book' ? (
                      <div className="flex gap-2">
                        {product.driveLink && (
                          <>
                            <a
                              href={getDirectDriveLink(product.driveLink, 'view')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                            >
                              <Eye size={16} /> View
                            </a>
                            <a
                              href={getDirectDriveLink(product.driveLink, 'download')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-slate-900 text-white hover:bg-slate-800 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                            >
                              <Download size={16} /> Download
                            </a>
                          </>
                        )}
                        {!product.driveLink && (
                          <div className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-lg text-xs font-bold text-center">
                            Content Coming Soon
                          </div>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => navigate(`/product/${product.id}`)} className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors">
                        <Video size={16} /> Go to Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!loadingProducts && purchasedProducts.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium mb-2">You haven't purchased any items yet.</p>
                <p className="text-slate-400 text-sm mb-6">Explore our store to find courses and e-books.</p>
                <button onClick={() => navigate('/store')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                  Browse Store
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={20} /> Access Logs</h3>
            <div className="space-y-3">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="p-3 border-b flex justify-between">
                  <span className="text-sm font-medium">{log.action}</span>
                  <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400 text-sm">No recent activity logs found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
