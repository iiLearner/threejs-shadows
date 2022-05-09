import Viewer from "./Scene";

class Canvas {
  instance: HTMLCanvasElement;
  constructor() {
    const viewer = new Viewer();
    const canvas = viewer.renderer.instance.domElement;

    canvas.style.cursor = "grab";
    canvas.style.outline = "none";

    canvas.addEventListener("pointerdown", () => {
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("pointerup", () => {
      canvas.style.cursor = "grab";
    });

    this.instance = canvas;
  }
}

export default Canvas;
