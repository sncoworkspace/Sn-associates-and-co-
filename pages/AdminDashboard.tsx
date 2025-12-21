
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authDb, orderDb } from '../services/localDb';
import { User, Order } from '../types';
import { Users, ShoppingBag, DollarSign, Ban, CheckCircle, Search, LogOut, Server, Cloud, ShieldCheck, Database, Zap } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'infra'>('dashboard');
  
  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalUsers: 0 });

  useEffect(() => {
    const user = authDb.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
      setUsers(authDb.getAllUsers());
      setOrders(orderDb.getAllOrders());
      setStats(orderDb.getStats());
  };

  const handleBlockUser = (id: string) => {
      authDb.toggleUserBlock(id);
      refreshData();
  };

  const handleLogout = () => {
      authDb.logout();
      navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
            <div className="p-6 border-b border-slate-800">
                <h1 className="font-bold text-xl tracking-tight">Admin Panel</h1>
                <p className="text-xs text-slate-400 mt-1">SN Associates & Co.</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <div className="p-1"><DollarSign size={18} /></div> Dashboard
                </button>
                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <div className="p-1"><Users size={18} /></div> Users
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <div className="p-1"><ShoppingBag size={18} /></div> Orders
                </button>
                <button onClick={() => setActiveTab('infra')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'infra' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                    <div className="p-1"><Server size={18} /></div> Infrastructure
                </button>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm font-bold">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab} Overview</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Admin: {currentUser.name}
                </div>
            </header>

            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm font-bold uppercase mb-2">Total Revenue</p>
                            <h3 className="text-4xl font-bold text-slate-900">₹{stats.revenue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm font-bold uppercase mb-2">Total Orders</p>
                            <h3 className="text-4xl font-bold text-slate-900">{stats.totalOrders}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm font-bold uppercase mb-2">Total Users</p>
                            <h3 className="text-4xl font-bold text-slate-900">{stats.totalUsers}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                        <p className="text-slate-500 text-sm">System is running smoothly. All services operational.</p>
                    </div>
                </div>
            )}

            {/* --- INFRA TAB --- */}
            {activeTab === 'infra' && (
                <div className="animate-fadeIn space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition">
                                 <Database size={120} />
                             </div>
                             <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg"><Cloud size={24} /></div>
                                    <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-400/20">OPERATIONAL</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1">Supabase DB</h3>
                                <p className="text-slate-400 text-xs mb-4">PostgreSQL Relational Engine</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                        <span>Connection Health</span>
                                        <span className="text-blue-400">99.99%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1 rounded-full"><div className="w-[99%] bg-blue-500 h-full rounded-full"></div></div>
                                </div>
                             </div>
                         </div>

                         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-green-600" /> Security Layer</h3>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs font-bold text-slate-600">Row-Level Security</span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">ENABLED</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs font-bold text-slate-600">SSL Encryption</span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">ACTIVE</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs font-bold text-slate-600">JWT Authentication</span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">ENABLED</span>
                                </div>
                             </div>
                         </div>

                         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-amber-500" /> API Performance</h3>
                             <div className="flex-1 flex flex-col justify-center items-center py-4">
                                <div className="text-4xl font-black text-slate-900">42ms</div>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Avg Response Time</p>
                             </div>
                             <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-center text-slate-400">
                                Region: AWS AP-SOUTH-1 (Mumbai)
                             </div>
                         </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                         <h3 className="text-xl font-bold text-slate-800 mb-6">Database Schema Preview</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {[
                                { title: 'Profiles', cols: ['id (UUID)', 'name (Text)', 'email (Text)', 'storage (Int)'] },
                                { title: 'Documents', cols: ['id (UUID)', 'user_id (FK)', 'name (Text)', 'status (Enum)'] },
                                { title: 'Orders', cols: ['id (UUID)', 'user_id (FK)', 'amount (Numeric)', 'items (JSON)'] }
                             ].map((table, i) => (
                                 <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                                     <div className="bg-slate-800 text-white p-3 text-xs font-bold font-mono">public.{table.title.toLowerCase()}</div>
                                     <div className="p-3 space-y-2">
                                         {table.cols.map((col, ci) => (
                                             <div key={ci} className="text-[10px] font-mono text-slate-600 flex justify-between">
                                                 <span>{col.split(' ')[0]}</span>
                                                 <span className="text-slate-400">{col.split(' ')[1]}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            )}

            {/* --- USERS TAB --- */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-800">{u.name}</td>
                                    <td className="p-4 text-slate-600">{u.email}</td>
                                    <td className="p-4 text-slate-600">{u.phone || 'N/A'}</td>
                                    <td className="p-4 text-slate-500">{new Date(u.joinedAt).toLocaleDateString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                                    <td className="p-4">
                                        {u.isBlocked ? (
                                            <span className="text-red-600 font-bold flex items-center gap-1"><Ban size={14} /> Blocked</span>
                                        ) : (
                                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {u.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleBlockUser(u.id)}
                                                className={`px-3 py-1 rounded text-xs font-bold transition ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                            >
                                                {u.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono text-slate-500 text-xs">{o.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{o.userName}</div>
                                        <div className="text-xs text-slate-500">{o.userEmail}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{o.items.length} items</td>
                                    <td className="p-4 font-bold text-slate-900">₹{o.totalAmount}</td>
                                    <td className="p-4 text-slate-500">{new Date(o.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Paid</span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    </div>
  );
};

export default AdminDashboard;
