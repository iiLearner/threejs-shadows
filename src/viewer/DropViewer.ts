import Models from "../scene/Model";
import Scene from "../scene/Scene";
import { addToScene } from "./common";

class DropViewer {
  scene: Scene;
  constructor() {
    const scene = new Scene();
    this.scene = scene;
  }

  init() {
    // setup
    const dropContainer = document.getElementById("drop-container")!;
    dropContainer.style.display = "block";
    this.scene.canvas.instance.style.display = "none";

    // event handler for when object is dropped
    const dropzone = document.getElementById("dropzone");
    dropzone?.addEventListener("change", async (data) => this.ondrop(data));
  }

  private async ondrop(event: Event) {
    const models = new Models();
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files[0].name.endsWith(".glb")) {
      const dropContainer = document.getElementById("drop-container")!;
      dropContainer.style.display = "none";
      this.scene.canvas.instance.style.display = "block";

      // load the model
      const model = await models.loadModel(URL.createObjectURL(files[0]));
      const asset = await models.processModel(model);

      // load the 3d model
      await addToScene(asset, this.scene, this, true);
    }
  }

  onSceneLoaded() {}
}

export default DropViewer;
