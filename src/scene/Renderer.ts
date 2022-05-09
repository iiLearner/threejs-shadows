import * as THREE from "three";
import Sizes from "../utils/Sizes";

class Renderer {
  instance: THREE.WebGLRenderer;
  constructor(container: Element) {
    const canvas: HTMLCanvasElement | null = container.querySelector("canvas");

    if (canvas == null) {
      throw new Error("Canvas not found");
    }

    this.setrenderer(canvas, container);
  }

  setrenderer(canvas: HTMLCanvasElement, container: Element) {
    this.instance = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      canvas,
    });

    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.physicallyCorrectLights = true;

    const { width, height } = container.getBoundingClientRect();

    this.instance.setSize(width, height);
  }

  update(scene: THREE.Scene, camera: THREE.Camera) {
    this.instance.render(scene, camera);
  }

  resize(sizes: Sizes) {
    this.instance.setSize(sizes.width, sizes.height);
    this.instance.setPixelRatio(Math.min(sizes.pixelRatio, 2));
  }
}

export default Renderer;
