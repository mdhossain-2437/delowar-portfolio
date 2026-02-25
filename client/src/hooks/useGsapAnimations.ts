import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for adding GSAP scroll-triggered animations to sections
 * Usage: const sectionRef = useGsapScrollAnimation();
 */
export function useGsapScrollAnimation(options?: {
  animation?:
    | "fadeUp"
    | "fadeIn"
    | "slideLeft"
    | "slideRight"
    | "scaleUp"
    | "flipIn";
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      animation = "fadeUp",
      start = "top 80%",
      end = "top 20%",
      scrub = false,
      markers = false,
    } = options || {};

    // Animation presets
    const animations = {
      fadeUp: {
        from: { opacity: 0, y: 80 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 1, ease: "power2.inOut" },
      },
      slideLeft: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      },
      slideRight: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      },
      scaleUp: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.4)" },
      },
      flipIn: {
        from: { opacity: 0, rotateY: -90 },
        to: { opacity: 1, rotateY: 0, duration: 1.2, ease: "power2.out" },
      },
    };

    const selectedAnimation = animations[animation];

    gsap.fromTo(element, selectedAnimation.from, {
      ...selectedAnimation.to,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        markers,
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [options]);

  return elementRef;
}

/**
 * Hook for staggered children animations
 */
export function useGsapStagger(options?: {
  stagger?: number;
  animation?: "fadeUp" | "fadeIn" | "slideLeft";
  start?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      stagger = 0.1,
      animation = "fadeUp",
      start = "top 80%",
    } = options || {};

    const children = container.children;

    const animations = {
      fadeUp: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { opacity: 0, x: 50 }, to: { opacity: 1, x: 0 } },
    };

    const selectedAnimation = animations[animation];

    gsap.fromTo(children, selectedAnimation.from, {
      ...selectedAnimation.to,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [options]);

  return containerRef;
}

/**
 * Hook for parallax effect on scroll
 */
export function useGsapParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed]);

  return elementRef;
}

/**
 * Hook for text reveal animation
 */
export function useGsapTextReveal() {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Split text into words and wrap each in a span
    const text = element.textContent || "";
    const words = text.split(" ");
    element.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`
      )
      .join(" ");

    const spans = element.querySelectorAll("span > span");

    gsap.fromTo(
      spans,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return textRef;
}

/**
 * Hook for magnetic button effect
 */
export function useGsapMagnetic(strength: number = 0.3) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}
