import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Article {
  title: string;
  content: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  author?: string;
}

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
}

export const ArticleReader = ({ article, onBack }: ArticleReaderProps) => {
  const [structuredContent, setStructuredContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStructure = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('structure-article', {
        body: {
          title: article.title,
          content: article.content || article.description
        }
      });

      if (error) throw error;

      if (data?.structuredContent) {
        setStructuredContent(data.structuredContent);
        toast({
          title: "Article Structured",
          description: "AI has analyzed and structured the article for you.",
        });
      }
    } catch (error: any) {
      console.error('Error structuring article:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to structure article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleStructure}
            disabled={isLoading}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Structure
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {article.urlToImage && (
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{article.source.name}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-foreground">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          )}
        </div>

        {structuredContent ? (
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">AI-Structured Analysis</h2>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{structuredContent}</ReactMarkdown>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {article.content || article.description}
              </p>
            </div>
          </Card>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
        >
          Read full article on {article.source.name}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
