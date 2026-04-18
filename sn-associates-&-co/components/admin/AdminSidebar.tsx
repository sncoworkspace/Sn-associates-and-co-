
import React from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, MessageSquare, FileText, 
  ShieldAlert, BookOpen, GraduationCap, Briefcase, Settings, LogOut, ChevronRight, Package
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuGroups = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'orders', label: 'Order History', icon: ShoppingBag },
      ]
    },
    {
      title: 'Academy Control',
      items: [
        { id: 'academy-library', label: 'Asset Library', icon: BookOpen },
        { id: 'academy-analytics', label: 'Engagement Stats', icon: GraduationCap },
        { id: 'internships', label: 'Internships', icon: Briefcase },
      ]
    },
    {
      title: 'Content & Tools',
      items: [
        { id: 'blogs', label: 'Blog Posts', icon: FileText },
        { id: 'forms', label: 'Inquiries', icon: MessageSquare },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'resources', label: 'Resources', icon: Package },
        { id: 'logs', label: 'Security Logs', icon: ShieldAlert },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-800 shadow-xl overflow-y-auto">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg tracking-tight">Admin CMS</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">SN Associates</span>
        </div>
      </div>

      <div className="flex-grow py-4 px-3 space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{group.title}</h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-300"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
