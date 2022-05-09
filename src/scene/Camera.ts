import * as THREE from "three";
import Sizes from "../utils/Sizes";
import Gui, { ViewerGuid } from "./gui/Gui";
import Viewer from "./Scene";

class Camera {
  instance: THREE.PerspectiveCamera;
  constructor() {
    const viewer = new Viewer();

    const { width, height } = viewer.container.getBoundingClientRect();
    this.instance = new THREE.PerspectiveCamera(
      15,
      width / height,
      0.1,
      100000
    );

    /**
     * dat.gui to debug camera properties when needed
     */
    const gui = new Gui();
    if (gui.debug) this.createCameraDebug(gui.debug);
  }

  resize(sizes: Sizes) {
    this.instance.aspect = sizes.width / sizes.height;
    this.instance.updateProjectionMatrix();
  }

  createCameraDebug(gui: ViewerGuid | null) {
    // create the main camera folder
    const cameraFolder = gui?.addFolder("Camera");

    // create position folder for the camera
    const cameraPositionFolder = cameraFolder?.addFolder("Position");

    // add the properties to the folder
    cameraPositionFolder
      ?.add(this.instance.position, "x")
      .min(-10)
      .max(10)
      .step(0.01);
    cameraPositionFolder
      ?.add(this.instance.position, "y")
      .min(-10)
      .max(10)
      .step(0.01);
    cameraPositionFolder
      ?.add(this.instance.position, "z")
      .min(-10)
      .max(10)
      .step(0.01);

    // create rotation folder for the camera
    const cameraConfigFolder = cameraFolder?.addFolder("Config");

    // add config properties to the folder
    cameraConfigFolder
      ?.add(this.instance, "far")
      .min(10)
      .max(1000)
      .step(1)
      .onChange(() => this.instance.updateProjectionMatrix());

    cameraConfigFolder
      ?.add(this.instance, "near")
      .min(0.01)
      .max(10)
      .step(0.1)
      .onChange(() => this.instance.updateProjectionMatrix());

    cameraConfigFolder
      ?.add(this.instance, "fov")
      .min(1)
      .max(150)
      .step(1)
      .onChange(() => this.instance.updateProjectionMatrix());
  }
}
export default Camera;

export const positionCamera = (
  camera: THREE.PerspectiveCamera,
  cameraClose: number
) => {
  if (cameraClose < 1) cameraClose = 1;
  camera.position.set(cameraClose + 3.2, 0, 360);
  camera.updateProjectionMatrix();
};
