import Header from "@/components/Header";
import { HeaderAd } from "@/components/HeaderAd";
import Footer from "@/components/Footer";
import { FooterAd } from "@/components/FooterAd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "autre" as "avis" | "commentaire" | "demande" | "autre",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé avec succès! Nous vous répondrons bientôt.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "autre",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'envoi du message");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.message.length < 10) {
      toast.error("Le message doit contenir au moins 10 caractères");
      return;
    }
    setIsSubmitting(true);
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeaderAd />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <MessageSquare className="w-4 h-4" />
                Contactez-nous
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Une question? Un{" "}
                <span className="text-primary">commentaire</span>?
              </h1>
              <p className="text-lg text-muted-foreground">
                Notre équipe est à votre écoute pour répondre à vos questions, 
                recevoir vos avis et traiter vos demandes concernant la gestion de flottes.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                  <p className="text-muted-foreground mb-8">
                    N'hésitez pas à nous contacter pour toute question relative à 
                    la gestion de flottes, nos services ou nos articles.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a 
                        href="mailto:fleetcrewteam@manus.bot" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        fleetcrewteam@manus.bot
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Région</h3>
                      <p className="text-muted-foreground">
                        Québec, Canada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Temps de réponse</h3>
                      <p className="text-muted-foreground">
                        Sous 24-48 heures ouvrables
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services Links */}
                <div className="pt-8 border-t border-border">
                  <h3 className="font-semibold mb-4">Nos services FleetCrew</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://fleetparts.manus.space/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">FleetParts</span>
                      <p className="text-sm text-muted-foreground">Comparateur de pièces</p>
                    </a>
                    <a 
                      href="https://fleetcrew-kb75upsk.manus.space" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">FleetCrew Intelligence</span>
                      <p className="text-sm text-muted-foreground">Intelligence opérationnelle</p>
                    </a>
                    <a 
                      href="https://8xhpiqcen0qp.manus.space" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">Gestion d'Inventaire</span>
                      <p className="text-sm text-muted-foreground">Gestion de pièces</p>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type de message *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: "avis" | "commentaire" | "demande" | "autre") => 
                            setFormData({ ...formData, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="avis">Avis / Feedback</SelectItem>
                            <SelectItem value="commentaire">Commentaire sur un article</SelectItem>
                            <SelectItem value="demande">Demande d'information</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          placeholder="Sujet de votre message"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 10 caractères
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Envoi en cours...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterAd />
      <Footer />
    </div>
  );
}
