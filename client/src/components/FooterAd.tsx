import { ExternalLink, Truck, Wrench, Brain } from 'lucide-react';

/**
 * FooterAd Component
 * 
 * Emplacement publicitaire statique dans le footer, visible sur toutes les pages.
 * Format: Grille de 3 cartes promotionnelles pour les services FleetCrew
 * 
 * Bonnes pratiques implémentées:
 * - Pas d'alternance (affichage permanent des 3 services)
 * - Design cohérent avec le footer
 * - Accessibilité complète
 * - Responsive (1 colonne sur mobile, 3 sur desktop)
 * - Icônes Lucide pour la cohérence visuelle
 */

const footerAds = [
  {
    id: 'fleetcrew-parts',
    url: 'https://fleetcrewparts.base44.app/home',
    icon: Wrench,
    title: 'FleetCrew Parts',
    description: 'Comparateur intelligent de pièces détachées',
    cta: 'Trouver mes pièces',
    color: 'cyan'
  },
  {
    id: 'fleetinspect',
    url: 'https://fleetinpect.base44.app',
    icon: Truck,
    title: 'FleetInspect',
    description: 'Inspection de véhicules assistée par IA',
    cta: 'Essayer gratuitement',
    color: 'purple'
  },
  {
    id: 'fleetcrew-intelligence',
    url: 'https://fleetcrew-kb75upsk.manus.space',
    icon: Brain,
    title: 'FleetCrew Intelligence',
    description: 'Analytics et insights pour votre flotte',
    cta: 'Découvrir',
    color: 'emerald'
  }
];

export function FooterAd() {
  return (
    <div className="border-t border-border/40 bg-muted/20 py-8">
      <div className="container">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center">
          Nos Solutions FleetCrew
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {footerAds.map((ad) => {
            const Icon = ad.icon;
            const colorMap = {
              cyan: {
                bg: 'bg-cyan-500/10',
                icon: 'text-cyan-600',
                hover: 'hover:bg-cyan-500/20 hover:border-cyan-500/50'
              },
              purple: {
                bg: 'bg-purple-500/10',
                icon: 'text-purple-600',
                hover: 'hover:bg-purple-500/20 hover:border-purple-500/50'
              },
              emerald: {
                bg: 'bg-emerald-500/10',
                icon: 'text-emerald-600',
                hover: 'hover:bg-emerald-500/20 hover:border-emerald-500/50'
              }
            } as const;
            const colorClasses = colorMap[ad.color as keyof typeof colorMap];

            return (
              <a
                key={ad.id}
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center text-center p-6 rounded-lg border border-border/40 ${colorClasses.bg} ${colorClasses.hover} transition-all duration-300`}
                aria-label={`Découvrir ${ad.title}`}
              >
                <div className={`w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                </div>
                
                <h4 className="font-semibold text-foreground mb-2">{ad.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ad.description}</p>
                
                <div className={`flex items-center gap-2 text-sm font-medium ${colorClasses.icon} group-hover:gap-3 transition-all`}>
                  <span>{ad.cta}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
