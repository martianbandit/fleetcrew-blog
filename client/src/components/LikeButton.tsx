import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  articleId: number;
  initialLikeCount?: number;
  className?: string;
}

// Generate or retrieve a visitor ID for anonymous users
function getVisitorId(): string {
  const key = "fleetcrew_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

export function LikeButton({ articleId, initialLikeCount = 0, className }: LikeButtonProps) {
  const [visitorId, setVisitorId] = useState<string>("");
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get visitor ID on mount
  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  // Check if user has liked
  const { data: hasLiked } = trpc.analytics.hasLiked.useQuery(
    { articleId, visitorId },
    { enabled: !!visitorId }
  );

  useEffect(() => {
    if (hasLiked !== undefined) {
      setIsLiked(hasLiked);
    }
  }, [hasLiked]);

  // Toggle like mutation
  const toggleLikeMutation = trpc.analytics.toggleLike.useMutation({
    onMutate: () => {
      // Optimistic update
      setIsAnimating(true);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    },
    onError: () => {
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    },
    onSettled: () => {
      setTimeout(() => setIsAnimating(false), 300);
    },
  });

  const handleLike = () => {
    if (!visitorId) return;
    toggleLikeMutation.mutate({ articleId, visitorId });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={!visitorId || toggleLikeMutation.isPending}
      className={cn(
        "gap-2 transition-all duration-200",
        isLiked && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-transform duration-200",
          isLiked && "fill-current",
          isAnimating && "scale-125"
        )}
      />
      <span className="font-medium">{likeCount}</span>
    </Button>
  );
}

export default LikeButton;
