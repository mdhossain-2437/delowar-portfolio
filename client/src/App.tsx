import { Switch, Route } from "wouter";
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
import PlaygroundPage from "@/pages/PlaygroundPage";
import ContactPage from "@/pages/ContactPage";
import ResumePage from "@/pages/ResumePage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";

function Router() {
  return (
    <Switch>
      {/* Home page with its own layout (Navigation + Footer built-in) */}
      <Route path="/" component={Home} />
      
      {/* All other routes wrapped in MainLayout */}
      <Route path="/about">
        <MainLayout>
          <AboutPage />
        </MainLayout>
      </Route>
      
      <Route path="/skills">
        <MainLayout>
          <SkillsPage />
        </MainLayout>
      </Route>
      
      <Route path="/projects/:slug">
        <MainLayout>
          <ProjectDetailPage />
        </MainLayout>
      </Route>
      
      <Route path="/projects">
        <MainLayout>
          <ProjectsPage />
        </MainLayout>
      </Route>
      
      <Route path="/blog/:slug">
        <MainLayout>
          <BlogPostPage />
        </MainLayout>
      </Route>
      
      <Route path="/blog">
        <MainLayout>
          <BlogPage />
        </MainLayout>
      </Route>
      
      <Route path="/playground">
        <MainLayout>
          <PlaygroundPage />
        </MainLayout>
      </Route>
      
      <Route path="/contact">
        <MainLayout>
          <ContactPage />
        </MainLayout>
      </Route>
      
      <Route path="/resume">
        <MainLayout>
          <ResumePage />
        </MainLayout>
      </Route>
      
      <Route path="/dashboard">
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      </Route>
      
      <Route path="/auth/login">
        <MainLayout>
          <LoginPage />
        </MainLayout>
      </Route>
      
      {/* 404 Not Found */}
      <Route>
        <MainLayout>
          <NotFoundPage />
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
