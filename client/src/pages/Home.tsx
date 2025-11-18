import { lazy, Suspense, useState, type ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PersonalJourney from "@/components/PersonalJourney";
import Skills from "@/components/Skills";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import { Helmet } from "react-helmet-async";
const MissionControl = lazy(() => import("@/components/MissionControl"));
const WorkspaceShowcase = lazy(() => import("@/components/WorkspaceShowcase"));
const ScrollStory = lazy(() => import("@/components/ScrollStory"));
const TechStackVisualization = lazy(() => import("@/components/TechStackVisualization"));
const Experience = lazy(() => import("@/components/Experience"));
const Projects = lazy(() => import("@/components/Projects"));
const RealWorldImpact = lazy(() => import("@/components/RealWorldImpact"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const CertificationsLearning = lazy(() => import("@/components/CertificationsLearning"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Services = lazy(() => import("@/components/Services"));
const CTASection = lazy(() => import("@/components/CTASection"));
const InteractiveContact = lazy(() => import("@/components/InteractiveContact"));
const Footer = lazy(() => import("@/components/Footer"));
const AmbientStatusWidget = lazy(() => import("@/components/AmbientStatusWidget"));
const WasmImageLab = lazy(() => import("@/components/WasmImageLab"));
const P2PIntroVideo = lazy(() => import("@/components/P2PIntroVideo"));
const DigitalGarden = lazy(() => import("@/components/DigitalGarden"));
const SystemDesignBoard = lazy(() => import("@/components/SystemDesignBoard"));
const ARPortal = lazy(() => import("@/components/ARPortal"));
const PricingCalculator = lazy(() => import("@/components/PricingCalculator"));
const WebAuthnDemo = lazy(() => import("@/components/WebAuthnDemo"));
const TimeTravelSlider = lazy(() => import("@/components/TimeTravelSlider"));
const AvailabilityGlobe = lazy(() => import("@/components/AvailabilityGlobe"));
const CodeSnippets = lazy(() => import("@/components/CodeSnippets"));
const SupportMe = lazy(() => import("@/components/SupportMe"));
const ComparisonSlider = lazy(() => import("@/components/ComparisonSlider"));
const StatsDashboard = lazy(() => import("@/components/StatsDashboard"));
const NewsletterSignup = lazy(() => import("@/components/NewsletterSignup"));
const Bookshelf = lazy(() => import("@/components/Bookshelf"));

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      
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
          <meta property="og:title" content="Delowar Hossain | Product Engineer & AI Explorer" />
          <meta
            property="og:description"
            content="From AI coding agents to business OS dashboards—scroll through handcrafted work with motion, 3D, and storytelling."
          />
          <meta property="og:url" content="https://delowar.dev/" />
          <meta property="og:image" content="https://avatars.githubusercontent.com/u/97281919?v=4" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <CustomCursor />
        <Navigation />
        <Hero />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <SectionLoader minHeight="8rem">
            <AmbientStatusWidget />
          </SectionLoader>
        </div>
        <SectionLoader>
          <MissionControl />
        </SectionLoader>
        <SectionLoader>
          <WorkspaceShowcase />
        </SectionLoader>
        <About />
        <PersonalJourney />
        <SectionLoader>
          <ARPortal />
        </SectionLoader>
        <SectionLoader>
          <ScrollStory />
        </SectionLoader>
        <SectionLoader minHeight="20rem">
          <P2PIntroVideo />
        </SectionLoader>
        <Skills />
        <SectionLoader>
          <TechStackVisualization />
        </SectionLoader>
        <SectionLoader>
          <Experience />
        </SectionLoader>
        <SectionLoader>
          <AvailabilityGlobe />
        </SectionLoader>
        <SectionLoader>
          <Projects />
        </SectionLoader>
        <SectionLoader>
          <ComparisonSlider />
        </SectionLoader>
        <SectionLoader>
          <BlogPreview />
        </SectionLoader>
        <SectionLoader>
          <SystemDesignBoard />
        </SectionLoader>
        <SectionLoader>
          <RealWorldImpact />
        </SectionLoader>
        <SectionLoader>
          <StatsDashboard />
        </SectionLoader>
        <SectionLoader>
          <WorkProcess />
        </SectionLoader>
        <SectionLoader>
          <CertificationsLearning />
        </SectionLoader>
        <SectionLoader>
          <PricingCalculator />
        </SectionLoader>
        <SectionLoader>
          <WasmImageLab />
        </SectionLoader>
        <SectionLoader>
          <DigitalGarden />
        </SectionLoader>
        <SectionLoader>
          <Bookshelf />
        </SectionLoader>
        <SectionLoader>
          <CodeSnippets />
        </SectionLoader>
        <SectionLoader>
          <Services />
        </SectionLoader>
        <SectionLoader>
          <SupportMe />
        </SectionLoader>
        <SectionLoader>
          <NewsletterSignup />
        </SectionLoader>
        <SectionLoader>
          <Testimonials />
        </SectionLoader>
        <SectionLoader>
          <CTASection />
        </SectionLoader>
        <SectionLoader>
          <WebAuthnDemo />
        </SectionLoader>
        <SectionLoader>
          <InteractiveContact />
        </SectionLoader>
        <SectionLoader>
          <TimeTravelSlider />
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
}: {
  children: ReactNode;
  minHeight?: string;
}) {
  return (
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
  );
}
