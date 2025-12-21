
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, RefreshCw, Calendar, ExternalLink, AlertCircle, FileText, TrendingUp, Building2, Scale, User, MessageSquare, Send, CheckCircle, Sparkles } from 'lucide-react';

const CACHE_KEY = 'sn_news_cache';
const CACHE_TIMESTAMP_KEY = 'sn_news_timestamp';
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours

const BLOG_STORAGE_KEY = 'sn_blog_storage';
const BLOG_DATE_KEY = 'sn_last_blog_gen_date';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxOJfHZ5vaORuZ1wgss2xpwl_VA41BEX37yyUNHeG4xcRR8EtjfkCLua7CN_Oh7ie0iQ/exec";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  author: string;
}

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    title: '5 Key Benefits of MSME Registration for Startups',
    date: 'May 15, 2024',
    category: 'Business Growth',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Discover how Udyam Registration can unlock collateral-free loans, subsidy benefits, and protection against delayed payments.',
    author: 'Nagendra M'
  },
  {
    id: 'seed-2',
    title: 'Understanding GST Audits: What You Need to Know',
    date: 'April 22, 2024',
    category: 'GST Compliance',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    excerpt: 'A comprehensive guide to preparing for departmental audits and common pitfalls to avoid during the scrutiny process.',
    author: 'Team SN'
  }
];

const News: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string>('');
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [commentStatus, setCommentStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!forceRefresh && cachedData && cachedTimestamp) {
      const now = Date.now();
      const timestamp = parseInt(cachedTimestamp, 10);
      if (now - timestamp < REFRESH_INTERVAL) {
        const parsedData = JSON.parse(cachedData);
        setNewsContent(parsedData.text);
        setGroundingChunks(parsedData.chunks || []);
        setLastUpdated(new Date(timestamp));
        setLoading(false);
        return;
      }
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const prompt = `
      Search for the latest official news, notifications, circulars, and important updates (from the last 7 days) for Indian businesses in the following 4 specific categories:
      1. GST & Indirect Tax
      2. Income Tax (ITR)
      3. Corporate Law & MCA Updates
      4. Business Finance & RBI Guidelines

      Format the output strictly as follows:
      ## Category Name
      * **Update Title**: Brief 1-2 sentence description.
      * **Update Title**: Brief 1-2 sentence description.

      Only provide the categories and bullets. Do not include introductory text.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "No news available at the moment.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      localStorage.setItem(CACHE_KEY, JSON.stringify({ text, chunks }));
      const now = Date.now();
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

      setNewsContent(text);
      setGroundingChunks(chunks);
      setLastUpdated(new Date(now));
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Unable to load latest news from official sources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const generateDailyBlogs = async () => {
    setBlogLoading(true);
    const storedBlogs = localStorage.getItem(BLOG_STORAGE_KEY);
    let currentPosts: BlogPost[] = storedBlogs ? JSON.parse(storedBlogs) : INITIAL_BLOG_POSTS;
    const lastGenDate = localStorage.getItem(BLOG_DATE_KEY);
    const today = new Date().toLocaleDateString('en-CA');

    if (lastGenDate === today) {
        setPosts(currentPosts);
        setBlogLoading(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          As a tax expert, generate 2 blog summaries for today's Indian business environment. 
          Return STRICT JSON format: [{"title": "...", "category": "...", "excerpt": "...", "author": "..."}]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const newArticles = JSON.parse(response.text.replace(/```json/gi, '').replace(/```/g, ''));
        const newPosts: BlogPost[] = newArticles.map((article: any, index: number) => ({
            id: `ai-${today}-${index}`,
            ...article,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            image: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800`
        }));

        const updatedPosts = [...newPosts, ...currentPosts].slice(0, 10);
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updatedPosts));
        localStorage.setItem(BLOG_DATE_KEY, today);
        setPosts(updatedPosts);
    } catch (e) {
        setPosts(currentPosts);
    } finally {
        setBlogLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    generateDailyBlogs();
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentStatus('submitting');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: "Blog Comment", 
      message: formData.get('comment'),
      timestamp: new Date().toISOString()
    };
    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), mode: 'no-cors' });
      setCommentStatus('success');
      form.reset();
      setTimeout(() => setCommentStatus('idle'), 5000);
    } catch (error) { setCommentStatus('error'); }
  };

  const renderNewsSections = () => {
    if (!newsContent) return null;
    const sections = newsContent.split('## ').filter(s => s.trim().length > 0);
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n');
      return (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 animate-fadeIn">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
             <div className="bg-blue-600 text-white p-2 rounded-lg"><FileText size={20} /></div>
             <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          </div>
          <div className="p-6">
            <div className="prose text-slate-600 max-w-none space-y-4">
              {content.split('* ').map((item, i) => {
                 if (!item.trim()) return null;
                 const parts = item.split('**');
                 return (
                    <div key={i} className="flex gap-3 items-start mb-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                        <div className="text-sm">
                            {parts.length >= 3 ? <><strong className="text-slate-900">{parts[1]}</strong>: {parts[2]}</> : item}
                        </div>
                    </div>
                 )
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Compliance & Knowledge Center</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Real-time government notifications and expert tax insights for business leaders.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
           <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Live Regulatory Stream
                 </h2>
                 <button onClick={() => fetchNews(true)} disabled={loading} className="text-xs font-bold text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition hover:bg-blue-100">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Update Feed
                 </button>
              </div>

              {loading && !newsContent ? (
                  <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
                      <Loader2 size={32} className="mx-auto text-blue-600 animate-spin mb-4" />
                      <p className="text-slate-500 font-medium">Querying official MCA & GST portals...</p>
                  </div>
              ) : renderNewsSections()}
              
              {lastUpdated && (
                <p className="text-[10px] text-slate-400 mt-4 text-center">Verified via Google Search • Last Updated: {lastUpdated.toLocaleString()}</p>
              )}
           </div>

           <div className="lg:w-1/3 space-y-8">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles size={20} className="text-blue-400" /> Daily Briefing</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6">Expert summaries generated specifically for your business compliance profile.</p>
                 <div className="space-y-4">
                    {posts.slice(0, 3).map(post => (
                        <div key={post.id} className="group cursor-pointer">
                           <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">{post.category}</div>
                           <h4 className="font-bold text-sm leading-tight group-hover:text-blue-300 transition line-clamp-2">{post.title}</h4>
                           <div className="h-[1px] w-full bg-slate-800 mt-3"></div>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Questions?</h3>
                 <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <input name="name" required placeholder="Name" className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" />
                    <textarea name="comment" required placeholder="Quick enquiry about these updates..." className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" rows={3}></textarea>
                    <button type="submit" disabled={commentStatus === 'submitting'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-sm shadow-md transition hover:bg-blue-700">
                        {commentStatus === 'submitting' ? 'Sending...' : 'Post Query'}
                    </button>
                    {commentStatus === 'success' && <p className="text-xs text-green-600 font-bold text-center">Enquiry sent successfully!</p>}
                 </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default News;
