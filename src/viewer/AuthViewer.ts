
import Models from "../scene/Model";
import Scene from "../scene/Scene";
import { addToScene } from "./common";

class AuthViewer {
  models: Models;
  scene: Scene;
  constructor() {
    // load the model class
    this.models = new Models();

    // get scene
    const scene = new Scene();
    this.scene = scene;
  }

  async init() {

    try {

      // load the model
      const model = await this.models.loadModel(
        ''
      );
      const asset = await this.models.processModel(model);

      // create preview - loader
      this.onBeforeSceneLoad();

      // load the 3d model
      await addToScene(
        asset, 
        this.scene,
        this,
        false
      );
    } catch (ex) {
      /**
       * handle what happens if something goes wrong
       */
      console.error(ex);
    }
  }

  onBeforeSceneLoad() {

  }

  onSceneLoaded() {
  }
}

export default AuthViewer;
