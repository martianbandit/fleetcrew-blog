import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, Sparkles, Bell, Newspaper } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "compact" | "full";
}

export default function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      setName("");
      toast.success("Inscription réussie!", {
        description: "Vous recevrez nos derniers articles par email.",
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'inscription", {
        description: error.message || "Veuillez réessayer plus tard.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email, name: name || undefined });
  };

  if (subscribed) {
    return (
      <div className={`flex flex-col items-center gap-4 p-6 ${variant === "compact" ? "text-sm" : ""}`}>
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-lg mb-1">Merci pour votre inscription!</h4>
          <p className="text-muted-foreground text-sm">
            Vous recevrez bientôt nos meilleurs articles sur la gestion de flottes.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-secondary/50"
          required
        />
        <Button type="submit" size="sm" disabled={subscribeMutation.isPending}>
          {subscribeMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    );
  }

  if (variant === "full") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border p-8 md:p-10">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Newsletter FleetCrew</h3>
              <p className="text-sm text-muted-foreground">Restez à la pointe de l'industrie</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <Newspaper className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Articles exclusifs</p>
                <p className="text-xs text-muted-foreground">Contenu premium chaque semaine</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Tendances IA</p>
                <p className="text-xs text-muted-foreground">Dernières innovations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <Bell className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Alertes SAAQ</p>
                <p className="text-xs text-muted-foreground">Mises à jour réglementaires</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-name">Prénom (optionnel)</Label>
                <Input
                  id="newsletter-name"
                  type="text"
                  placeholder="Votre prénom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-email">Email *</Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={subscribeMutation.isPending}>
              {subscribeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  S'inscrire à la newsletter
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            En vous inscrivant, vous acceptez de recevoir nos emails. Désabonnement possible à tout moment.
            <br />
            Contact: <a href="mailto:fleetcrewteam@manus.bot" className="text-primary hover:underline">fleetcrewteam@manus.bot</a>
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="glass-card p-8 md:p-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Newsletter</h3>
          <p className="text-sm text-muted-foreground">Restez informé</p>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Recevez nos derniers articles sur la gestion de flottes, les technologies 
        et l'innovation directement dans votre boîte mail.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Votre prénom (optionnel)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary/50"
        />
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-secondary/50"
          required
        />
        <Button type="submit" className="w-full" disabled={subscribeMutation.isPending}>
          {subscribeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Inscription...
            </>
          ) : (
            "S'inscrire à la newsletter"
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Pas de spam. Désabonnement possible à tout moment.
      </p>
    </div>
  );
}
