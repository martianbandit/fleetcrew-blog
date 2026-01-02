import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "compact";
}

export default function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
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
    subscribeMutation.mutate({ email });
  };

  if (subscribed) {
    return (
      <div className={`flex items-center gap-3 ${variant === "compact" ? "text-sm" : ""}`}>
        <CheckCircle className="w-5 h-5 text-accent" />
        <span className="text-muted-foreground">Merci pour votre inscription!</span>
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
