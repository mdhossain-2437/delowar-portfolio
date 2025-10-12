import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";

import { MathUtils } from "three";
import type { Group, Mesh } from "three";

export default function HeroModel() {
  const groupRef = useRef<Group>(null);
  const sphereRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.cos(time * 0.5) * 0.3;
    }

    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time) * 0.3;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef}>
          {/* Main sphere */}
          <mesh ref={sphereRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#6366f1"
              wireframe
              transparent
              opacity={0.2}
            />
          </mesh>

          {/* Decorative spheres */}
          {[...Array(8)].map((_, i) => (
            <Float
              key={i}
              speed={1}
              rotationIntensity={1}
              floatIntensity={2}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 2.5,
                Math.sin((i / 8) * Math.PI * 2) * 2.5,
                0,
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color="#22d3ee"
                  emissive="#22d3ee"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            </Float>
          ))}
        </group>
      </Float>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </>
  );
}
