import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

import {
  DarkRoomFirst,
  DarkRoomSecond,
  DarkRoomThird,
  DarkRoomFourth,
  DarkTargets,
  LightRoomFirst,
  LightRoomSecond,
  LightRoomThird,
  LightRoomFourth,
  LightTargets,
} from "./RoomModels";
import GridPlanes from "./GridPlanes";

interface RoomSceneProps {
  isDarkRoom: boolean;
  isTransitioning: boolean;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

const darkRoomGroupPosition = new THREE.Vector3(0, 0, 0);
const lightRoomGroupPosition = new THREE.Vector3(24.79, 0, 0.173);

export default function RoomScene({
  isDarkRoom,
  isTransitioning,
  pointerRef,
}: RoomSceneProps) {
  const darkGroupRef = useRef<THREE.Group>(null);
  const lightGroupRef = useRef<THREE.Group>(null);
  const gridPlanesRef = useRef<THREE.Group>(null);
  const groupRotationRef = useRef(0);

  useEffect(() => {
    if (!gridPlanesRef.current) return;

    const targetPosition = isDarkRoom
      ? darkRoomGroupPosition
      : lightRoomGroupPosition;

    gsap.to(gridPlanesRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      delay: 1,
    });
  }, [isDarkRoom]);

  useFrame(() => {
    if (
      !darkGroupRef.current ||
      !lightGroupRef.current ||
      !gridPlanesRef.current ||
      !pointerRef.current
    )
      return;

    const targetRotation = pointerRef.current.x * Math.PI * 0.032;

    groupRotationRef.current = THREE.MathUtils.lerp(
      groupRotationRef.current,
      targetRotation,
      0.1
    );

    darkGroupRef.current.rotation.y = groupRotationRef.current;
    lightGroupRef.current.rotation.y = groupRotationRef.current;
    gridPlanesRef.current.rotation.y = groupRotationRef.current;
  });

  return (
    <Suspense fallback={null}>
      <group ref={darkGroupRef}>
        <DarkRoomFirst />
        <DarkRoomSecond />
        <DarkRoomThird />
        <DarkRoomFourth />
        <DarkTargets />
      </group>

      <group
        ref={lightGroupRef}
        position={[
          lightRoomGroupPosition.x,
          lightRoomGroupPosition.y,
          lightRoomGroupPosition.z,
        ]}
      >
        <LightRoomFirst
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <LightRoomSecond
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <LightRoomThird
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <LightRoomFourth
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
        <LightTargets
          position={[
            -lightRoomGroupPosition.x,
            -lightRoomGroupPosition.y,
            -lightRoomGroupPosition.z,
          ]}
        />
      </group>

      <group ref={gridPlanesRef}>
        <GridPlanes
          position={
            isDarkRoom
              ? [
                  darkRoomGroupPosition.x,
                  darkRoomGroupPosition.y,
                  darkRoomGroupPosition.z,
                ]
              : [
                  lightRoomGroupPosition.x,
                  lightRoomGroupPosition.y,
                  lightRoomGroupPosition.z,
                ]
          }
          rows={10}
          columns={10}
          planeWidth={3}
          planeDepth={3}
          spacing={0}
          isDarkRoom={isDarkRoom}
          isTransitioning={isTransitioning}
        />
      </group>
    </Suspense>
  );
}
