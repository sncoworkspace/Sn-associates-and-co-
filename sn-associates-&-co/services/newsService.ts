
export interface NewsItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: string;
}

const FINANCIAL_KEYWORDS = [
    "Sensex", "Nifty", "RBI", "Bank", "Finance", "Economy", "GST", "Tax",
    "Stock", "Market", "Investment", "Mutual Fund", "IPO", "Crypto",
    "Gold", "Loan", "Insurance", "Corporate", "Business", "Startup",
    "Revenue", "Profit", "Loss", "Inflation", "GDP", "Budget", "Fiscal",
    "Monetary", "Debt", "Credit", "Equity", "Shares", "Dividend", "Portfolio",
    "Interest Rate", "Forex", "Rupee", "Dollar", "Trade", "Export", "Import"
];

const RSS_SOURCES = [
    { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', name: 'Economic Times' },
    { url: 'https://www.moneycontrol.com/rss/latestnews.xml', name: 'MoneyControl' },
    { url: 'https://www.livemint.com/rss/money', name: 'Mint Money' },
    { url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms', name: 'Times of India Business' }
];

export const newsService = {
    fetchLiveNews: async (): Promise<NewsItem[]> => {
        let allNews: NewsItem[] = [];

        // Primary and Secondary Proxies for redundancy
        const proxies = [
            (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&nocache=${Date.now()}`,
            (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];

        const fetchWithFallback = async (sourceUrl: string): Promise<string> => {
            for (const getProxy of proxies) {
                try {
                    const response = await fetch(getProxy(sourceUrl));
                    if (!response.ok) continue;
                    
                    // AllOrigins returns it in .contents, corsproxy.io returns directly
                    const data = await response.json();
                    if (data.contents) return data.contents;
                    return typeof data === 'string' ? data : JSON.stringify(data);
                } catch (e) {
                    console.warn(`Proxy failed for ${sourceUrl}, trying next...`);
                }
            }
            throw new Error(`All proxies failed for ${sourceUrl}`);
        };

        const fetchPromises = RSS_SOURCES.map(async (source) => {
            try {
                const contents = await fetchWithFallback(source.url);
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(contents, "text/xml");
                
                // Check for parsing errors
                const parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) return [];

                const items = xmlDoc.querySelectorAll("item");
                const sourceNews: NewsItem[] = [];

                items.forEach((item) => {
                    const title = (item.querySelector("title")?.textContent || "").trim();
                    const description = (item.querySelector("description")?.textContent || "").trim();
                    const link = (item.querySelector("link")?.textContent || "").trim();
                    const pubDate = (item.querySelector("pubDate")?.textContent || "").trim();

                    // Clean up description (remove HTML tags and extra space)
                    const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

                    if (title) {
                        sourceNews.push({
                            title,
                            description: cleanDesc,
                            link,
                            pubDate,
                            source: source.name
                        });
                    }
                });
                return sourceNews;
            } catch (error) {
                console.error(`Error fetching news from ${source.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(newsList => {
            allNews = [...allNews, ...newsList];
        });

        return allNews;
    },

    filterFinancialNews: (newsItems: NewsItem[]): NewsItem[] => {
        return newsItems.filter(item => {
            const text = `${item.title} ${item.description}`.toLowerCase();
            return FINANCIAL_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
        });
    },

    getLatestFinancialNews: async (): Promise<NewsItem[]> => {
        const rawNews = await newsService.fetchLiveNews();
        const financialNews = newsService.filterFinancialNews(rawNews);

        // Sort by date (newest first) if possible, though RSS usually gives sorted.
        // We'll just deduplicate by title.
        const uniqueNews = Array.from(new Map(financialNews.map(item => [item.title, item])).values());

        return uniqueNews.slice(0, 20); // Return top 20 relevant items
    }
};
