import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, MeshStandardMaterial, Color, MathUtils } from "three";
import gsap from "gsap";

interface PlaneProps {
  position: [number, number, number];
  planeDepth: number;
  planeWidth: number;
  isDarkRoom: boolean;
  isTransitioning: boolean;
}

function Plane({
  position,
  planeDepth,
  planeWidth,
  isDarkRoom,
  isTransitioning,
}: PlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0,
    });
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const mat = meshRef.current.material as MeshStandardMaterial;
    const targetColor = isDarkRoom ? "#ffffff" : "#000000";
    const targetColorObj = new Color(targetColor);

    gsap.to(mat.color, {
      r: targetColorObj.r,
      g: targetColorObj.g,
      b: targetColorObj.b,
    });
    gsap.to(mat.emissive, {
      r: targetColorObj.r,
      g: targetColorObj.g,
      b: targetColorObj.b,
    });
  }, [isDarkRoom]);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetOpacity = hovered ? 0.8 : 0;
    let lerpFactor = hovered ? 0.1 : 0.03;
    if (isTransitioning) {
      lerpFactor = 0.15;
    }
    setOpacity(MathUtils.lerp(opacity, targetOpacity, lerpFactor));
    (meshRef.current.material as MeshStandardMaterial).opacity = opacity;
    (meshRef.current.material as MeshStandardMaterial).emissiveIntensity =
      hovered ? 1.5 : 0.8;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      onPointerMove={() => {
        if (isTransitioning) return;
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      <planeGeometry args={[planeDepth, planeWidth]} />
    </mesh>
  );
}

interface GridPlanesProps {
  position: [number, number, number];
  rows: number;
  columns: number;
  planeWidth: number;
  planeDepth: number;
  spacing: number;
  isDarkRoom: boolean;
  isTransitioning: boolean;
}

export default function GridPlanes({
  position,
  rows,
  columns,
  planeWidth,
  planeDepth,
  spacing,
  isDarkRoom,
  isTransitioning,
}: GridPlanesProps) {
  const groupRef = useRef<Group>(null);

  const gridWidth = columns * (planeWidth + spacing) - spacing;
  const gridDepth = columns * (planeDepth + spacing) - spacing;

  const startX = planeWidth / 2 - gridWidth / 2;
  const startZ = planeDepth / 2 - gridDepth / 2;

  const planes = useMemo(() => {
    const result = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = startX + column * (planeWidth + spacing);
        const z = startZ + row * (planeDepth + spacing);

        result.push(
          <Plane
            key={`plane-${row}-${column}`}
            planeDepth={planeDepth}
            planeWidth={planeWidth}
            position={[x, -0.125, z]}
            isDarkRoom={isDarkRoom}
            isTransitioning={isTransitioning}
          />
        );
      }
    }
    return result;
  }, [
    rows,
    columns,
    planeWidth,
    planeDepth,
    spacing,
    startX,
    startZ,
    isDarkRoom,
    isTransitioning,
  ]);

  return (
    <group position={position} ref={groupRef}>
      {planes}
    </group>
  );
}
