import { Eye, Clock, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ArticleStatsProps {
  articleId: number;
  viewCount?: number;
  className?: string;
}

export function ArticleStats({ articleId, viewCount, className }: ArticleStatsProps) {
  const { data: stats } = trpc.analytics.articleStats.useQuery(
    { articleId },
    { enabled: !!articleId }
  );

  const views = viewCount ?? stats?.views ?? 0;
  const avgReadTime = stats?.avgReadTime ?? 0;

  return (
    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
      <span className="flex items-center gap-1.5">
        <Eye className="w-4 h-4" />
        {views.toLocaleString()} vue{views !== 1 ? "s" : ""}
      </span>
      {avgReadTime > 0 && (
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {Math.round(avgReadTime / 60)} min en moyenne
        </span>
      )}
    </div>
  );
}

export function PopularArticles({ limit = 5 }: { limit?: number }) {
  const { data: articles, isLoading } = trpc.analytics.popular.useQuery({ limit });

  if (isLoading || !articles?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Articles populaires
      </h3>
      <ul className="space-y-3">
        {articles.map((article, index) => (
          <li key={article.id}>
            <a
              href={`/articles/${article.slug}`}
              className="group flex items-start gap-3 hover:text-primary transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {article.viewCount.toLocaleString()} vues
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleStats;
