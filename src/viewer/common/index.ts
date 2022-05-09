import * as THREE from "three";
import Controls from "../../scene/Controls";
import { addLights } from "../../scene/lights";
import { Asset } from "../../scene/Model";
import Scene from "../../scene/Scene";
import { addShadow } from "../../scene/shadow";
import { dynamicShadowTick } from "../../scene/shadow/shadow";
import { canvasClickEvent } from "../../utils";

export const addToScene = async (
  model: Asset,
  scene: Scene,
  instance,
  animate: boolean,
) => {
  
  addLights(scene.threeScene);

  // add the objects to the group
  scene.objectsGroup.add(model.getModel());

  // add shadow to the scene
  const shadow = await addShadow(model)
  scene.objectsGroup.add(shadow.shadowGroup)

  // add the group to the scene
  scene.threeScene.add(scene.objectsGroup);
  if (animate) model.animate(scene.objectsGroup, 2000);

  // center all objects to pov point
  scene.center_objects();

  // create controls
  scene.controls = new Controls();

  // update controls on tick
  scene.time.on("tick", () => {
    // update dynamic shadow
    dynamicShadowTick(
      scene.renderer.instance,
      scene.threeScene,
      !!(shadow instanceof THREE.Group) ? undefined : shadow
    );

    // update controls
    scene.controls.update();
  });

  /**
   * what happens once the scene is loaded with object
   */
  scene.onSceneLoaded(scene.container);
  instance.onSceneLoaded();

  /**
   * handles canvas click so we can remove the tooltip
   */
  canvasClickEvent(scene.canvas.instance);

};
