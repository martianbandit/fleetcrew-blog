import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const banners = [
  {
    id: 'fleetcrew-parts',
    url: 'https://fleetcrewparts.base44.app/home',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/6KVigfo4BD8124jfGPFVFy/sandbox/cp3ZOele7lqgJaFCCR2sZ3-img-1_1770452266000_na1fn_ZmxlZXRjcmV3LXBhcnRzLWJhbm5lcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNktWaWdmbzRCRDgxMjRqZkdQRlZGeS9zYW5kYm94L2NwM1pPZWxlN2xxZ0phRkNDUjJzWjMtaW1nLTFfMTc3MDQ1MjI2NjAwMF9uYTFmbl9abXhsWlhSamNtVjNMWEJoY25SekxXSmhibTVsY2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LLX8UDtsBCvrJuXJ6gttkRrKaXAwxV8gWovKHDpcfOWPnzmpp6P75fnLIsjSJqHzgvbfW~4vXsSm2PB5GFmj1Toq4XAB8GC~np5oE5i8JNNxRvX0QuUH~pGj5u7-m3z1CRuwipwkLZ1pIPpwDjjpNJ3lrpUv5CQ0LoRIV~rqD8arrZ~9fpuBgFASnd1y-HLXv20T3JdlGEgS-kTir2QgPXzn~qxLEyjf0tdCtNaHP9krya5Pteo1Cg4z4aZ9OggV42vY7pGGahyJ1N~Pp01Wg8ARZmXMY~dRZkI1r0wxQViCO0YVTtbDJfJLukeI5JnSDAl7ISiLuC5RiP8PewIdcQ__',
    alt: 'FleetCrew Parts - Plateforme Professionnelle de Pièces',
    label: 'Accéder à FleetCrew Parts - Plateforme professionnelle de pièces',
    iconColor: 'text-cyan-600',
    overlayGradient: 'from-cyan-500/10 to-orange-500/10'
  },
  {
    id: 'fleetinspect',
    url: 'https://fleetinpect.base44.app',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/6KVigfo4BD8124jfGPFVFy/sandbox/ePfBzvu3fCdM7u6691cb84-img-1_1770496014000_na1fn_ZmxlZXRpbnNwZWN0LWJhbm5lcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNktWaWdmbzRCRDgxMjRqZkdQRlZGeS9zYW5kYm94L2VQZkJ6dnUzZkNkTTd1NjY5MWNiODQtaW1nLTFfMTc3MDQ5NjAxNDAwMF9uYTFmbl9abXhsWlhScGJuTndaV04wTFdKaGJtNWxjZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Bf2ZGibfoHOJmoAa38wLxTgzZ-PDNjPiQznUlAnTOObD~U7SgqzK3QfxMrsK-nHNuDE6gPstUaItmt-NKhMgsGZHQMETHqgEFpyUzR4-~iDgf~6RrGBjp5mckYU8n2pM6TuEh5EujnS~rBvVxS3ek5tEWGwUBEs5qh0YunoGY7lQXYrrHbHPtiRUIScFUC1toUhZlmDz1atNqi3D-CMlr4YYRU3hfnk2LnVl5CdrLGbC~Vb-Lni~t2gDnG4bdsqa95VfvOLQQEX3iIK5x5mmNaK61dkO2Lf8P66WZ-XLoeH77qaFCkdAGH~JxKiRMh0kkK8TZNdJA~APa8W8-OmTxQ__',
    alt: 'FleetInspect - Inspection Intelligente par IA',
    label: 'Accéder à FleetInspect - Inspection intelligente par IA',
    iconColor: 'text-purple-600',
    overlayGradient: 'from-purple-500/10 to-orange-500/10'
  }
];

export function FleetCrewPartsAd() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    // Alterner entre les bannières toutes les 8 secondes
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative">
      <a
        href={currentBanner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        aria-label={currentBanner.label}
      >
        <img
          src={currentBanner.image}
          alt={currentBanner.alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        
        {/* Overlay hover effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.overlayGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
        
        {/* External link icon */}
        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className={`w-4 h-4 ${currentBanner.iconColor}`} />
        </div>
      </a>

      {/* Indicateurs de pagination */}
      <div className="flex justify-center gap-2 mt-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBannerIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBannerIndex 
                ? 'bg-cyan-500 w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Afficher la bannière ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
