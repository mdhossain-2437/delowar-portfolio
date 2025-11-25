import { lazy, Suspense, useState, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
// Lazy load below-fold components for better initial load
const About = lazy(() => import("@/components/About"));
const ProjectsNew = lazy(() => import("@/components/ProjectsNew"));
const SkillsNew = lazy(() => import("@/components/SkillsNew"));
const ContactNew = lazy(() => import("@/components/ContactNew"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));
import { Helmet } from "react-helmet-async";
const TechStackVisualization = lazy(
  () => import("@/components/TechStackVisualization")
);
const Experience = lazy(() => import("@/components/Experience"));
const RealWorldImpact = lazy(() => import("@/components/RealWorldImpact"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const Footer = lazy(() => import("@/components/Footer"));
const AchievementsPanel = lazy(() => import("@/components/AchievementsPanel"));

export default function Home() {
  return (
    <>
      <div className="overflow-x-hidden">
        <Helmet>
          <title>Delowar Hossain | Product Engineer & AI Explorer</title>
          <meta
            name="description"
            content="Portfolio, workspace, and business tools crafted by Delowar Hossain. Explore projects, case studies, and the private creator OS."
          />
          <meta
            name="keywords"
            content="Delowar Hossain portfolio, Bangladeshi software engineer, React consultant, AI workflow builder, designer developer"
          />
          <meta
            property="og:title"
            content="Delowar Hossain | Product Engineer & AI Explorer"
          />
          <meta
            property="og:description"
            content="From AI coding agents to business OS dashboards—scroll through handcrafted work with motion, 3D, and storytelling."
          />
          <meta property="og:url" content="https://delowar.dev/" />
          <meta
            property="og:image"
            content="https://avatars.githubusercontent.com/u/97281919?v=4"
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <CustomCursor />
        <Navigation />
        <Hero />
        <SectionLoader id="about" minHeight="14rem">
          <About />
        </SectionLoader>
        <SectionLoader id="skills" minHeight="16rem">
          <SkillsNew />
        </SectionLoader>
        <SectionLoader id="stack">
          <TechStackVisualization />
        </SectionLoader>
        <SectionLoader id="experience">
          <Experience />
        </SectionLoader>
        <SectionLoader id="projects">
          <ProjectsNew />
        </SectionLoader>
        <SectionLoader id="impact">
          <RealWorldImpact />
        </SectionLoader>
        <SectionLoader id="blog">
          <BlogPreview />
        </SectionLoader>
        <SectionLoader id="achievements">
          <AchievementsPanel />
        </SectionLoader>
        <SectionLoader id="contact">
          <ContactNew />
        </SectionLoader>
        <SectionLoader minHeight="12rem">
          <Footer />
        </SectionLoader>
      </div>
    </>
  );
}

function SectionLoader({
  children,
  minHeight = "24rem",
  rootMargin = "320px",
  id,
}: {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
  id?: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });

  if (!inView) {
    return (
      <div
        ref={ref}
        id={id}
        className="w-full rounded-3xl border border-white/10 bg-white/5 animate-pulse"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div ref={ref} id={id}>
      <Suspense
        fallback={
          <div
            className="w-full rounded-3xl border border-white/10 bg-white/5 animate-pulse"
            style={{ minHeight }}
          />
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
