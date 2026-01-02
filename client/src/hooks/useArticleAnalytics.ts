import { useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

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

interface UseArticleAnalyticsOptions {
  articleId: number;
  enabled?: boolean;
}

export function useArticleAnalytics({ articleId, enabled = true }: UseArticleAnalyticsOptions) {
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const hasRecordedViewRef = useRef<boolean>(false);

  const recordViewMutation = trpc.analytics.recordView.useMutation();

  // Record view on mount
  useEffect(() => {
    if (!enabled || hasRecordedViewRef.current) return;

    const visitorId = getVisitorId();
    
    recordViewMutation.mutate({
      articleId,
      visitorId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    });

    hasRecordedViewRef.current = true;
    startTimeRef.current = Date.now();
  }, [articleId, enabled]);

  // Track scroll depth
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
    
    if (scrollPercent > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = scrollPercent;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled, handleScroll]);

  // Get current stats
  const getReadStats = useCallback(() => {
    const readTime = Math.round((Date.now() - startTimeRef.current) / 1000);
    return {
      readTime,
      scrollDepth: maxScrollDepthRef.current,
    };
  }, []);

  return {
    getReadStats,
    visitorId: getVisitorId(),
  };
}

export default useArticleAnalytics;
