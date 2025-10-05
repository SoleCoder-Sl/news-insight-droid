import { useState, useEffect } from "react";
import { NewsCard } from "@/components/NewsCard";
import { ArticleReader } from "@/components/ArticleReader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  author?: string;
}

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=in&apiKey=384e69e03e4d41a28759e706f6026f95"
      );
      const data = await response.json();
      
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        throw new Error(data.message || "Failed to fetch news");
      }
    } catch (error: any) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to load news. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedArticle) {
    return (
      <ArticleReader
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NewsHub India
              </h1>
              <p className="text-xs text-muted-foreground">Stay informed, stay ahead</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading latest news...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Headlines</h2>
              <p className="text-muted-foreground">Latest news from India</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <NewsCard
                    {...article}
                    onClick={() => setSelectedArticle(article)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
