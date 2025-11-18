import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PersonalJourney from "@/components/PersonalJourney";
import Skills from "@/components/Skills";
import TechStackVisualization from "@/components/TechStackVisualization";
import Projects from "@/components/Projects";
import ProjectMosaicGallery from "@/components/ProjectMosaicGallery";
import RealWorldImpact from "@/components/RealWorldImpact";
import WorkProcess from "@/components/WorkProcess";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Blog from "@/components/Blog";
import InteractiveContact from "@/components/InteractiveContact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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
        <Projects />
        <ProjectMosaicGallery />
        <RealWorldImpact />
        <WorkProcess />
        <Services />
        <Testimonials />
        <Blog />
        <InteractiveContact />
        <Footer />
      </div>
    </>
  );
}
