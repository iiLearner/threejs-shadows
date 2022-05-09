import * as THREE from "three";
import Scene from "../scene/Scene";
import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;
  mouse: THREE.Vector2;

  constructor() {
    super();
    const scene = new Scene();

    const { width, height } = scene.container.getBoundingClientRect();

    // Setup
    this.width = width;
    this.height = height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.mouse = new THREE.Vector2();

    // Resize event
    window.addEventListener("resize", () => {
      const { width, height } = scene.container.getBoundingClientRect();
      this.width = width;
      this.height = height;

      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    // Mouse event
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.height) * 2 + 1;

      this.trigger("mousemove");
    });
  }
}
