import { createLights } from "./lights-new";

export const addLights = (
  scene: THREE.Scene,
) => {
  return createLights(scene);
};
