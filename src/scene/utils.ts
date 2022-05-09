import * as THREE from "three";

export const traverse = (
  start: THREE.Object3D,
  cb: (obj: THREE.Object3D) => void
): void => {
  cb(start);
  start.children.forEach((o) => traverse(o, cb));
};
