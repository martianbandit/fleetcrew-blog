import { ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

/**
 * FleetCrewPartsAd Component
 * 
 * Bannière publicitaire in-content avec images générées.
 * Alternance automatique entre FleetCrew Parts et FleetInspect.
 * Utilisée dans les pages Home et ArticleDetail pour la visibilité in-content.
 */

const banners = [
  {
    id: 'fleetcrew-parts',
    url: 'https://fleetcrewparts.base44.app/home',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/6KVigfo4BD8124jfGPFVFy/sandbox/cp3ZOele7lqgJaFCCR2sZ3-img-1_1770452266000_na1fn_ZmxlZXRjcmV3LXBhcnRzLWJhbm5lcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNktWaWdmbzRCRDgxMjRqZkdQRlZGeS9zYW5kYm94L2NwM1pPZWxlN2xxZ0phRkNDUjJzWjMtaW1nLTFfMTc3MDQ1MjI2NjAwMF9uYTFmbl9abXhsWlhSamNtVjNMWEJoY25SekxXSmhibTVsY2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LLX8UDtsBCvrJuXJ6gttkRrKaXAwxV8gWovKHDpcfOWPnzmpp6P75fnLIsjSJqHzgvbfW~4vXsSm2PB5GFmj1Toq4XAB8GC~np5oE5i8JNNxRvX0QuUH~pGj5u7-m3z1CRuwipwkLZ1pIPpwDjjpNJ3lrpUv5CQ0LoRIV~rqD8arrZ~9fpuBgFASnd1y-HLXv20T3JdlGEgS-kTir2QgPXzn~qxLEyjf0tdCtNaHP9krya5Pteo1Cg4z4aZ9OggV42vY7pGGahyJ1N~Pp01Wg8ARZmXMY~dRZkI1r0wxQViCO0YVTtbDJfJLukeI5JnSDAl7ISiLuC5RiP8PewIdcQ__',
    alt: 'FleetCrew Parts - Plateforme Professionnelle de Pièces',
    label: 'Accéder à FleetCrew Parts - Plateforme professionnelle de pièces',
    accentColor: '#06b6d4',
  },
  {
    id: 'fleetinspect',
    url: 'https://fleetinpect.base44.app',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/6KVigfo4BD8124jfGPFVFy/sandbox/ePfBzvu3fCdM7u6691cb84-img-1_1770496014000_na1fn_ZmxlZXRpbnNwZWN0LWJhbm5lcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNktWaWdmbzRCRDgxMjRqZkdQRlZGeS9zYW5kYm94L2VQZkJ6dnUzZkNkTTd1NjY5MWNiODQtaW1nLTFfMTc3MDQ5NjAxNDAwMF9uYTFmbl9abXhsWlhScGJuTndaV04wTFdKaGJtNWxjZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Bf2ZGibfoHOJmoAa38wLxTgzZ-PDNjPiQznUlAnTOObD~U7SgqzK3QfxMrsK-nHNuDE6gPstUaItmt-NKhMgsGZHQMETHqgEFpyUzR4-~iDgf~6RrGBjp5mckYU8n2pM6TuEh5EujnS~rBvVxS3ek5tEWGwUBEs5qh0YunoGY7lQXYrrHbHPtiRUIScFUC1toUhZlmDz1atNqi3D-CMlr4YYRU3hfnk2LnVl5CdrLGbC~Vb-Lni~t2gDnG4bdsqa95VfvOLQQEX3iIK5x5mmNaK61dkO2Lf8P66WZ-XLoeH77qaFCkdAGH~JxKiRMh0kkK8TZNdJA~APa8W8-OmTxQ__',
    alt: 'FleetInspect - Inspection Intelligente par IA',
    label: 'Accéder à FleetInspect - Inspection intelligente par IA',
    accentColor: '#8b5cf6',
  }
];

export function FleetCrewPartsAd() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const transitionToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      setIsTransitioning(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(transitionToNext, 8000);
    return () => clearInterval(interval);
  }, [isHovered, transitionToNext]);

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative" role="complementary" aria-label="Publicité FleetCrew">
      <a
        href={currentBanner.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
        aria-label={currentBanner.label}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={currentBanner.image}
          alt={currentBanner.alt}
          className="w-full h-auto object-cover transition-opacity duration-400"
          loading="lazy"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        />
        
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        
        {/* Badge sponsorisé */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Sponsorisé</span>
        </div>

        {/* External link icon */}
        <div 
          className="absolute top-3 right-3 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: currentBanner.accentColor }}
        >
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </a>

      {/* Indicateurs de pagination */}
      <div className="flex justify-center gap-2 mt-3">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentBannerIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{
              width: index === currentBannerIndex ? '24px' : '8px',
              height: '8px',
              backgroundColor: index === currentBannerIndex 
                ? banner.accentColor 
                : 'rgba(128, 128, 128, 0.3)',
            }}
            aria-label={`Afficher la bannière ${banner.alt}`}
          />
        ))}
      </div>
    </div>
  );
}
