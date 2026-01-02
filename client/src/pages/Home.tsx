import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  Wrench, 
  Cpu, 
  Brain, 
  Truck, 
  Shield, 
  Newspaper,
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";

const categories = [
  { 
    name: "Mécanique & Maintenance", 
    slug: "mecanique-maintenance",
    icon: Wrench,
    description: "Conseils et techniques pour l'entretien de vos véhicules"
  },
  { 
    name: "Technologies & Innovation", 
    slug: "technologies-innovation",
    icon: Cpu,
    description: "Les dernières avancées technologiques du secteur"
  },
  { 
    name: "Intelligence Artificielle", 
    slug: "intelligence-artificielle",
    icon: Brain,
    description: "L'IA au service de la gestion de flottes"
  },
  { 
    name: "Gestion de Flottes", 
    slug: "gestion-flottes",
    icon: Truck,
    description: "Optimisez la gestion de votre parc de véhicules"
  },
  { 
    name: "Conformité SAAQ", 
    slug: "conformite-saaq",
    icon: Shield,
    description: "Restez conforme aux réglementations québécoises"
  },
  { 
    name: "Actualités", 
    slug: "actualites",
    icon: Newspaper,
    description: "Les dernières nouvelles de l'industrie"
  },
];

export default function Home() {
  const { data: featuredArticles, isLoading: loadingFeatured } = trpc.articles.featured.useQuery({ limit: 3 });
  const { data: recentArticles, isLoading: loadingRecent } = trpc.articles.list.useQuery({ limit: 6 });
  const { data: categoriesData } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Blog FleetCrew</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                L'expertise en{" "}
                <span className="gradient-text">gestion de flottes</span>
                {" "}au Québec
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up stagger-1">
                Découvrez nos articles sur la mécanique, les technologies, l'intelligence artificielle 
                et tout ce qui concerne la gestion de flottes de véhicules au Québec.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/articles">
                    Explorer les articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/innovations">
                    Nos innovations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="section-title mb-4">Explorez nos thématiques</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des articles de qualité couvrant tous les aspects de la gestion de flottes 
                et de l'industrie du transport au Québec.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.slug}
                    href={`/articles?category=${category.slug}`}
                    className="group glass-card p-6 hover-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="py-16 md:py-24 bg-card/30">
            <div className="container">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="section-title mb-2">Articles à la une</h2>
                  <p className="text-muted-foreground">
                    Nos articles les plus populaires
                  </p>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex gap-2">
                  <Link href="/articles">
                    Voir tous
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-6">
                {featuredArticles.map((article, index) => (
                  <ArticleCard 
                    key={article.id} 
                    article={{
                      ...article,
                      category: categoriesData?.find(c => c.id === article.categoryId)
                    }} 
                    featured={index === 0} 
                  />
                ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/articles">
                    Voir tous les articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentArticles && recentArticles.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="section-title mb-2">Articles récents</h2>
                  <p className="text-muted-foreground">
                    Les dernières publications de notre blog
                  </p>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex gap-2">
                  <Link href="/articles">
                    Voir tous
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={{
                      ...article,
                      category: categoriesData?.find(c => c.id === article.categoryId)
                    }} 
                  />
                ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/articles">
                    Voir tous les articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-card/30">
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
