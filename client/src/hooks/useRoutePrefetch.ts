import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Route prefetch mapping - loads chunks when hovering over links
const routePrefetchMap: Record<string, () => Promise<any>> = {
  "/about": () => import("@/pages/AboutPage"),
  "/skills": () => import("@/pages/SkillsPage"),
  "/projects": () => import("@/pages/ProjectsPage"),
  "/blog": () => import("@/pages/BlogPage"),
  "/contact": () => import("@/pages/ContactPage"),
  "/resume": () => import("@/pages/ResumePage"),
  "/playground": () => import("@/pages/PlaygroundPage"),
  "/guestbook": () => import("@/pages/GuestbookPage"),
  "/timeline": () => import("@/pages/TimelinePage"),
  "/achievements": () => import("@/pages/AchievementsPage"),
  "/stack": () => import("@/pages/StackPage"),
  "/uses": () => import("@/pages/UsesPage"),
  "/media-kit": () => import("@/pages/MediaKitPage"),
};

const prefetchedRoutes = new Set<string>();

export function prefetchRoute(path: string) {
  if (prefetchedRoutes.has(path)) return;

  const loader = routePrefetchMap[path];
  if (loader) {
    prefetchedRoutes.add(path);
    loader().catch(() => {
      // Silently fail - will load on navigation
      prefetchedRoutes.delete(path);
    });
  }
}

export function useRoutePrefetch() {
  const location = useLocation();

  useEffect(() => {
    // Prefetch common routes after initial load
    const timer = setTimeout(() => {
      if (location.pathname === "/") {
        // Prefetch most visited routes
        prefetchRoute("/projects");
        prefetchRoute("/about");
        prefetchRoute("/contact");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Add hover listeners to navigation links
    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]');

      if (link) {
        const href = link.getAttribute("href");
        if (href) {
          prefetchRoute(href);
        }
      }
    };

    // Attach to document for event delegation
    document.addEventListener("mouseover", handleLinkHover);
    document.addEventListener("touchstart", handleLinkHover, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleLinkHover);
      document.removeEventListener("touchstart", handleLinkHover);
    };
  }, []);
}
