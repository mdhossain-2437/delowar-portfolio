import { useRef } from "react";
import { useVideoTexture, useGLTF } from "@react-three/drei";
import { useGLTFWithKTX2 } from "./useGLTFWithKTX2";
import { convertMaterialsToBasic } from "./convertToBasic";
import * as THREE from "three";
import gsap from "gsap";

interface ModelProps {
  position?: [number, number, number];
}

// Dark Room First Model
export function DarkRoomFirst(props: ModelProps) {
  const { nodes, materials } = useGLTFWithKTX2(
    "/models/Dark Room/Dark_First.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  const videoTexture = useVideoTexture("/videos/devwork.mp4", {
    crossOrigin: "anonymous",
    muted: true,
    loop: true,
    playsInline: true,
    start: true,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Mac_Screen.geometry}
        position={[-0.861, 0.815 - 0.02, 0.684]}
        rotation={[0, 0.523, 0]}
      >
        <meshBasicMaterial
          map={videoTexture}
          color="#8a8a8a"
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={nodes.Computer_Screen.geometry}
        position={[-0.302, 0.955 - 0.02, 0.647]}
        rotation={[0, -0.053, 0]}
      >
        <meshBasicMaterial
          map={videoTexture}
          color="#8a8a8a"
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={nodes.First_Baked.geometry}
        material={newMaterials.first_real_realfdsa_Baked}
        position={[-0.231, -0.14 - 0.02, 0.652]}
        rotation={[Math.PI, 0, Math.PI]}
      />
    </group>
  );
}

// Dark Room Second Model
export function DarkRoomSecond(props: ModelProps) {
  const { nodes, materials } = useGLTFWithKTX2(
    "/models/Dark Room/Dark_Second.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Second_Baked.geometry}
        material={newMaterials.Second_Real_Texture_Set_Baked}
        position={[0.053, 0 - 0.02, 0.341]}
        rotation={[Math.PI, 0, Math.PI]}
      />
    </group>
  );
}

