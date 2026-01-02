import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    readTime?: number | null;
    publishedAt?: Date | null;
    category?: {
      name: string;
      slug: string;
      color?: string | null;
    } | null;
  };
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: fr })
    : null;

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} className="block group">
        <article className="article-card relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              {article.category && (
                <span className="category-badge w-fit mb-4">
                  {article.category.name}
                </span>
              )}
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h2>
              
              {article.excerpt && (
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {publishDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {publishDate}
                  </span>
                )}
                {article.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                Lire l'article
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <article className="article-card h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {article.category && (
            <span className="absolute top-4 left-4 category-badge">
              {article.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          {article.excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            {publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {publishDate}
              </span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
