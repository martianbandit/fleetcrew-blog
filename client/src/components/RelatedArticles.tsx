import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  currentArticleId: number;
  categoryId?: number;
  limit?: number;
}

export function RelatedArticles({ currentArticleId, categoryId, limit = 3 }: RelatedArticlesProps) {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    categoryId,
    limit: limit + 1, // Get one extra to filter out current
  });

  // Filter out current article and limit
  const relatedArticles = articles
    ?.filter(a => a.id !== currentArticleId)
    .slice(0, limit);

  if (isLoading || !relatedArticles?.length) return null;

  return (
    <section className="py-12 border-t border-border/40">
      <h2 className="text-2xl font-bold mb-8">Articles similaires</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            <article className="h-full rounded-xl border border-border/40 bg-card/50 overflow-hidden hover:border-primary/50 transition-all duration-300">
              {article.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                {article.publishedAt && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(article.publishedAt), "d MMM yyyy", { locale: fr })}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-sm text-primary mt-3 group-hover:gap-2 transition-all">
                  Lire l'article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedArticles;
