import Header from "@/components/Header";
import { HeaderAd } from "@/components/HeaderAd";
import Footer from "@/components/Footer";
import { FooterAd } from "@/components/FooterAd";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Hand, 
  TrendingUp, 
  Truck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Mic,
  Eye,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign
} from "lucide-react";

const innovations = [
  {
    id: "conformite",
    title: "Conformité Automatisée",
    subtitle: "Intégration SAAQ complète",
    icon: Shield,
    color: "primary",
    description: "Notre système révolutionnaire garantit une conformité parfaite avec les réglementations québécoises.",
    features: [
      "Intégration directe avec les bases de données SAAQ",
      "Inspections guidées étape par étape avec photos",
      "Génération automatique de tous les rapports requis",
      "Alertes préventives 30 jours avant échéance",
      "Historique complet et traçabilité totale",
      "Réduction de 95% des erreurs de conformité"
    ],
    stats: [
      { value: "95%", label: "Réduction des erreurs" },
      { value: "30j", label: "Alertes préventives" },
      { value: "100%", label: "Traçabilité" }
    ]
  },
  {
    id: "mains-sales",
    title: "Interface \"Mains Sales\"",
    subtitle: "Technologie révolutionnaire pour mécaniciens",
    icon: Hand,
    color: "accent",
    description: "Une interface conçue pour le travail en atelier, permettant une productivité maximale sans compromettre la sécurité.",
    features: [
      "Commande vocale fiable même en environnement bruyant",
      "Reconnaissance gestuelle pour navigation intuitive",
      "Projection AR sur lunettes intelligentes",
      "Capteurs mobiles pour mesures automatiques",
      "Synchronisation temps réel avec tous les systèmes",
      "Augmentation de 60% de la productivité"
    ],
    stats: [
      { value: "60%", label: "Gain de productivité" },
      { value: "0", label: "Contact manuel requis" },
      { value: "100%", label: "Mains libres" }
    ],
    subFeatures: [
      { icon: Mic, label: "Commande vocale" },
      { icon: Eye, label: "Réalité augmentée" },
      { icon: Hand, label: "Reconnaissance gestuelle" }
    ]
  },
  {
    id: "maintenance",
    title: "Maintenance Prédictive",
    subtitle: "Intelligence artificielle pour anticiper les pannes",
    icon: TrendingUp,
    color: "chart-2",
    description: "Notre IA analyse en temps réel les données de vos véhicules pour prédire les pannes avant qu'elles ne surviennent.",
    features: [
      "Analyse de 200+ paramètres en temps réel",
      "Prédiction des pannes 2-4 semaines à l'avance",
      "Optimisation automatique des calendriers de maintenance",
      "Réduction de 80% des pannes imprévues",
      "Économies moyennes de 300 000$ par an par flotte"
    ],
    stats: [
      { value: "80%", label: "Réduction des pannes" },
      { value: "200+", label: "Paramètres analysés" },
      { value: "300K$", label: "Économies/an" }
    ]
  },
  {
    id: "optimisation",
    title: "Optimisation de Flotte",
    subtitle: "Maximisez l'utilisation et minimisez les coûts",
    icon: Truck,
    color: "chart-4",
    description: "Des algorithmes avancés pour optimiser chaque aspect de votre flotte et réduire vos coûts opérationnels.",
    features: [
      "Algorithmes d'optimisation des routes en temps réel",
      "Gestion intelligente de la rotation des véhicules",
      "Prédiction de la demande et planification proactive",
      "Réduction de 25% des kilomètres à vide",
      "Amélioration de 40% du taux d'utilisation"
    ],
    stats: [
      { value: "25%", label: "Réduction km à vide" },
      { value: "40%", label: "Meilleur taux d'utilisation" },
      { value: "24/7", label: "Optimisation continue" }
    ]
  }
];

const challenges = [
  {
    icon: AlertTriangle,
    title: "Pénurie de Talents",
    description: "Déficit de 15 000 mécaniciens au Québec d'ici 2030",
    stat: "15 000"
  },
  {
    icon: FileText,
    title: "Pression Réglementaire",
    description: "Amendes pouvant atteindre 50 000$ par infraction",
    stat: "50 000$"
  },
  {
    icon: DollarSign,
    title: "Explosion des Coûts",
    description: "Coût d'immobilisation: 1 500$ par jour par véhicule",
    stat: "1 500$/j"
  },
  {
    icon: Clock,
    title: "Temps Perdu",
    description: "40% du temps de travail en saisie manuelle",
    stat: "40%"
  }
];

export default function Innovations() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeaderAd />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 hero-gradient overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Innovations FleetCrew</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                L'intelligence opérationnelle pour le{" "}
                <span className="gradient-text">transport lourd</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Découvrez nos innovations qui transforment la gestion de flottes 
                et révolutionnent l'industrie du transport au Québec.
              </p>
              
              <Button size="lg" className="gap-2" asChild>
                <a href="https://fleetcrew.manus.space/#innovation" target="_blank" rel="noopener noreferrer">
                  Demander une démo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Challenges */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="section-title mb-4">Les défis de l'industrie</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                L'industrie du transport lourd fait face à des défis majeurs. 
                FleetCrew apporte des solutions concrètes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {challenges.map((challenge, index) => {
                const Icon = challenge.icon;
                return (
                  <div key={index} className="glass-card p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-destructive mb-2">{challenge.stat}</div>
                    <h3 className="font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Innovations */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Nos solutions innovantes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des technologies de pointe pour transformer votre gestion de flotte 
                et maximiser votre efficacité opérationnelle.
              </p>
            </div>
            
            <div className="space-y-24">
              {innovations.map((innovation, index) => {
                const Icon = innovation.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={innovation.id} className="relative">
                    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? "" : "lg:grid-flow-dense"}`}>
                      {/* Content */}
                      <div className={isEven ? "" : "lg:col-start-2"}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-${innovation.color}/10 flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 text-${innovation.color}`} />
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold">{innovation.title}</h3>
                            <p className="text-sm text-muted-foreground">{innovation.subtitle}</p>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {innovation.description}
                        </p>
                        
                        <ul className="space-y-3 mb-8">
                          {innovation.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground/90">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {innovation.subFeatures && (
                          <div className="flex flex-wrap gap-3 mb-8">
                            {innovation.subFeatures.map((sub, i) => {
                              const SubIcon = sub.icon;
                              return (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                                  <SubIcon className="w-4 h-4 text-primary" />
                                  <span className="text-sm">{sub.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Stats Card */}
                      <div className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}>
                        <div className="glass-card p-8 md:p-10">
                          <div className="grid grid-cols-3 gap-6">
                            {innovation.stats.map((stat, i) => (
                              <div key={i} className="text-center">
                                <div className={`text-3xl md:text-4xl font-bold text-${innovation.color} mb-2`}>
                                  {stat.value}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title mb-4">Prêt pour la nouvelle ère?</h2>
              <p className="text-muted-foreground mb-8">
                Discutons de la manière dont notre écosystème peut transformer votre bilan 
                et optimiser vos opérations de transport.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <a href="https://fleetcrew.manus.space/#innovation" target="_blank" rel="noopener noreferrer">
                    Planifier une démo
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/articles">Explorer nos articles</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
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
