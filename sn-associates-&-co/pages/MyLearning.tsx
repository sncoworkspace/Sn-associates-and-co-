import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, SecurityLog, Product } from '../types';
import {
  Activity,
  Cloud,
  Eye,
  Download,
  BookOpen,
  Video,
  FileText,
  User as UserIcon,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Save,
  Calendar,
  Lock,
  X
} from 'lucide-react';
import { securityDb, productDb } from '../services/localDb';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

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
  const [activeTab, setActiveTab] = useState<'courses' | 'ebooks' | 'profile' | 'security'>('courses');
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Profile Edit States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
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
        console.error('Failed to fetch data', err);
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await authService.updateProfile(editName.trim(), editPhone.trim());
      if (res.success) {
        toast.success(res.message || 'Profile updated successfully!');
        if (res.user) setUser(res.user);
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (deleteConfirmation.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    setIsDeleting(true);
    try {
      const res = await authService.deleteAccount();
      if (res.success) {
        toast.success('Your profile and account have been deleted.');
        setShowDeleteModal(false);
        navigate('/');
      } else {
        toast.error(res.message || 'Failed to delete account');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  const purchasedCoursesList = purchasedProducts.filter(p => p.type !== 'E-Book');
  const purchasedEbooksList = purchasedProducts.filter(p => p.type === 'E-Book');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden animate-scaleIn">
            <div className="bg-red-600 text-white p-6 relative">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-red-200 hover:text-white p-1 rounded-lg transition"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle size={22} /> Delete Profile & Account
              </h3>
              <p className="text-xs text-red-100 mt-1">Permanent action cannot be undone</p>
            </div>
            <div className="p-6 space-y-4 text-slate-700 text-sm">
              <p className="font-semibold text-slate-900">
                Are you sure you want to permanently delete your account (<span className="text-blue-600 font-mono">{user.email}</span>)?
              </p>
              <div className="bg-red-50 p-4 rounded-xl text-xs text-red-800 space-y-1.5 border border-red-200">
                <p>• Your profile, phone number, and access credentials will be purged.</p>
                <p>• You will lose access to all active courses and downloadable resources.</p>
                <p>• Invoices and statutory tax audit records are archived as required by law.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Type <span className="text-red-600 font-mono">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={e => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  disabled={isDeleting || deleteConfirmation.trim().toUpperCase() !== 'DELETE'}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">Client Portal & Library</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <Cloud size={14} className={`text-green-400 ${isSyncing ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                  {isSyncing ? 'Syncing...' : 'Encrypted Client Session'}
                </span>
              </div>
            </div>
            <p className="text-slate-400">Welcome, <strong className="text-white">{user.name}</strong> ({user.email})</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 md:top-24 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Masterclass Courses ({purchasedCoursesList.length})
            </button>
            <button
              onClick={() => setActiveTab('ebooks')}
              className={`py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'ebooks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              E-Books & Guides ({purchasedEbooksList.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Profile & Account Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Security & Audit Logs
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab 1: Courses */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {loadingProducts ? (
              <div className="col-span-full py-20 text-center text-slate-400">Loading your library...</div>
            ) : purchasedCoursesList.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col group h-full">
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 text-base">{product.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                  <button onClick={() => navigate(`/product/${product.id}`)} className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors">
                    <Video size={16} /> Go to Course
                  </button>
                </div>
              </div>
            ))}
            {!loadingProducts && purchasedCoursesList.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <BookOpen size={44} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-700 font-bold mb-1">No enrolled courses yet.</p>
                <p className="text-slate-400 text-xs mb-5">Explore our professional tax and accounting masterclasses.</p>
                <button onClick={() => navigate('/store')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition">
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: E-Books & Guides */}
        {activeTab === 'ebooks' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {purchasedEbooksList.map(ebook => (
              <div key={ebook.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col group p-5">
                <div className="flex gap-4 items-start mb-4">
                  <img 
                    src={ebook.image} 
                    alt={ebook.title} 
                    className="w-20 h-28 object-cover rounded-xl shadow-sm shrink-0 bg-slate-100" 
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">Purchased E-Book</span>
                    <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-2">{ebook.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ebook.description}</p>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-100 flex gap-2">
                  <a
                    href={getDirectDriveLink(ebook.driveLink || '', 'download')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                  <a
                    href={getDirectDriveLink(ebook.driveLink || '', 'view')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Eye size={14} /> View
                  </a>
                </div>
              </div>
            ))}
            {purchasedEbooksList.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <FileText size={44} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-700 font-bold mb-1">No purchased e-books found.</p>
                <p className="text-slate-400 text-xs mb-5">Explore our curated business incorporation and compliance guides.</p>
                <button onClick={() => navigate('/resources')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition">
                  Explore E-Books
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile & Account Settings */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'SN'}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900">{user.name || 'Client Account'}</h2>
                  <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail size={14} /> {user.email}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle size={10} /> Verified
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      Role: {user.role || 'Client'}
                    </span>
                    {user.joinedAt && (
                      <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Calendar size={12} /> Member Since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSaveProfile} className="pt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Profile Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update your legal name and contact phone number.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                        placeholder="Your legal name"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <Lock size={12} /> Primary login email address cannot be changed for security.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 active:scale-95 disabled:bg-slate-400 cursor-pointer"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Profile Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone: Delete Profile */}
            <div className="bg-red-50/70 rounded-3xl border border-red-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <AlertTriangle size={20} />
                    <h3 className="font-bold text-base text-red-950">Delete Account & Profile</h3>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed max-w-xl">
                    Permanently delete your personal profile, credentials, enrolled courses, and download history. This action is irreversible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmation('');
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition shrink-0 shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Trash2 size={14} /> Delete Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security Logs */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={20} className="text-blue-600" /> Account Security & Access Logs</h3>
            <div className="space-y-3">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="p-3 border-b border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800">{log.action}</span>
                  <span className="text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
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
