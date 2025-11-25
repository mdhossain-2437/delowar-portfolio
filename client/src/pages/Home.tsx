import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useInView } from "react-intersection-observer";
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
const TechStackVisualization = lazy(
  () => import("@/components/TechStackVisualization")
);
const Experience = lazy(() => import("@/components/Experience"));
const Projects = lazy(() => import("@/components/Projects"));
const RealWorldImpact = lazy(() => import("@/components/RealWorldImpact"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const CertificationsLearning = lazy(
  () => import("@/components/CertificationsLearning")
);
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Services = lazy(() => import("@/components/Services"));
const CTASection = lazy(() => import("@/components/CTASection"));
const InteractiveContact = lazy(
  () => import("@/components/InteractiveContact")
);
const Footer = lazy(() => import("@/components/Footer"));
const AmbientStatusWidget = lazy(
  () => import("@/components/AmbientStatusWidget")
);
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
const ServerlessMetricsPanel = lazy(
  () => import("@/components/ServerlessMetricsPanel")
);
const CICDStatusWidget = lazy(() => import("@/components/CICDStatusWidget"));
const AudioReactiveCanvas = lazy(
  () => import("@/components/AudioReactiveCanvas")
);
const PersonalizationBanner = lazy(
  () => import("@/components/PersonalizationBanner")
);
const BrowserFingerprintDemo = lazy(
  () => import("@/components/BrowserFingerprintDemo")
);
const ThemeBuilder = lazy(() => import("@/components/ThemeBuilder"));
const CodeReviewHeatmap = lazy(() => import("@/components/CodeReviewHeatmap"));
const GitBranchVisualizer = lazy(
  () => import("@/components/GitBranchVisualizer")
);
const AIQuickEstimate = lazy(() => import("@/components/AIQuickEstimate"));
const TechDebtTracker = lazy(() => import("@/components/TechDebtTracker"));
const DailyTimeCapsule = lazy(() => import("@/components/DailyTimeCapsule"));
const AchievementsPanel = lazy(() => import("@/components/AchievementsPanel"));
const DynamicStoryProgression = lazy(
  () => import("@/components/DynamicStoryProgression")
);
const AvatarCustomizer = lazy(() => import("@/components/AvatarCustomizer"));
const DeveloperBattleGame = lazy(
  () => import("@/components/DeveloperBattleGame")
);
const IsometricSiteMap = lazy(() => import("@/components/IsometricSiteMap"));
const PhysicsDragGallery = lazy(
  () => import("@/components/PhysicsDragGallery")
);
const MicroFrontendShowcase = lazy(
  () => import("@/components/MicroFrontendShowcase")
);
const PrecacheStrategyDemo = lazy(
  () => import("@/components/PrecacheStrategyDemo")
);
const DeviceMotionScene = lazy(() => import("@/components/DeviceMotionScene"));
const DigitalBucketList = lazy(() => import("@/components/DigitalBucketList"));
const KnowledgeGraph = lazy(() => import("@/components/KnowledgeGraph"));
const WelcomeBackBanner = lazy(() => import("@/components/WelcomeBackBanner"));

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [phase1Ready, setPhase1Ready] = useState(false);
  const [phase2Ready, setPhase2Ready] = useState(false);
  const enableLabs = import.meta.env.VITE_ENABLE_LABS === "true";

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase1Ready(true), 100);
    const t2 = window.setTimeout(() => setPhase2Ready(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

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
        <SectionLoader minHeight="9rem">
          <PersonalizationBanner />
        </SectionLoader>
        <SectionLoader minHeight="9rem">
          <WelcomeBackBanner />
        </SectionLoader>
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
          <DynamicStoryProgression />
        </SectionLoader>
        {enableLabs && (
          <SectionLoader>
            <ARPortal />
          </SectionLoader>
        )}
        <SectionLoader>
          <ScrollStory />
        </SectionLoader>
        {enableLabs && (
          <SectionLoader minHeight="20rem">
            <P2PIntroVideo />
          </SectionLoader>
        )}
        {enableLabs && (
          <SectionLoader>
            <DeviceMotionScene />
          </SectionLoader>
        )}
        <Skills />
        {enableLabs && (
          <SectionLoader>
            <AvatarCustomizer />
          </SectionLoader>
        )}
        {enableLabs && phase1Ready && (
          <>
            <SectionLoader minHeight="18rem">
              <AudioReactiveCanvas />
            </SectionLoader>
            <SectionLoader>
              <DeveloperBattleGame />
            </SectionLoader>
            <SectionLoader>
              <ServerlessMetricsPanel />
            </SectionLoader>
            <SectionLoader>
              <CICDStatusWidget />
            </SectionLoader>
            <SectionLoader>
              <PrecacheStrategyDemo />
            </SectionLoader>
            <SectionLoader>
              <MicroFrontendShowcase />
            </SectionLoader>
          </>
        )}
        <SectionLoader>
          <TechStackVisualization />
        </SectionLoader>
        <SectionLoader>
          <PhysicsDragGallery />
        </SectionLoader>
        <SectionLoader>
          <BrowserFingerprintDemo />
        </SectionLoader>
        <SectionLoader>
          <Experience />
        </SectionLoader>
        {enableLabs && (
          <SectionLoader>
            <AvailabilityGlobe />
          </SectionLoader>
        )}
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
          <IsometricSiteMap />
        </SectionLoader>
        <SectionLoader>
          <TechDebtTracker />
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
          <GitBranchVisualizer />
        </SectionLoader>
        <SectionLoader>
          <ThemeBuilder />
        </SectionLoader>
        {enableLabs && (
          <SectionLoader>
            <PricingCalculator />
          </SectionLoader>
        )}
        {enableLabs && (
          <SectionLoader>
            <AIQuickEstimate />
          </SectionLoader>
        )}
        {enableLabs && (
          <SectionLoader>
            <WasmImageLab />
          </SectionLoader>
        )}
        <SectionLoader>
          <DigitalGarden />
        </SectionLoader>
        <SectionLoader>
          <CodeReviewHeatmap />
        </SectionLoader>
        <SectionLoader>
          <DigitalBucketList />
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
          <KnowledgeGraph />
        </SectionLoader>
        <SectionLoader>
          <AchievementsPanel />
        </SectionLoader>
        <SectionLoader>
          <DailyTimeCapsule />
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
        {enableLabs && (
          <SectionLoader>
            <WebAuthnDemo />
          </SectionLoader>
        )}
        <SectionLoader>
          <InteractiveContact />
        </SectionLoader>
        {enableLabs && (
          <SectionLoader>
            <TimeTravelSlider />
          </SectionLoader>
        )}
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
}: {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });

  if (!inView) {
    return (
      <div
        ref={ref}
        className="w-full rounded-3xl border border-white/10 bg-white/5 animate-pulse"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div ref={ref}>
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
