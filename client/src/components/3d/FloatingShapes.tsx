import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

export default function FloatingShapes() {
  const group1Ref = useRef<any>(null);
  const group2Ref = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (group1Ref.current) {
      group1Ref.current.rotation.y = time * 0.1;
      group1Ref.current.rotation.x = Math.sin(time * 0.2) * 0.3;
    }
    
    if (group2Ref.current) {
      group2Ref.current.rotation.y = -time * 0.15;
      group2Ref.current.rotation.z = Math.cos(time * 0.1) * 0.2;
    }
  });

  return (
    <>
      <group ref={group1Ref}>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[3, 1, -2]}>
            <octahedronGeometry args={[0.8]} />
            <MeshDistortMaterial
              color="#a78bfa"
              speed={2}
              distort={0.3}
              radius={1}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
        
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
          <mesh position={[-3, -1, -1]}>
            <torusGeometry args={[0.6, 0.2, 16, 32]} />
            <MeshDistortMaterial
              color="#22d3ee"
              speed={3}
              distort={0.4}
              radius={1}
              transparent
              opacity={0.4}
            />
          </mesh>
        </Float>
      </group>

      <group ref={group2Ref}>
        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5}>
          <mesh position={[-2, 2, -3]}>
            <icosahedronGeometry args={[0.7]} />
            <MeshDistortMaterial
              color="#34d399"
              speed={2.5}
              distort={0.35}
              radius={1}
              transparent
              opacity={0.35}
            />
          </mesh>
        </Float>

        <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.8}>
          <mesh position={[2, -2, -2]}>
            <dodecahedronGeometry args={[0.5]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}
