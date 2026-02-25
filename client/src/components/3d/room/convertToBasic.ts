import * as THREE from "three";

export function convertMaterialsToBasic(
  materials: { [key: string]: THREE.Material },
  alphaTestValue = 0
): { [key: string]: THREE.Material } {
  const newMaterials: { [key: string]: THREE.Material } = {};

  Object.keys(materials).forEach((key) => {
    const oldMaterial = materials[key];
    if (oldMaterial instanceof THREE.MeshStandardMaterial) {
      const newMaterial = new THREE.MeshBasicMaterial({
        map: oldMaterial.map,
        transparent: oldMaterial.transparent,
        alphaTest: oldMaterial.transparent ? 0.1 : alphaTestValue,
      });
      newMaterials[key] = newMaterial;
    } else {
      newMaterials[key] = oldMaterial;
    }
  });

  return newMaterials;
}
