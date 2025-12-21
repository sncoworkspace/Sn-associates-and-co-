
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ClientDocument, SecurityLog } from '../types';
import { courses } from '../data/courseData';
import { 
  PlayCircle, 
  FileText, 
  Upload, 
  Trash2, 
  HardDrive, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  Activity,
  ShieldAlert,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { authDb, documentDb, securityDb } from '../services/localDb';

const MyLearning: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'documents' | 'security'>('courses');
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const currentUser = authDb.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setDocs(documentDb.getDocuments(currentUser.id));
        setLogs(securityDb.getLogs(currentUser.id));
      } else {
        navigate('/login');
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    
    // Simulate real-time sync with Supabase
    const interval = setInterval(() => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    }, 15000);

    return () => {
        window.removeEventListener('storage', syncUser);
        clearInterval(interval);
    };
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    // Simulate upload delay
    setTimeout(() => {
      const docType = file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Excel';
      documentDb.uploadDocument(
        user.id, 
        file.name, 
        'GST', // Default category
        file.size,
        docType as any
      );
      setIsUploading(false);
    }, 1500);
  };

  const handleDeleteDoc = (id: string) => {
    if (user && window.confirm("Are you sure you want to delete this document?")) {
      documentDb.deleteDocument(user.id, id);
    }
  };

  if (!user) return null;

  const myCourses = courses.filter(c => user.purchasedCourses.includes(c.id));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
                            {isSyncing ? 'Syncing...' : 'Connected'}
                        </span>
                    </div>
                </div>
                <p className="text-slate-400">Manage your courses and compliance documents securely.</p>
             </div>
             
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Account Tier</p>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
                    <span className="text-sm font-bold text-blue-400">Enterprise Ready</span>
                </div>
             </div>
          </div>
       </div>

       {/* Tabs Navigation - Updated sticky top to align with refined 96px header height */}
       <div className="bg-white border-b border-slate-200 sticky top-16 md:top-24 z-20 shadow-sm transition-none">
          <div className="container mx-auto px-4">
             <div className="flex gap-8">
                <button 
                   onClick={() => setActiveTab('courses')}
                   className={`py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   My Courses ({myCourses.length})
                </button>
                <button 
                   onClick={() => setActiveTab('documents')}
                   className={`py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   Document Vault ({docs.length})
                </button>
                <button 
                   onClick={() => setActiveTab('security')}
                   className={`py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   Security & Access
                </button>
             </div>
          </div>
       </div>

       <div className="container mx-auto px-4 py-8">
          
          {/* --- COURSES TAB --- */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
                {myCourses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <PlayCircle size={48} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 mb-2">No active courses</h2>
                        <p className="text-slate-500 mb-6">Explore our store to start learning today.</p>
                        <button onClick={() => navigate('/store')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                            Browse Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {myCourses.map(course => (
                            <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer group">
                                <div className="h-40 bg-slate-200 relative">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <PlayCircle size={40} className="text-white" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900 line-clamp-2 h-10 mb-2">{course.title}</h3>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3">
                                        <div className="bg-blue-600 h-1.5 rounded-full w-[10%]"></div>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase flex justify-between">
                                        <span>Last Accessed: Today</span>
                                        <span className="text-blue-600">Resume</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {/* --- DOCUMENTS TAB --- */}
          {activeTab === 'documents' && (
            <div className="animate-fadeIn">
               {/* Document Actions */}
               <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                  <div className="relative flex-1 max-w-md">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search your documents..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div className="flex gap-3">
                     <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2">
                        {isUploading ? <><Clock className="animate-spin" size={18} /> Uploading...</> : <><Upload size={18} /> Upload Document</>}
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                     </label>
                  </div>
               </div>

               {/* Documents List */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-slate-600">
                     <ShieldCheck size={20} className="text-green-600" />
                     <span className="text-sm font-medium">Your data is encrypted and stored securely following ISO 27001 standards.</span>
                  </div>
                  
                  {docs.length === 0 ? (
                    <div className="p-16 text-center">
                       <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                       <h3 className="font-bold text-slate-800">No documents found</h3>
                       <p className="text-slate-500 text-sm mt-1">Upload your PAN, GST, or ITR records for easy access.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                          <thead>
                             <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-700">Document Name</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Category</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Size</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Date Uploaded</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                                <th className="px-6 py-4 text-right font-bold text-slate-700">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {docs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                         <div className={`p-2 rounded-lg ${doc.type === 'PDF' ? 'bg-red-50 text-red-600' : doc.type === 'Excel' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <FileText size={20} />
                                         </div>
                                         <div>
                                            <p className="font-bold text-slate-900">{doc.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{doc.type}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold">{doc.category}</span>
                                   </td>
                                   <td className="px-6 py-4 text-slate-600">{formatSize(doc.size)}</td>
                                   <td className="px-6 py-4 text-slate-600">
                                      <div className="flex items-center gap-1">
                                         <Calendar size={14} className="text-slate-400" />
                                         {new Date(doc.uploadedAt).toLocaleDateString()}
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                         doc.status === 'verified' ? 'bg-green-100 text-green-700' : 
                                         doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                         'bg-amber-100 text-amber-700'
                                      }`}>
                                         {doc.status === 'pending' && <Clock size={10} />}
                                         {doc.status === 'verified' && <CheckCircle2 size={10} />}
                                         {doc.status === 'rejected' && <AlertCircle size={10} />}
                                         {doc.status}
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      <button 
                                         onClick={() => handleDeleteDoc(doc.id)}
                                         className="p-2 text-slate-400 hover:text-red-600 transition"
                                      >
                                         <Trash2 size={18} />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* --- SECURITY TAB --- */}
          {activeTab === 'security' && (
            <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Activity size={20} className="text-blue-600" /> Access Logs
                        </h3>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500 uppercase">Last 50 Events</span>
                     </div>
                     <div className="divide-y divide-slate-50">
                        {logs.length === 0 ? (
                           <div className="p-12 text-center text-slate-400 italic">No security events recorded.</div>
                        ) : (
                           logs.map(log => (
                              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-green-50 text-green-600' : log.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                       {log.status === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">IP: {log.ipAddress}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
                     <ShieldCheck className="text-blue-400 mb-4" size={32} />
                     <h3 className="font-bold text-lg mb-2">Supabase Cloud Security</h3>
                     <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        Your account is protected by PostgreSQL Row-Level Security (RLS) policies. Only you can access your private documents.
                     </p>
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                           <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div> End-to-End Encryption
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                           <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div> ISO 27001 Certified
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4">Account Settings</h3>
                     <div className="space-y-4">
                        <button className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition flex items-center justify-between group">
                           <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">Change Password</span>
                           <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition flex items-center justify-between group">
                           <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">Enable 2FA</span>
                           <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">Coming Soon</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

       </div>
    </div>
  );
};

// Internal icon replacement for the button
const ArrowRight = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
);

export default MyLearning;
