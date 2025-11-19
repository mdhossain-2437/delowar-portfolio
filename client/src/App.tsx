import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import SkillsPage from "@/pages/SkillsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminDashboard from "@/pages/AdminDashboard";
import PlaygroundPage from "@/pages/PlaygroundPage";
import ContactPage from "@/pages/ContactPage";
import ResumePage from "@/pages/ResumePage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TimelinePage from "@/pages/TimelinePage";
import AchievementsPage from "@/pages/AchievementsPage";
import StackPage from "@/pages/StackPage";
import WorkspaceTasksPage from "@/pages/WorkspaceTasksPage";
import MaintenancePage from "@/pages/MaintenancePage";
import ServerErrorPage from "@/pages/ServerErrorPage";
import GuestbookPage from "@/pages/GuestbookPage";
import ARCardPage from "@/pages/ARCardPage";
import UsesPage from "@/pages/UsesPage";
import MediaKitPage from "@/pages/MediaKitPage";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import { useConsoleEasterEggs } from "@/hooks/useConsoleEasterEggs";
import { EnvironmentProvider } from "@/contexts/EnvironmentContext";
import { FocusModeProvider } from "@/contexts/FocusContext";
import { TimeTravelProvider } from "@/contexts/TimeTravelContext";
import OfflineBanner from "@/components/OfflineBanner";
import BugReportWidget from "@/components/BugReportWidget";
import EyeTrackingToggle from "@/components/EyeTrackingToggle";
import DynamicPresenceMeta from "@/components/DynamicPresenceMeta";
import ServiceWorkerStatus from "@/components/ServiceWorkerStatus";
import LighthouseScoreWidget from "@/components/LighthouseScoreWidget";
import FPSRamMonitor from "@/components/FPSRamMonitor";
import AccessibilityDebugger from "@/components/AccessibilityDebugger";

function AppRoutes() {
  return (
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
  );
}

function App() {
  useConsoleEasterEggs();
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
                  <AccessibilityDebugger />
                  <div className="min-h-screen bg-background text-foreground">
                    <OfflineBanner />
                    <BugReportWidget />
                    <EyeTrackingToggle />
                    <LighthouseScoreWidget />
                    <FPSRamMonitor />
                    <Toaster />
                    <AppRoutes />
                    <ServiceWorkerStatus />
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
