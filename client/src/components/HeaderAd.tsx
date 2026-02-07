import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * HeaderAd Component
 * 
 * Emplacement publicitaire statique dans le header, visible sur toutes les pages.
 * Format: Bannière horizontale compacte (728x90px - leaderboard standard)
 * 
 * Bonnes pratiques implémentées:
 * - Lazy loading des images
 * - Alternance automatique entre plusieurs publicités
 * - Accessibilité (aria-label, rel="noopener noreferrer")
 * - Performance (transitions CSS, pas de JS lourd)
 * - Responsive (masqué sur mobile pour ne pas encombrer)
 */

const headerAds = [
  {
    id: 'fleetcrew-parts-header',
    url: 'https://fleetcrewparts.base44.app/home',
    title: 'FleetCrew Parts - Trouvez vos pièces en 2 clics',
    description: 'Catalogue de 50 000+ pièces pour camions',
    bgGradient: 'from-cyan-600/90 to-blue-700/90',
    icon: '🔧'
  },
  {
    id: 'fleetinspect-header',
    url: 'https://fleetinpect.base44.app',
    title: 'FleetInspect - Inspection IA en temps réel',
    description: 'Détection automatique des défauts mécaniques',
    bgGradient: 'from-purple-600/90 to-pink-700/90',
    icon: '🤖'
  },
  {
    id: 'fleetcrew-intelligence-header',
    url: 'https://fleetcrew-kb75upsk.manus.space',
    title: 'FleetCrew Intelligence - Optimisez votre flotte',
    description: 'Analytics et insights en temps réel',
    bgGradient: 'from-emerald-600/90 to-teal-700/90',
    icon: '📊'
  }
];

export function HeaderAd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // Alterner entre les publicités toutes les 10 secondes
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % headerAds.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = headerAds[currentAdIndex];

  return (
    <div className="hidden md:block border-b border-border/40 bg-muted/30">
      <div className="container py-2">
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300"
          aria-label={`Publicité: ${currentAd.title}`}
          style={{
            background: `linear-gradient(to right, var(--tw-gradient-stops))`,
            backgroundImage: currentAd.bgGradient.includes('cyan') 
              ? 'linear-gradient(to right, rgb(8 145 178 / 0.9), rgb(29 78 216 / 0.9))'
              : currentAd.bgGradient.includes('purple')
              ? 'linear-gradient(to right, rgb(147 51 234 / 0.9), rgb(190 24 93 / 0.9))'
              : 'linear-gradient(to right, rgb(5 150 105 / 0.9), rgb(15 118 110 / 0.9))'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Icône">{currentAd.icon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{currentAd.title}</span>
              <span className="text-xs text-white/80">{currentAd.description}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
            <span className="text-xs font-medium hidden lg:inline">En savoir plus</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>
      </div>
    </div>
  );
}
