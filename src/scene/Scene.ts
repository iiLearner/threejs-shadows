import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import Dom from "../utils/Dom";
import Sizes from "../utils/Sizes";
import Time from "../utils/Time";
import Camera from "./Camera";
import Canvas from "./Canvas";
import Controls from "./Controls";
import Renderer from "./Renderer";
import { Options } from '../index';

let instance: any = null;
class Scene {
  viewerOpts: Options;
  container: Element;
  renderer: Renderer;
  camera: Camera;
  canvas: Canvas;
  controls: Controls;
  time: Time;
  sizes: Sizes;
  threeScene: THREE.Scene;
  objectsGroup: THREE.Group;

  constructor(_viewerOpts?: Options, container?: Element) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.viewerOpts = _viewerOpts!;
    this.container = container!;
  }

  center_objects() {
    // pov point fix - center the main group to the scene
    new THREE.Box3()
      .setFromObject(this.objectsGroup)
      .getCenter(this.objectsGroup.position)
      .multiplyScalar(-1);
  }

  async init() {
    // create the renderer, this will render the scene
    this.renderer = new Renderer(this.container);

    // time management
    this.time = new Time();

    // sizes management, including resize events
    this.sizes = new Sizes();

    // create the canvas and append it to container
    this.canvas = new Canvas();

    // initiate the scene
    this.threeScene = new THREE.Scene();

    // initiate the camera class with prospective camera
    this.camera = new Camera();

    // this group will contain the object and the shadow
    this.objectsGroup = new THREE.Group();

    this.time.on("tick", () => {
      this.renderer.update(this.threeScene, this.camera.instance);
      TWEEN.update();
    });

    this.sizes.on("resize", () => {
      this.renderer.resize(this.sizes);
      this.camera.resize(this.sizes);
    });
  }

  onSceneLoaded(
    container: Element,  ) {
    const dom = new Dom(container);

    /**
     * create tooltip
     */
    dom.createToolTip();

  }
}

export default Scene;