// Dark Room Third Model
export function DarkRoomThird(props: ModelProps) {
  const { nodes, materials } = useGLTFWithKTX2(
    "/models/Dark Room/Dark_Third.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Floor_Vaccum_Third_Baked.geometry}
        material={newMaterials.Third_Real_Real_Texture_Set_Baked}
        position={[1.371, 0 - 0.02, -0.354]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={1.015}
      />
      <mesh
        geometry={nodes.Third_Baked.geometry}
        material={newMaterials.Third_Real_Real_Texture_Set_Baked}
        position={[-0.819, 0.746 - 0.02, 1.115]}
        rotation={[Math.PI / 2, 0, 0.47]}
      />
      <mesh
        geometry={nodes.Fan_Third_Baked.geometry}
        material={newMaterials.Third_Real_Real_Texture_Set_Baked}
        position={[0.247, 0.951 - 0.02, 0.524]}
        rotation={[Math.PI / 2, 0, 0.47]}
      />
    </group>
  );
}

// Dark Room Fourth Model
export function DarkRoomFourth(props: ModelProps) {
  const { nodes, materials } = useGLTFWithKTX2(
    "/models/Dark Room/Dark_Fourth.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Fourth_Baked.geometry}
        material={newMaterials.Fourth_Real_Real_Texture_Set_Baked}
        position={[-0.356, 0 - 0.02, 1.362]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        geometry={nodes.Chair_Top_Fourth_Baked.geometry}
        material={newMaterials.Fourth_Real_Real_Texture_Set_Baked}
        position={[-0.373, 0.735 - 0.02, 1.304]}
        rotation={[Math.PI, -0.121, Math.PI]}
      />
    </group>
  );
}

// Dark Room Targets (Interactive Elements)
export function DarkTargets(props: ModelProps) {
  const { nodes } = useGLTF("/models/Dark Room/Dark_Targets.glb") as any;
  const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const aboutAnimRef = useRef<THREE.Mesh>(null);
  const devWorkAnimRef = useRef<THREE.Mesh>(null);

  const onHover = (ref: React.RefObject<THREE.Mesh>, isHovering: boolean) => {
    if (!ref.current) return;
    gsap.to(ref.current.scale, {
      x: isHovering ? 1 : 0,
      y: isHovering ? 1 : 0,
      z: isHovering ? 1 : 0,
      duration: 0.5,
    });
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.About_Hitbox.geometry}
        material={nodes.About_Hitbox.material}
        visible={false}
        position={[0.679, 1.571 - 0.02, -1.368]}
        onPointerOver={() => {
          onHover(aboutAnimRef, true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(aboutAnimRef, false);
          document.body.style.cursor = "auto";
        }}
      />
      <mesh
        ref={aboutAnimRef}
        geometry={nodes.About_Hitbox_Anim.geometry}
        material={whiteMaterial}
        scale={[0, 0, 0]}
        position={[0.679, 1.571 - 0.02, -1.368]}
      />
      <mesh
        geometry={nodes.Dev_Work_Hitbox.geometry}
        material={nodes.Dev_Work_Hitbox.material}
        visible={false}
        position={[-0.457, 0.597 - 0.02, 1.021]}
        onPointerOver={() => {
          onHover(devWorkAnimRef, true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(devWorkAnimRef, false);
          document.body.style.cursor = "auto";
        }}
      />
      <mesh
        ref={devWorkAnimRef}
        geometry={nodes.Dev_Work_Hitbox_Anim.geometry}
        material={whiteMaterial}
        scale={[0, 0, 0]}
        position={[-1.298, 1.166, 1.75]}
      />
    </group>
  );
}

// Light Room First Model
export function LightRoomFirst(props: ModelProps) {
  const { nodes, materials } = useGLTF(
    "/models/Light Room/Light_First.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  const videoTexture = useVideoTexture("/videos/designwork.mp4", {
    crossOrigin: "anonymous",
    muted: true,
    loop: true,
    playsInline: true,
    start: true,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.iPhone_Screen.geometry}
        position={[23.994, 0.734, -1.338]}
        rotation={[0, -1.193, Math.PI / 2]}
      >
        <meshBasicMaterial
          map={videoTexture}
          color="#f6f6f6"
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={nodes.Desktop_Screen.geometry}
        position={[24.377, 0.968, -1.548]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          map={videoTexture}
          color="#f6f6f6"
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={nodes.Light_First_Baked.geometry}
        material={newMaterials.REAL_first_Baked}
        position={[23.66, 1.452, -1.692]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// Light Room Second Model
export function LightRoomSecond(props: ModelProps) {
  const { nodes, materials } = useGLTF(
    "/models/Light Room/Light_Second.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Light_Second_Baked.geometry}
        material={newMaterials.actual_second_bro_Baked}
        position={[26.719, 1.498, 1.614]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  );
}

// Light Room Third Model
export function LightRoomThird(props: ModelProps) {
  const { nodes, materials } = useGLTF(
    "/models/Light Room/Light_Third.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Light_Third_Baked.geometry}
        material={newMaterials.REAL_third_Baked}
        position={[24.79, -0.201, 0.173]}
      />
    </group>
  );
}

// Light Room Fourth Model
export function LightRoomFourth(props: ModelProps) {
  const { nodes, materials } = useGLTFWithKTX2(
    "/models/Light Room/Light_Fourth.glb"
  ) as any;
  const newMaterials = convertMaterialsToBasic(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Light_Fourth_Baked.geometry}
        material={newMaterials.REAL_fourth_Baked}
        position={[26.632, -0.17, -1.134]}
        rotation={[Math.PI, 0, Math.PI]}
      />
    </group>
  );
}

// Light Room Targets (Interactive Elements)
export function LightTargets(props: ModelProps) {
  const { nodes } = useGLTF("/models/Light Room/Light_Targets.glb") as any;
  const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const designWorkAnimRef = useRef<THREE.Mesh>(null);

  const onHover = (ref: React.RefObject<THREE.Mesh>, isHovering: boolean) => {
    if (!ref.current) return;
    gsap.to(ref.current.scale, {
      x: isHovering ? 1 : 0,
      y: isHovering ? 1 : 0,
      z: isHovering ? 1 : 0,
      duration: 0.5,
    });
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Design_Work_Hitbox.geometry}
        material={nodes.Design_Work_Hitbox.material}
        position={[24.434, 0.649, -1.105]}
        visible={false}
        onPointerOver={() => {
          onHover(designWorkAnimRef, true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(designWorkAnimRef, false);
          document.body.style.cursor = "auto";
        }}
      />
      <mesh
        ref={designWorkAnimRef}
        geometry={nodes.Design_Work_Hitbox_Anim.geometry}
        material={blackMaterial}
        position={[23.345, 1.267, -0.573]}
        scale={[0, 0, 0]}
      />
    </group>
  );
}
