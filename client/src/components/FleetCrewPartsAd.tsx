import { ExternalLink } from 'lucide-react';

export function FleetCrewPartsAd() {
  return (
    <a
      href="https://fleetcrewparts.base44.app/home"
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      aria-label="Accéder à FleetCrew Parts - Plateforme professionnelle de pièces"
    >
      <img
        src="https://private-us-east-1.manuscdn.com/sessionFile/6KVigfo4BD8124jfGPFVFy/sandbox/cp3ZOele7lqgJaFCCR2sZ3-img-1_1770452266000_na1fn_ZmxlZXRjcmV3LXBhcnRzLWJhbm5lcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNktWaWdmbzRCRDgxMjRqZkdQRlZGeS9zYW5kYm94L2NwM1pPZWxlN2xxZ0phRkNDUjJzWjMtaW1nLTFfMTc3MDQ1MjI2NjAwMF9uYTFmbl9abXhsWlhSamNtVjNMWEJoY25SekxXSmhibTVsY2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LLX8UDtsBCvrJuXJ6gttkRrKaXAwxV8gWovKHDpcfOWPnzmpp6P75fnLIsjSJqHzgvbfW~4vXsSm2PB5GFmj1Toq4XAB8GC~np5oE5i8JNNxRvX0QuUH~pGj5u7-m3z1CRuwipwkLZ1pIPpwDjjpNJ3lrpUv5CQ0LoRIV~rqD8arrZ~9fpuBgFASnd1y-HLXv20T3JdlGEgS-kTir2QgPXzn~qxLEyjf0tdCtNaHP9krya5Pteo1Cg4z4aZ9OggV42vY7pGGahyJ1N~Pp01Wg8ARZmXMY~dRZkI1r0wxQViCO0YVTtbDJfJLukeI5JnSDAl7ISiLuC5RiP8PewIdcQ__"
        alt="FleetCrew Parts - Plateforme Professionnelle de Pièces"
        className="w-full h-auto object-cover"
        loading="lazy"
      />
      
      {/* Overlay hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* External link icon */}
      <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-cyan-600" />
      </div>
    </a>
  );
}
