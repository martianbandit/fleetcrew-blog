import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  FileText,
  Users,
  Tag,
  FolderOpen,
  Save,
  X,
  Star,
  StarOff,
  Sparkles,
  ImageIcon,
  Calendar,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

function ArticleForm({ 
  article, 
  onSuccess, 
  onCancel 
}: { 
  article?: any; 
  onSuccess: () => void; 
  onCancel: () => void;
}) {
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: tags } = trpc.tags.list.useQuery();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    coverImage: article?.coverImage || "",
    categoryId: article?.categoryId?.toString() || "",
    status: article?.status || "draft",
    featured: article?.featured || false,
    readTime: article?.readTime?.toString() || "5",
    tagIds: article?.tags?.map((t: any) => t.id) || [],
    scheduledAt: article?.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : "",
  });

  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("Article créé avec succès");
      utils.articles.listAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", { description: error.message });
    },
  });

  const generateImageMutation = trpc.imageGeneration.generateCoverImage.useMutation({
    onSuccess: (data) => {
      if (data.imageUrl) {
        setFormData(prev => ({ ...prev, coverImage: data.imageUrl }));
        toast.success("Image générée avec succès!", {
          description: "L'image de couverture a été ajoutée à l'article.",
        });
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de la génération", { description: error.message });
    },
  });

  const handleGenerateImage = () => {
    if (!formData.title) {
      toast.error("Veuillez d'abord saisir un titre pour l'article");
      return;
    }
    const categoryName = categories?.find(c => c.id.toString() === formData.categoryId)?.name;
    generateImageMutation.mutate({
      title: formData.title,
      excerpt: formData.excerpt || undefined,
      content: formData.content || undefined,
      category: categoryName || undefined,
    });
  };

  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Article mis à jour");
      utils.articles.listAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour", { description: error.message });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      coverImage: formData.coverImage || undefined,
      categoryId: parseInt(formData.categoryId),
      status: formData.status as "draft" | "published" | "archived",
      featured: formData.featured,
      readTime: parseInt(formData.readTime) || 5,
      tagIds: formData.tagIds,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
    };

    if (article) {
      updateMutation.mutate({ id: article.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Titre de l'article"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="url-de-larticle"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Extrait</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Résumé de l'article..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenu (Markdown) *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Contenu de l'article en Markdown..."
          rows={12}
          className="font-mono text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Image de couverture</Label>
          <div className="flex gap-2">
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
              placeholder="https://... ou générer avec l'IA"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateImage}
              disabled={generateImageMutation.isPending || !formData.title}
              className="shrink-0"
            >
              {generateImageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Générer
                </>
              )}
            </Button>
          </div>
          {formData.coverImage && (
            <div className="mt-2 relative rounded-lg overflow-hidden border border-border">
              <img 
                src={formData.coverImage} 
                alt="Aperçu" 
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select 
            value={formData.categoryId} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">Temps de lecture (min)</Label>
          <Input
            id="readTime"
            type="number"
            min="1"
            value={formData.readTime}
            onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3 pt-8">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
          <Label htmlFor="featured">Article à la une</Label>
        </div>
      </div>

      {/* Planification */}
      <div className="space-y-2 p-4 rounded-lg border border-border/40 bg-card/30">
        <Label htmlFor="scheduledAt" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Planifier la publication
        </Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
          className="max-w-xs"
        />
        {formData.scheduledAt && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Sera publié le {format(new Date(formData.scheduledAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {article ? "Mettre à jour" : "Créer l'article"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function CategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const utils = trpc.useUtils();

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Catégorie créée");
      utils.categories.list.invalidate();
      setName("");
      setDescription("");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
    createMutation.mutate({ name, slug, description: description || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la catégorie"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optionnel)"
        rows={2}
      />
      <Button type="submit" disabled={createMutation.isPending} className="w-full">
        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
      </Button>
    </form>
  );
}

function TagForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const utils = trpc.useUtils();

  const createMutation = trpc.tags.create.useMutation({
    onSuccess: () => {
      toast.success("Tag créé");
      utils.tags.list.invalidate();
      setName("");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
    createMutation.mutate({ name, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du tag"
        required
        className="flex-1"
      />
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </Button>
    </form>
  );
}

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: articles, isLoading: loadingArticles } = trpc.articles.listAll.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: tags } = trpc.tags.list.useQuery();
  const { data: subscriberCount } = trpc.newsletter.count.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const utils = trpc.useUtils();

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article supprimé");
      utils.articles.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Catégorie supprimée");
      utils.categories.list.invalidate();
    },
  });

  const deleteTagMutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      toast.success("Tag supprimé");
      utils.tags.list.invalidate();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour accéder à l'administration.
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>Se connecter</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Administration</h1>
              <p className="text-muted-foreground">Gérez votre blog FleetCrew</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{articles?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Articles</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{categories?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Catégories</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{tags?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Tags</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{subscriberCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Abonnés</div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Articles</h2>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nouvel article
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Créer un article</DialogTitle>
                    </DialogHeader>
                    <ArticleForm 
                      onSuccess={() => setIsCreating(false)} 
                      onCancel={() => setIsCreating(false)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingArticles ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Titre</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Catégorie</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Statut</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Date</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {articles.map((article) => (
                          <tr key={article.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {article.featured && <Star className="w-4 h-4 text-chart-4" />}
                                <span className="font-medium line-clamp-1">{article.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {categories?.find(c => c.id === article.categoryId)?.name || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                article.status === "published" 
                                  ? "bg-accent/20 text-accent" 
                                  : article.status === "draft"
                                  ? "bg-chart-4/20 text-chart-4"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {article.status === "published" ? "Publié" : article.status === "draft" ? "Brouillon" : "Archivé"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                              {article.createdAt ? format(new Date(article.createdAt), "d MMM yyyy", { locale: fr }) : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {article.status === "published" && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/articles/${article.slug}`}>
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                )}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Modifier l'article</DialogTitle>
                                    </DialogHeader>
                                    <ArticleForm 
                                      article={article}
                                      onSuccess={() => {}} 
                                      onCancel={() => {}} 
                                    />
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Supprimer l'article?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Cette action est irréversible. L'article sera définitivement supprimé.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteMutation.mutate({ id: article.id })}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Supprimer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun article</h3>
                  <p className="text-muted-foreground mb-4">Créez votre premier article pour commencer.</p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Créer un article
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Nouvelle catégorie</h3>
                  <CategoryForm onSuccess={() => {}} />
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Catégories existantes</h3>
                  {categories && categories.length > 0 ? (
                    <ul className="space-y-2">
                      {categories.map((cat) => (
                        <li key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                          <span>{cat.name}</span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer la catégorie?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCategoryMutation.mutate({ id: cat.id })}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune catégorie</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Nouveau tag</h3>
                  <TagForm onSuccess={() => {}} />
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Tags existants</h3>
                  {tags && tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/50">
                          <span className="text-sm">{tag.name}</span>
                          <button
                            onClick={() => deleteTagMutation.mutate({ id: tag.id })}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun tag</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
