import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import gsap from "gsap";
import RoomScene from "./RoomScene";
import { useTheme } from "@/contexts/ThemeContext";

interface Room3DExperienceProps {
  className?: string;
}

export default function Room3DExperience({
  className = "",
}: Room3DExperienceProps) {
  const { theme } = useTheme();
  const cameraRef = useRef<any>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const isDarkRoom = theme === "dark";

  const cameraPositions = {
    dark: {
      position: [
        -5.091815760151335 * 1.5,
        4.21834729421205 * 1.5,
        5.338096715730072 * 1.5,
      ] as [number, number, number],
    },
    light: {
      position: [3.2041090652046087, 16.216669507215555, 21.63810658489048] as [
        number,
        number,
        number
      ],
    },
  };

  const getZoomValues = useCallback(
    () => ({
      default: isMobile ? 74 : 135,
      animation: isMobile ? 65 : 110,
    }),
    [isMobile]
  );

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update camera zoom when mobile state changes
  useEffect(() => {
    if (!cameraRef.current) return;

    const zoomValues = getZoomValues();
    cameraRef.current.zoom = zoomValues.default;
    cameraRef.current.updateProjectionMatrix();
  }, [isMobile, getZoomValues]);

  // Initial camera position setup
  useEffect(() => {
    if (!cameraRef.current || !isReady) return;

    const targetPosition = isDarkRoom
      ? cameraPositions.dark.position
      : cameraPositions.light.position;

    gsap.set(cameraRef.current.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
    });
  }, [isReady]);

  // Animate camera when theme changes
  useEffect(() => {
    if (!cameraRef.current || !isReady) return;

    const targetPosition = isDarkRoom
      ? cameraPositions.dark.position
      : cameraPositions.light.position;

    const zoomValues = getZoomValues();

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    tl.to(cameraRef.current, {
      zoom: zoomValues.animation,
      duration: 1,
      ease: "power3.out",
      onStart: () => setIsTransitioning(true),
      onUpdate: () => cameraRef.current?.updateProjectionMatrix(),
    })
      .to(cameraRef.current.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 1.5,
        ease: "power3.out",
      })
      .to(cameraRef.current, {
        zoom: zoomValues.default,
        duration: 1,
        ease: "power3.out",
        onUpdate: () => cameraRef.current?.updateProjectionMatrix(),
      });
  }, [isDarkRoom, isReady, getZoomValues]);

  // Handle pointer/touch movement
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        pointerRef.current.x =
          (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.y =
          -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const zoomValues = getZoomValues();

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        onCreated={() => setIsReady(true)}
      >
        <OrthographicCamera
          ref={cameraRef}
          makeDefault
          position={cameraPositions.dark.position}
          rotation={[
            -0.6138097686916666, -0.6852967312960734, -0.41947779883392433,
          ]}
          zoom={zoomValues.default}
        />
        {isReady && (
          <RoomScene
            isDarkRoom={isDarkRoom}
            isTransitioning={isTransitioning}
            pointerRef={pointerRef}
          />
        )}
      </Canvas>
    </div>
  );
}
