import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PersonalJourney from "@/components/PersonalJourney";
import Skills from "@/components/Skills";
import TechStackVisualization from "@/components/TechStackVisualization";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import FeaturedProjects from "@/components/FeaturedProjects";
import RealWorldImpact from "@/components/RealWorldImpact";
import WorkProcess from "@/components/WorkProcess";
import CertificationsLearning from "@/components/CertificationsLearning";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import CTASection from "@/components/CTASection";
import InteractiveContact from "@/components/InteractiveContact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      
      <div className="overflow-x-hidden">
        <CustomCursor />
        <Navigation />
        <Hero />
        <About />
        <PersonalJourney />
        <Skills />
        <TechStackVisualization />
        <Experience />
        <FeaturedProjects />
        <Projects />
        <RealWorldImpact />
        <WorkProcess />
        <CertificationsLearning />
        <Services />
        <Testimonials />
        <CTASection />
        <InteractiveContact />
        <Footer />
      </div>
    </>
  );
}
