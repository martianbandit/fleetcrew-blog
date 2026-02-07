import { ExternalLink, Wrench, Brain, Truck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

/**
 * HeaderAd Component
 * 
 * Emplacement publicitaire statique sous le header, visible sur toutes les pages.
 * Alternance automatique entre les services FleetCrew avec transition fluide.
 * Visible sur desktop ET mobile (version compacte sur mobile).
 */

const headerAds = [
  {
    id: 'fleetcrew-parts-header',
    url: 'https://fleetcrewparts.base44.app/home',
    title: 'FleetCrew Parts',
    subtitle: 'Trouvez vos pièces en 2 clics',
    description: '50 000+ pièces pour camions',
    icon: Wrench,
    gradient: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)',
    hoverGradient: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
    accentColor: '#06b6d4',
  },
  {
    id: 'fleetinspect-header',
    url: 'https://fleetinpect.base44.app',
    title: 'FleetInspect',
    subtitle: 'Inspection IA en temps réel',
    description: 'Détection automatique des défauts',
    icon: Truck,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)',
    hoverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #db2777 100%)',
    accentColor: '#8b5cf6',
  },
  {
    id: 'fleetcrew-intelligence-header',
    url: 'https://fleetcrew-kb75upsk.manus.space',
    title: 'FleetCrew Intelligence',
    subtitle: 'Optimisez votre flotte',
    description: 'Analytics et insights en temps réel',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
    hoverGradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    accentColor: '#10b981',
  }
];

export function HeaderAd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const transitionToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentAdIndex((prev) => (prev + 1) % headerAds.length);
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(transitionToNext, 8000);
    return () => clearInterval(interval);
  }, [isHovered, transitionToNext]);

  const currentAd = headerAds[currentAdIndex];
  const Icon = currentAd.icon;

  return (
    <div 
      className="w-full border-b border-border/30"
      role="banner"
      aria-label="Publicités FleetCrew"
    >
      <div className="container py-1.5 md:py-2">
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex items-center justify-between gap-3 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
          aria-label={`Publicité: ${currentAd.title} - ${currentAd.subtitle}`}
          style={{
            backgroundImage: isHovered ? currentAd.hoverGradient : currentAd.gradient,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease, background-image 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Icône + Texte */}
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-bold text-white truncate">{currentAd.title}</span>
                <span className="hidden sm:inline text-[10px] md:text-xs font-medium bg-white/20 text-white/90 px-1.5 py-0.5 rounded-full">
                  Sponsorisé
                </span>
              </div>
              <span className="text-[11px] md:text-xs text-white/80 truncate">
                <span className="hidden sm:inline">{currentAd.subtitle} — </span>
                {currentAd.description}
              </span>
            </div>
          </div>
          
          {/* CTA + Indicateurs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Indicateurs de position */}
            <div className="hidden md:flex items-center gap-1">
              {headerAds.map((_, index) => (
                <div
                  key={index}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: index === currentAdIndex ? '16px' : '5px',
                    height: '5px',
                    backgroundColor: index === currentAdIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 text-white/90 group-hover:text-white transition-colors">
              <span className="hidden lg:inline text-xs font-semibold">Découvrir</span>
              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
