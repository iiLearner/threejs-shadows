import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  MAX_DISTANCE_FACTOR,
  MIN_DISTANCE_FACTOR,
  OBJECT_AUTO_ROTATE_SPEED,
} from "../constants";
import Gui, { ViewerGuid } from "./gui/Gui";
import Viewer from "./Scene";

class Controls {
  instance: OrbitControls;
  constructor() {
    const viewer = new Viewer();
    const { camera, canvas } = viewer;

    this.instance = new OrbitControls(camera.instance, canvas.instance);
    this.instance.enabled = true;
    this.instance.enableDamping = true;
    this.instance.maxDistance =
      camera.instance.position.x * MAX_DISTANCE_FACTOR;
    this.instance.minDistance =
      camera.instance.position.x * MIN_DISTANCE_FACTOR;
    this.instance.autoRotate = true;

    // debug gui
    const gui = new Gui();
    if (gui.debug) this.createControlsDebug(gui.debug);
  }

  createControlsDebug(gui: ViewerGuid) {
    // create controls debug GUI
    const controlsFolder = gui?.addFolder("Controls");

    // create main controls
    controlsFolder?.add(this.instance, "enabled");
    controlsFolder?.add(this.instance, "autoRotate");
    controlsFolder
      ?.add(this.instance, "autoRotateSpeed")
      .min(1)
      .max(50)
      .step(1);
    controlsFolder?.add(this.instance, "enableDamping");
    controlsFolder
      ?.add(this.instance, "dampingFactor")
      .min(0)
      .max(50)
      .step(0.001);

    // create rotation controls
    const controlsRotationFolder = controlsFolder?.addFolder("Rotation");
    controlsRotationFolder
      ?.add(this.instance.target, "x")
      .min(-10)
      .max(10)
      .step(0.01);
    controlsRotationFolder
      ?.add(this.instance.target, "y")
      .min(-10)
      .max(10)
      .step(0.01);
    controlsRotationFolder
      ?.add(this.instance.target, "z")
      .min(-10)
      .max(10)
      .step(0.01);
  }

  update() {
    this.instance.update();
  }
}

export default Controls;
