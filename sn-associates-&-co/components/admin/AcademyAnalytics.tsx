
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, Download, Eye, Clock, Award, 
  ArrowUpRight, ArrowDownRight, Calendar, Filter
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AcademyAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalViews: 0,
    totalDownloads: 0,
    totalApplicants: 0,
    activeItems: 0
  });

  const fetchRealStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academy_assets')
        .select('type, total_views, total_downloads, total_applicants, created_at');

      if (error) throw error;

      if (data) {
        const views = data.reduce((acc, curr) => acc + (curr.total_views || 0), 0);
        const downloads = data.reduce((acc, curr) => acc + (curr.total_downloads || 0), 0);
        const applicants = data.reduce((acc, curr) => acc + (curr.total_applicants || 0), 0);
        
        setSummaryStats({
          totalViews: views,
          totalDownloads: downloads,
          totalApplicants: applicants,
          activeItems: data.length
        });

        // Basic aggregation for the chart (grouped by type for now as we don't have time-series history table yet)
        const types = ['ebook', 'course', 'internship'];
        const chartData = types.map(t => ({
          name: t.toUpperCase(),
          views: data.filter(a => a.type === t).reduce((acc, curr) => acc + (curr.total_views || 0), 0),
          downloads: data.filter(a => a.type === t).reduce((acc, curr) => acc + (curr.total_downloads || 0), 0),
          applicants: data.filter(a => a.type === t).reduce((acc, curr) => acc + (curr.total_applicants || 0), 0),
        }));
        setStatsData(chartData);
      }
    } catch (err: any) {
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealStats();
  }, [timeRange]);

  const stats = [
    { label: 'Total Engagement', value: summaryStats.totalViews.toLocaleString(), change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Asset Downloads', value: summaryStats.totalDownloads.toLocaleString(), change: '+8%', icon: Download, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Applications', value: summaryStats.totalApplicants.toLocaleString(), change: '+5%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Managed Assets', value: summaryStats.activeItems.toString(), change: 'Stable', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academy Insights</h1>
          <p className="text-slate-500 text-sm">Real-time performance tracking for all academy content.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          {['24h', '7d', '30d', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                timeRange === range 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" /> Weekly Engagement
            </h3>
            <button className="text-slate-400 hover:text-slate-600 transition"><Filter size={18} /></button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#f8fafc'}}
                  itemStyle={{fontWeight: 800, fontSize: 12}}
                />
                <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 mb-8">Asset Distribution</h3>
          <div className="flex-grow h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="views"
                  nameKey="name"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {statsData.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                  <span className="text-xs font-bold text-slate-700">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{entry.views.toLocaleString()} Views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAnalytics;
