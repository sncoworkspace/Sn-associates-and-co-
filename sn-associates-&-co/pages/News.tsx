
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, RefreshCw, Calendar, ExternalLink, AlertCircle, FileText, TrendingUp, Building2, Scale, User, MessageSquare, Send, CheckCircle, Sparkles, Bot } from 'lucide-react';
import { newsService, NewsItem } from '../services/newsService';

const CACHE_KEY = 'sn_news_cache';
const CACHE_TIMESTAMP_KEY = 'sn_news_timestamp';
const CACHE_VERSION_KEY = 'sn_news_version';
const CACHE_VERSION = '2.1'; // Bumped version for new service
const REFRESH_INTERVAL = 15 * 60 * 1000; // Reduced to 15 minutes for fuller live updates

const BLOG_STORAGE_KEY = 'sn_blog_storage';
const BLOG_DATE_KEY = 'sn-associates-blog-date';

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
  const [financialNews, setFinancialNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [commentStatus, setCommentStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fetchSource, setFetchSource] = useState<'live' | 'cache' | null>(null);

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const cachedVersion = localStorage.getItem(CACHE_VERSION_KEY);

    if (!forceRefresh && cachedData && cachedTimestamp && cachedVersion === CACHE_VERSION) {
      const now = Date.now();
      const timestamp = parseInt(cachedTimestamp, 10);
      if (now - timestamp < REFRESH_INTERVAL) {
        setFinancialNews(JSON.parse(cachedData));
        setLastUpdated(new Date(timestamp));
        setFetchSource('cache');
        setLoading(false);
        return;
      }
    }

    try {
      const news = await newsService.getLatestFinancialNews();

      if (news.length === 0) {
        throw new Error("No relevant financial news found at this moment.");
      }

      setFinancialNews(news);
      const now = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(news));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);

      setLastUpdated(new Date(now));
      setFetchSource('live');
    } catch (err: any) {
      console.error("News fetch failed:", err);
      setError("Unable to fetch live news. Please try again later.");
      // If cache exists, fallback to it even if expired
      if (cachedData) {
        setFinancialNews(JSON.parse(cachedData));
        setFetchSource('cache'); // Technically stale cache
      }
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setPosts(currentPosts);
      setBlogLoading(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
          As a tax expert, generate 2 blog summaries for today's Indian business environment. 
          Return STRICT JSON format: [{"title": "...", "category": "...", "excerpt": "...", "author": "..."}]
        `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
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

  const handleAiInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentStatus('submitting');
    setAiAnswer(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const userName = formData.get('name') as string;
    const userQuestion = formData.get('comment') as string;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error("API Key missing. Please check configuration.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an expert tax and compliance consultant at SN Associates & Co. 
      Answer the user's question concisely based on the latest Indian regulatory news. 
      Start with "Hello ${userName},". Keep it professional and helpful. 
      If the question is too complex, suggest booking a consultation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userQuestion }] }
        ],
        config: { systemInstruction }
      });

      setAiAnswer(response.text || "I'm unable to answer that right now.");
      setCommentStatus('success');
      form.reset();
    } catch (error) {
      console.error("AI Inquiry Error:", error);
      setCommentStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">Live Financial & Regulatory News</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Top Stories (Filtered for Finance)
              </h2>
              <button onClick={() => fetchNews(true)} disabled={loading} className="text-xs font-bold text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition hover:bg-blue-100">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Feed
              </button>
            </div>

            {loading && financialNews.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <Loader2 size={32} className="mx-auto text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Fetching live financial updates...</p>
              </div>
            ) : error && financialNews.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-xl border border-dashed border-red-300">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-4" />
                <p className="text-slate-700 font-bold mb-2">Failed to load news</p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
                <button onClick={() => fetchNews(true)} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Try Again</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {financialNews.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.source}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight hover:text-blue-700 transition"><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                        Read Full Story <ExternalLink size={10} className="ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lastUpdated && (
              <div className="flex flex-col items-center gap-1 mt-6">
                <p className="text-[10px] text-slate-400">
                  {fetchSource === 'live' ? 'Live: Validated via News API' : 'Cached Version (Optimized)'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Last Updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-[30%] space-y-6">
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
              <form onSubmit={handleAiInquiry} className="space-y-4">
                <input name="name" required placeholder="Name" className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" />
                <textarea name="comment" required placeholder="Ask about latest compliance updates..." className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" rows={3}></textarea>
                <button type="submit" disabled={commentStatus === 'submitting'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-sm shadow-md transition hover:bg-blue-700 flex justify-center items-center gap-2">
                  {commentStatus === 'submitting' ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : 'Post Query'}
                </button>
                {commentStatus === 'error' && <p className="text-xs text-red-600 font-bold text-center">Error processing your request.</p>}
              </form>

              {aiAnswer && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-xs uppercase tracking-widest">
                    <Bot size={16} /> AI Assistant Response
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                    {aiAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
