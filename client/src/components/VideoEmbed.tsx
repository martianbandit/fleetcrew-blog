import { useState } from "react";
import { Play } from "lucide-react";

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

function getVideoInfo(url: string): { type: "youtube" | "vimeo" | null; id: string | null } {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: "youtube", id: match[1] };
    }
  }

  // Vimeo patterns
  const vimeoPattern = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch) {
    return { type: "vimeo", id: vimeoMatch[1] };
  }

  return { type: null, id: null };
}

export function VideoEmbed({ url, title, className }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { type, id } = getVideoInfo(url);

  if (!type || !id) {
    return (
      <div className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Vidéo non supportée</p>
      </div>
    );
  }

  const thumbnailUrl = type === "youtube"
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : null;

  const embedUrl = type === "youtube"
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${id}?autoplay=1`;

  if (!isLoaded && thumbnailUrl) {
    return (
      <div className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer ${className}`}>
        <img
          src={thumbnailUrl}
          alt={title || "Vidéo"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to lower quality thumbnail
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          }}
        />
        <div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors"
          onClick={() => setIsLoaded(true)}
        >
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium">{title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        title={title || "Vidéo intégrée"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default VideoEmbed;
