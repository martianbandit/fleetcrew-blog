import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FleetCrewPartsAd } from "@/components/FleetCrewPartsAd";
import NewsletterForm from "@/components/NewsletterForm";
import { SocialShareInline } from "@/components/SocialShare";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import LikeButton from "@/components/LikeButton";
import { ArticleStats } from "@/components/ArticleStats";
import { useArticleAnalytics } from "@/hooks/useArticleAnalytics";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import RelatedArticles from "@/components/RelatedArticles";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = trpc.articles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // URL actuelle pour le partage
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Analytics tracking
  useArticleAnalytics({
    articleId: article?.id ?? 0,
    enabled: !!article?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button asChild>
              <Link href="/articles">Retour aux articles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: fr })
    : null;

  // Tags pour SEO
  const articleTags = article.tags?.map(t => t.name) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgressBar />
      <SEOHead
        title={article.title}
        description={article.excerpt || undefined}
        image={article.coverImage || undefined}
        url={currentUrl}
        type="article"
        publishedTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
        author={article.author?.name || undefined}
        section={article.category?.name || undefined}
        tags={articleTags}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-12 md:py-20 hero-gradient">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumbs */}
              <div className="mb-6">
                <Breadcrumbs
                  items={[
                    { label: "Articles", href: "/articles" },
                    ...(article.category ? [{ label: article.category.name, href: `/articles?category=${article.category.id}` }] : []),
                    { label: article.title }
                  ]}
                />
              </div>

              {/* Category */}
              {article.category && (
                <Link 
                  href={`/articles?category=${article.category.slug}`}
                  className="category-badge mb-4 inline-block"
                >
                  {article.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
                {article.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {article.author.name || "Auteur"}
                  </span>
                )}
                {publishDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {publishDate}
                  </span>
                )}
                {article.readTime && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min de lecture
                  </span>
                )}
                <ArticleStats articleId={article.id} viewCount={article.viewCount} className="hidden sm:flex" />
                <div className="ml-auto flex items-center gap-2">
                  <LikeButton articleId={article.id} initialLikeCount={article.likeCount} />
                  <SocialShareInline 
                    url={currentUrl}
                    title={article.title}
                    description={article.excerpt || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {article.coverImage && (
          <section className="container -mt-4 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-accent prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-img:rounded-lg">
                <Streamdown>{article.content}</Streamdown>
              </article>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border/40">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {article.tags.map((tag) => (
                      <span key={tag.id} className="tag-badge">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Partage en fin d'article */}
              <div className="mt-12 pt-8 border-t border-border/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-card/50 border border-border/40">
                  <div>
                    <h3 className="font-semibold text-lg">Vous avez aimé cet article ?</h3>
                    <p className="text-sm text-muted-foreground">Partagez-le avec votre réseau professionnel</p>
                  </div>
                  <SocialShareInline 
                    url={currentUrl}
                    title={article.title}
                    description={article.excerpt || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles similaires */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <RelatedArticles
                currentArticleId={article.id}
                categoryId={article.category?.id}
                limit={3}
              />
            </div>
          </div>
        </section>

        {/* FleetCrew Parts Ad Banner */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <FleetCrewPartsAd />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-card/30">
          <div className="container">
            <div className="max-w-xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
