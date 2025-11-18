import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";

export default function EnhancedHeroModel() {
  const groupRef = useRef<any>(null);
  const sphereRef = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.cos(time * 0.4) * 0.1;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.3;
      sphereRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef}>
          <mesh ref={sphereRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.8, 64, 64]} />
            <meshStandardMaterial
              color="#a78bfa"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={0.2}
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>

          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 3;
            return (
              <Float
                key={i}
                speed={1 + i * 0.1}
                rotationIntensity={1 + i * 0.1}
                floatIntensity={2}
              >
                <mesh
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    Math.sin(angle * 2) * 0.5,
                  ]}
                >
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshStandardMaterial
                    color={i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#22d3ee" : "#34d399"}
                    emissive={i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#22d3ee" : "#34d399"}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </Float>
            );
          })}
        </group>
      </Float>

      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#22d3ee" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#34d399" />
    </>
  );
}
