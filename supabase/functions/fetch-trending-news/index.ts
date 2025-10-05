import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SERPAPI_KEY = Deno.env.get("SERPAPI_KEY");
    
    if (!SERPAPI_KEY) {
      throw new Error("SERPAPI_KEY is not configured");
    }

    // Fetch trending world news from SerpApi Google News
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.append("engine", "google_news");
    url.searchParams.append("q", "trending news");
    url.searchParams.append("gl", "in"); // India region
    url.searchParams.append("hl", "en"); // English language
    url.searchParams.append("api_key", SERPAPI_KEY);

    console.log("Fetching news from SerpApi...");
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SerpApi error:", response.status, errorText);
      throw new Error(`SerpApi error: ${response.status}`);
    }

    const data = await response.json();
    console.log("SerpApi response received");
    
    let newsArticles;
    
    try {
      // Extract news articles from SerpApi response
      const newsResults = data.news_results || [];
      
      // Get top 20 news articles
      newsArticles = newsResults.slice(0, 20).map((article: any) => ({
        title: article.title || "Breaking News",
        description: article.snippet || article.title || "Stay informed with the latest updates.",
        content: article.snippet || article.title || "Click to read the full article.",
        source: { name: article.source?.name || "News Source" },
        author: null,
        url: article.link || "#",
        urlToImage: article.thumbnail || `https://images.unsplash.com/photo-1504711434969?w=800&q=80`,
        publishedAt: article.date || new Date().toISOString(),
        category: "general"
      }));
      
      // If we got less than 20 articles, log it
      if (newsArticles.length < 20) {
        console.log(`Only ${newsArticles.length} articles received from SerpApi`);
      }
      
    } catch (parseError) {
      console.error("Error parsing SerpApi response:", parseError);
      // Fallback to default news if parsing fails
      newsArticles = generateFallbackNews();
    }

    return new Response(
      JSON.stringify({ articles: newsArticles }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-trending-news function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        articles: generateFallbackNews()
      }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateFallbackNews() {
  const now = new Date().toISOString();
  return [
    {
      title: "World Technology Leaders Gather for Innovation Summit",
      description: "Global tech leaders are meeting to discuss the future of AI and digital transformation across industries.",
      content: "Technology leaders from around the world are gathering for a major innovation summit focused on artificial intelligence and digital transformation. The event highlights breakthrough technologies and their impact on various sectors.",
      source: { name: "Tech World" },
      author: "Business Desk",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      publishedAt: now,
      category: "technology"
    },
    {
      title: "Global Markets Show Strong Performance",
      description: "International stock markets demonstrate resilience with positive gains across major indices worldwide.",
      content: "Global financial markets are showing strong performance with major indices posting gains. Investors are optimistic about economic recovery and growth prospects in key markets.",
      source: { name: "Global Finance" },
      author: "Market Reporter",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&q=80",
      publishedAt: now,
      category: "business"
    },
    {
      title: "International Sports Championships Draw Global Attention",
      description: "Major sporting events are captivating audiences worldwide with thrilling competitions and record-breaking performances.",
      content: "The world's top athletes are competing in international championships, delivering exceptional performances and breaking records across various sports.",
      source: { name: "World Sports" },
      author: "Sports Correspondent",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
      publishedAt: now,
      category: "sports"
    }
  ];
}
