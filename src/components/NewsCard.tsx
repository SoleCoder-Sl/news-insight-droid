import { Card } from "@/components/ui/card";
import { Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  onClick: () => void;
}

export const NewsCard = ({
  title,
  description,
  urlToImage,
  publishedAt,
  source,
  onClick,
}: NewsCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] bg-gradient-to-b from-card to-card/95 border-border/50"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <ExternalLink className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-primary">{source.name}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};
