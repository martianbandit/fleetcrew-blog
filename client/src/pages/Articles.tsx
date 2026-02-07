import { useState, useMemo } from "react";
import Header from "@/components/Header";
import { HeaderAd } from "@/components/HeaderAd";
import Footer from "@/components/Footer";
import { FooterAd } from "@/components/FooterAd";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation, useSearch } from "wouter";
import { Search, Filter, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Articles() {
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialCategory = urlParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [, setLocation] = useLocation();

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    categoryId: selectedCategory ? categories?.find(c => c.slug === selectedCategory)?.id : undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    if (value && value !== "all") {
      setLocation(`/articles?category=${value}`);
    } else {
      setLocation("/articles");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setLocation("/articles");
  };

  const hasFilters = searchQuery || selectedCategory;

  const articlesWithCategories = useMemo(() => {
    if (!articles || !categories) return [];
    return articles.map(article => ({
      ...article,
      category: categories.find(c => c.id === article.categoryId)
    }));
  }, [articles, categories]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeaderAd />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 hero-gradient">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Tous nos articles
              </h1>
              <p className="text-lg text-muted-foreground">
                Explorez notre collection d'articles sur la gestion de flottes, 
                la mécanique, les technologies et l'intelligence artificielle.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border/40 sticky top-16 z-40 bg-background/95 backdrop-blur-lg">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[200px] bg-secondary/50">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="w-4 h-4" />
                    Effacer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : articlesWithCategories.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  {articlesWithCategories.length} article{articlesWithCategories.length > 1 ? "s" : ""} trouvé{articlesWithCategories.length > 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articlesWithCategories.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  {hasFilters 
                    ? "Essayez de modifier vos critères de recherche."
                    : "Aucun article n'a encore été publié."}
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Effacer les filtres
                  </Button>
                )}
              </div>
            )}
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

      <FooterAd />
      <Footer />
    </div>
  );
}
