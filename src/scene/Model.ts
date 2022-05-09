import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SCALE } from "../constants";
import { positionCamera } from "./Camera";
import Viewer from "./Scene";
import { traverse } from "./utils";

export type Asset = {
  oSize: THREE.Vector3;
  size: () => { x: number; y: number; z: number };
  add: () => void;
  getModel: () => THREE.Group;
  animate: (object: THREE.Group, time: number) => Promise<void>;
};

class Models {

  async loadModel (path: string): Promise<THREE.Group> {
    return new Promise<THREE.Group>((resolve) => {
      const gltfLoader = new GLTFLoader()
      gltfLoader.load(path, (gltf) => {
        const asset = gltf.scene
        resolve(asset)
      })
    })
  }
    
  async processModel(model: THREE.Group): Promise<Asset> {
    const viewer = new Viewer()
    const object = await this.createModel(viewer.threeScene, viewer.camera.instance, model)
    positionCamera(viewer.camera.instance, object.size().x)
    return object
  }

  async createModel(scene: THREE.Scene, camera: THREE.PerspectiveCamera, model: THREE.Group) {
    const size = () => {
      const box = new THREE.Box3().setFromObject(model)
      return box.getSize(new THREE.Vector3())
    }

    const oSize = size()
    model.scale.setScalar(SCALE / size().y)

    traverse(model, (obj) => {
      obj.castShadow = true
      if (obj instanceof THREE.Mesh) {
        if (obj.material) {
          obj.material.side = THREE.FrontSide
        }
      }
    })

    const animate = (object: THREE.Group, time: number): Promise<void> =>
      new Promise<void>((resolve) => {
        var coords = { y: -15, scale: 0.001 }
        new TWEEN.Tween(coords)
          .to({ y: 0, scale: 1 }, time)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function () {
            object.rotation.y = coords.y
            object.scale.setScalar(coords.scale)
          })
          .start()
          .onComplete(() => resolve())
      })

    return {
      oSize,
      size,
      add: () => {
        scene.add(model)
        camera.lookAt(model.position)
        positionCamera(camera, size().x)
      },
      getModel: () => model,
      animate,
    }
  }
}

export default Models;
