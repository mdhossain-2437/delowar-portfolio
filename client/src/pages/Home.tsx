import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import ProjectMosaicGallery from "@/components/ProjectMosaicGallery";
import PDFDownload from "@/components/PDFDownload";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Custom cursor implementation
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.id = "cursor";
    document.body.appendChild(cursor);

    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.transform = `translate(${cursorX - 10}px, ${
        cursorY - 10
      }px)`;
      requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animateCursor();

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cursor.remove();
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <ProjectMosaicGallery />
      <PDFDownload />
      <Contact />
      <Footer />
    </div>
  );
}
