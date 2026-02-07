import { ExternalLink, Wrench, Truck, Brain, ArrowRight } from 'lucide-react';

/**
 * FooterAd Component
 * 
 * Emplacement publicitaire statique avant le footer, visible sur toutes les pages.
 * Grille de 3 cartes promotionnelles pour les services FleetCrew.
 * Responsive : empilées sur mobile, grille 3 colonnes sur desktop.
 */

const footerAds = [
  {
    id: 'fleetcrew-parts',
    url: 'https://fleetcrewparts.base44.app/home',
    icon: Wrench,
    title: 'FleetCrew Parts',
    description: 'Comparateur intelligent de pièces détachées pour camions. Trouvez les meilleures pièces au meilleur prix.',
    cta: 'Trouver mes pièces',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)',
    iconBg: 'rgba(6, 182, 212, 0.15)',
    iconColor: '#06b6d4',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    hoverBorderColor: 'rgba(6, 182, 212, 0.5)',
  },
  {
    id: 'fleetinspect',
    url: 'https://fleetinpect.base44.app',
    icon: Truck,
    title: 'FleetInspect',
    description: 'Inspection de véhicules lourds assistée par intelligence artificielle. Détection automatique des défauts.',
    cta: 'Essayer gratuitement',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)',
    iconBg: 'rgba(139, 92, 246, 0.15)',
    iconColor: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    hoverBorderColor: 'rgba(139, 92, 246, 0.5)',
  },
  {
    id: 'fleetcrew-intelligence',
    url: 'https://fleetcrew-kb75upsk.manus.space',
    icon: Brain,
    title: 'FleetCrew Intelligence',
    description: 'Analytics et insights en temps réel pour optimiser la gestion de votre flotte de véhicules.',
    cta: 'Découvrir',
    gradient: 'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    hoverBorderColor: 'rgba(16, 185, 129, 0.5)',
  }
];

export function FooterAd() {
  return (
    <section 
      className="border-t border-border/30 py-10 md:py-14"
      aria-label="Solutions FleetCrew"
    >
      <div className="container">
        {/* Titre de section */}
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
            Nos Solutions
          </span>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Découvrez l'écosystème <span className="text-primary">FleetCrew</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Des outils intelligents conçus pour les professionnels du transport au Québec
          </p>
        </div>
        
        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {footerAds.map((ad) => {
            const Icon = ad.icon;
            return (
              <a
                key={ad.id}
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group relative flex flex-col p-5 md:p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
                aria-label={`Découvrir ${ad.title} - ${ad.description}`}
                style={{
                  border: '1px solid',
                  borderColor: ad.borderColor,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ad.hoverBorderColor;
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ad.borderColor;
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                }}
              >
                {/* Icône */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: ad.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: ad.iconColor }} />
                </div>
                
                {/* Contenu */}
                <h4 className="font-bold text-foreground mb-2 text-base">{ad.title}</h4>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">{ad.description}</p>
                
                {/* CTA */}
                <div 
                  className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ color: ad.iconColor }}
                >
                  <span>{ad.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Badge sponsorisé discret */}
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">
                    Sponsorisé
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
