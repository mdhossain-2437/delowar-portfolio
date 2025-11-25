import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import { useConsoleEasterEggs } from "@/hooks/useConsoleEasterEggs";
import { EnvironmentProvider } from "@/contexts/EnvironmentContext";
import { FocusModeProvider } from "@/contexts/FocusContext";
import { TimeTravelProvider } from "@/contexts/TimeTravelContext";
import OfflineBanner from "@/components/OfflineBanner";
import DynamicPresenceMeta from "@/components/DynamicPresenceMeta";

const MainLayout = lazy(() => import("@/components/layout/MainLayout"));
const Home = lazy(() => import("@/pages/Home"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const PlaygroundPage = lazy(() => import("@/pages/PlaygroundPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const ResumePage = lazy(() => import("@/pages/ResumePage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const TimelinePage = lazy(() => import("@/pages/TimelinePage"));
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"));
const StackPage = lazy(() => import("@/pages/StackPage"));
const WorkspaceTasksPage = lazy(() => import("@/pages/WorkspaceTasksPage"));
const MaintenancePage = lazy(() => import("@/pages/MaintenancePage"));
const ServerErrorPage = lazy(() => import("@/pages/ServerErrorPage"));
const GuestbookPage = lazy(() => import("@/pages/GuestbookPage"));
const ARCardPage = lazy(() => import("@/pages/ARCardPage"));
const UsesPage = lazy(() => import("@/pages/UsesPage"));
const MediaKitPage = lazy(() => import("@/pages/MediaKitPage"));

const BugReportWidget = lazy(() => import("@/components/BugReportWidget"));
const EyeTrackingToggle = lazy(() => import("@/components/EyeTrackingToggle"));
const ServiceWorkerStatus = lazy(
  () => import("@/components/ServiceWorkerStatus"),
);
const AccessibilityDebugger = lazy(
  () => import("@/components/AccessibilityDebugger"),
);

function useIdleRender(timeout = 900) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as any;
    const idle = win.requestIdleCallback as
      | undefined
      | ((cb: () => void, opts?: { timeout?: number }) => number);
    const cancelIdle = win.cancelIdleCallback as
      | undefined
      | ((id: number) => void);

    if (idle) {
      const id = idle(() => setReady(true), { timeout });
      return () => cancelIdle?.(id);
    }

    const t = window.setTimeout(() => setReady(true), timeout);
    return () => window.clearTimeout(t);
  }, [timeout]);

  return ready;
}

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          Loading experience...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guestbook" element={<GuestbookPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/workspace/tasks" element={<WorkspaceTasksPage />} />
          <Route path="/uses" element={<UsesPage />} />
          <Route path="media-kit" element={<MediaKitPage />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/server-error" element={<ServerErrorPage />} />
        <Route path="/ar-card" element={<ARCardPage />} />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  useConsoleEasterEggs();
  const enhancersReady = useIdleRender();
  const isProd = useMemo(() => import.meta.env.PROD, []);
  const debugFlag = useMemo(
    () => import.meta.env.VITE_ENABLE_DEBUG_OVERLAYS === "true",
    [],
  );
  const showServiceHelpers = enhancersReady;
  const showDebugOverlays = enhancersReady && (!isProd || debugFlag);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <EnvironmentProvider>
            <FocusModeProvider>
              <TimeTravelProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <DynamicPresenceMeta />
                  <div className="min-h-screen bg-background text-foreground">
                    <OfflineBanner />
                    <Toaster />
                    <AppRoutes />
                    {showServiceHelpers && (
                      <Suspense fallback={null}>
                        <ServiceWorkerStatus />
                      </Suspense>
                    )}
                    {showDebugOverlays && (
                      <Suspense fallback={null}>
                        <BugReportWidget />
                        <EyeTrackingToggle />
                        <AccessibilityDebugger />
                      </Suspense>
                    )}
                  </div>
                </BrowserRouter>
              </TimeTravelProvider>
            </FocusModeProvider>
          </EnvironmentProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
