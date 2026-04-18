
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Filter, BookOpen, GraduationCap, Briefcase, 
  MoreVertical, Eye, Download, Users, Trash2, Edit, ExternalLink,
  CheckCircle, Clock, AlertCircle, FileJson, History, X, Loader2, Upload,
  Video, PlayCircle, ShoppingBag
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../services/supabase';

interface AcademyAsset {
  id?: string;
  title: string;
  type: 'ebook' | 'course' | 'internship';
  category: string;
  description: string;
  image_url: string;
  amount: number;
  drive_link: string;
  youtube_link?: string;
  status: 'published' | 'draft';
  total_views: number;
  total_downloads: number;
  total_applicants: number;
  metadata: any;
  created_at?: string;
}

interface AssetLibraryProps {
  typeFilter?: 'ebook' | 'course' | 'internship' | 'all';
  hideHeader?: boolean;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ typeFilter = 'all', hideHeader = false }) => {
  const [assets, setAssets] = useState<AcademyAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>(typeFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AcademyAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const [formData, setFormData] = useState<Partial<AcademyAsset>>({
    title: '',
    type: 'course',
    category: '',
    description: '',
    image_url: '',
    drive_link: '',
    youtube_link: '',
    amount: 0,
    status: 'published',
    metadata: {}
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      let query = supabase.from('academy_assets').select('*').order('created_at', { ascending: false });
      
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setAssets(data || []);
    } catch (err: any) {
      toast.error('Failed to load assets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filterType]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingAsset?.id) {
        const { error } = await supabase
          .from('academy_assets')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAsset.id);
        if (error) throw error;
        toast.success('Asset updated successfully');
      } else {
        const { error } = await supabase
          .from('academy_assets')
          .insert([{
            ...formData,
            total_views: 0,
            total_downloads: 0,
            total_applicants: 0
          }]);
        if (error) throw error;
        toast.success('Asset created successfully');
      }
      setShowModal(false);
      fetchAssets();
    } catch (err: any) {
      toast.error('Error saving asset: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      const { error } = await supabase.from('academy_assets').delete().eq('id', id);
      if (error) throw error;
      toast.success('Asset deleted');
      fetchAssets();
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim());
      if (rows.length < 2) {
        toast.error('CSV must have a header row and data.');
        return;
      }
      
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      const assetsToImport = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const asset: any = { 
          metadata: {},
          total_views: 0,
          total_downloads: 0,
          total_applicants: 0,
          status: 'published'
        };

        headers.forEach((header, i) => {
          const val = values[i];
          if (!val) return;

          // Map headers to DB columns (handles some common variations)
          if (header.includes('title')) asset.title = val;
          else if (header.includes('type')) asset.type = val.toLowerCase();
          else if (header.includes('category')) asset.category = val;
          else if (header.includes('desc')) asset.description = val;
          else if (header.includes('image') || header.includes('img')) asset.image_url = val;
          else if (header.includes('amount') || header.includes('price')) asset.amount = parseFloat(val) || 0;
          else if (header.includes('drive') || header.includes('download')) asset.drive_link = val;
          else if (header.includes('youtube') || header.includes('video')) asset.youtube_link = val;
          else if (header.includes('status')) asset.status = val.toLowerCase();
          else asset.metadata[header] = val;
        });

        return asset;
      });

      // Filter out invalid items
      const validAssets = assetsToImport.filter(a => a.title && a.type);
      
      if (validAssets.length === 0) {
        toast.error('No valid assets found in CSV. Ensure title and type columns exist.');
        return;
      }

      try {
        setLoading(true);
        const { error } = await supabase.from('academy_assets').insert(assetsToImport);
        if (error) throw error;

        // Log the import
        await supabase.from('csv_import_logs').insert([{
          filename: file.name,
          row_count: assetsToImport.length,
          target_table: 'academy_assets',
          status: 'success'
        }]);

        toast.success(`Successfully imported ${assetsToImport.length} assets`);
        fetchAssets();
      } catch (err: any) {
        toast.error('Import failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SNAC Academy Library</h1>
            <p className="text-slate-500 text-sm">Manage all educational assets, courses, and internships.</p>
          </div>
          <div className="flex items-center gap-2">
             <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleBulkImport} 
              accept=".csv" 
              className="hidden" 
            />
             <button 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-bold text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileJson size={18} /> Bulk Import
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-bold text-sm shadow-lg shadow-blue-500/20"
              onClick={() => {
                setEditingAsset(null);
                setFormData({
                  title: '', type: 'course', category: '', description: '',
                  image_url: '', status: 'published', metadata: {}
                });
                setShowModal(true);
              }}
            >
              <Plus size={18} /> New Asset
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search assets by title or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'ebook', 'course', 'internship'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterType === type 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-video bg-slate-100">
                {asset.image_url ? (
                  <img src={asset.image_url} alt={asset.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    {asset.type === 'ebook' && <BookOpen size={48} />}
                    {asset.type === 'course' && <GraduationCap size={48} />}
                    {asset.type === 'internship' && <Briefcase size={48} />}
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight text-white ${
                    asset.type === 'ebook' ? 'bg-emerald-500' : 
                    asset.type === 'course' ? 'bg-blue-600' : 'bg-amber-500'
                  }`}>
                    {asset.type}
                  </span>
                  {asset.status === 'draft' && (
                    <span className="bg-slate-800 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase">Draft</span>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition truncate w-40">{asset.title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{asset.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                     <button 
                      onClick={() => {
                        setEditingAsset(asset);
                        setFormData({ ...asset });
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Edit size={14} />
                    </button>
                     <button 
                      onClick={() => asset.id && handleDelete(asset.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50">
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Views</span>
                      <span className="text-sm font-black text-slate-900">{asset.total_views}</span>
                   </div>
                   <div className="flex flex-col items-center border-x border-slate-50">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {asset.type === 'ebook' ? 'DLs' : 'Enrolled'}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {asset.type === 'ebook' ? asset.total_downloads : asset.total_applicants}
                      </span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rating</span>
                      <span className="text-sm font-black text-slate-900">4.8</span>
                   </div>
                </div>

                <button className="w-full py-2 bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2">
                   View Details <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">SNAC Academy Repository</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="group p-3 bg-white hover:bg-red-50 rounded-2xl transition-all duration-300 text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 hover:border-red-100 flex items-center gap-2"
                title="Close Modal"
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900"
                      value={formData.type}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setFormData({
                          ...formData, 
                          type: newType,
                          category: newType === 'internship' ? 'Professional Training' : formData.category
                        });
                      }}
                    >
                      <option value="course">Video Course</option>
                      <option value="ebook">E-Book (PDF/EPUB)</option>
                      <option value="internship">Internship Program</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {formData.type === 'internship' ? 'Internship Title' : 'Asset Title'}
                    </label>
                    <input 
                      required
                      type="text" 
                      placeholder={formData.type === 'internship' ? "e.g. 15-Day GST Practical Training" : "Enter descriptive title..."}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  {formData.type !== 'internship' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. GST, Income Tax..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                    </div>
                  )}

                  <div className={formData.type === 'internship' ? "col-span-2 space-y-2" : "space-y-2"}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {formData.type === 'internship' ? 'Stipend / Fees (₹)' : 'Price (₹)'}
                    </label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Brief overview of the asset content..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-900"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drive Link (Optional)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-slate-400 text-xs"
                        value={formData.drive_link}
                        onChange={(e) => setFormData({...formData, drive_link: e.target.value})}
                      />
                      <ExternalLink size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>

                  {formData.type === 'course' && (
                    <div className="col-span-2 space-y-2 animate-fadeIn">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Video size={10} className="text-red-500" /> YouTube Video URL
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none transition font-bold text-slate-900 text-sm"
                          value={formData.youtube_link}
                          onChange={(e) => setFormData({...formData, youtube_link: e.target.value})}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {getYoutubeId(formData.youtube_link || '') && (
                            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                              <CheckCircle size={8} /> Valid
                            </div>
                          )}
                          <PlayCircle size={14} className="text-slate-300" />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.type !== 'internship' && (
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                      <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, status: 'published'})}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formData.status === 'published' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                        >
                          Published
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, status: 'draft'})}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formData.status === 'draft' ? 'bg-white shadow-sm text-slate-600' : 'text-slate-400'}`}
                        >
                          Draft
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex-1 py-4 bg-blue-50 text-blue-600 font-bold rounded-2xl transition hover:bg-blue-100 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Eye size={18} /> Preview
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl transition hover:bg-slate-200 active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[1.5] py-4 bg-slate-950 text-white font-black rounded-2xl transition hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <><CheckCircle size={18} /> Save Asset</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Preview Overlay */}
      {showModal && showPreview && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="relative w-full max-w-sm animate-fadeIn">
              <button 
                onClick={() => setShowPreview(false)} 
                className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-blue-400 transition"
              >
                Close Preview <X size={20} />
              </button>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
                <div className="relative aspect-video bg-slate-950">
                  {formData.type === 'course' && getYoutubeId(formData.youtube_link || '') ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYoutubeId(formData.youtube_link || '')}?autoplay=1&mute=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : formData.image_url ? (
                    <img src={formData.image_url} alt={formData.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      {formData.type === 'ebook' && <BookOpen size={48} />}
                      {formData.type === 'course' && <Video size={48} />}
                      {formData.type === 'internship' && <Briefcase size={48} />}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight text-white shadow-lg ${
                      formData.type === 'ebook' ? 'bg-emerald-500' : 
                      formData.type === 'course' ? 'bg-red-600' : 'bg-amber-500'
                    }`}>
                      {formData.type === 'course' && getYoutubeId(formData.youtube_link || '') ? 'Live Preview' : formData.type}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 leading-tight text-lg mb-1">{formData.title || 'Untitled Asset'}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{formData.category}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Views</span>
                        <span className="text-sm font-black text-slate-900">0</span>
                     </div>
                     <div className="flex flex-col items-center border-x border-slate-50">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rating</span>
                        <span className="text-sm font-black text-slate-900">5.0</span>
                     </div>
                  </div>

                   <div className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                            <ShoppingBag size={18} className="text-blue-600" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Price Tag</p>
                            <p className="text-sm font-black text-slate-900">₹{formData.amount || '0'}</p>
                         </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
                         Buy Now
                      </button>
                   </div>

                  <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100">
                     Check Full Details <ExternalLink size={12} />
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Placeholder for Data Empty State */}
      {!loading && filteredAssets.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
               <History size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No assets found</h3>
            <p className="text-slate-500 text-sm max-w-xs text-center px-4">Try adjusting your filters or search terms to find what you're looking for.</p>
         </div>
      )}
    </div>
  );
};

export default AssetLibrary;
