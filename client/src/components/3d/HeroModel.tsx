import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";

export default function HeroModel() {
  const groupRef = useRef<any>(null);
  const sphereRef = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.25;
      groupRef.current.rotation.x = Math.cos(time * 0.32) * 0.2;
    }

    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time) * 0.35;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <Stars radius={40} depth={30} count={2500} factor={4} saturation={0} fade />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.05, 32, 200]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.15} />
      </mesh>

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.5}>
        <group ref={groupRef}>
          <mesh ref={sphereRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#0ea5e9"
              wireframe
              transparent
              opacity={0.28}
              emissive="#0ea5e9"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      </Float>

      <ambientLight intensity={0.6} color="#0ea5e9" />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#a78bfa" />
    </>
  );
}
