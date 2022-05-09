import { GUI } from "dat.gui";
import * as THREE from "three";
import { ViewerGuid } from "../gui/Gui";
import { Lights } from "./lights-new";

export const createLightsDebug = (
  scene: THREE.Scene,
  gui: ViewerGuid | null,
  lights: Lights,
) => {
  /**
   * create lights helpers, they show lights on the scene
   */
  const helpers = createLightsHelpers(lights, scene);

  /**
   * create lights gui objects
   */
  createLightsGUI(gui, lights, helpers);
};

const createLightsHelpers = (lights: Lights, scene: THREE.Scene) => {
  const {
    hemisphereLight,
    pointLightFront, 
    pointLightBack,
    directionalLightLeft,
    directionalLightBack,
  } = lights;
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    5,
    "blue"
  );
  const pointLightFrontHelper = new THREE.PointLightHelper(
    pointLightFront,
    2,
    "red"
  );
  const pointLightBackHelper = new THREE.PointLightHelper(
    pointLightBack,
    2,
    "gray"
  );
  const directionalLightLeftHelper = new THREE.DirectionalLightHelper(
    directionalLightLeft,
    3,
    "yellow"
  );
  const directionalLightBackHelper = new THREE.DirectionalLightHelper(
    directionalLightBack,
    3,
    "green"
  );
  scene.add(
    hemisphereLightHelper,
    pointLightFrontHelper,
    pointLightBackHelper,
    directionalLightLeftHelper,
    directionalLightBackHelper
  );
  return {
    hemisphereLightHelper,
    pointLightFrontHelper,
    pointLightBackHelper,
    directionalLightLeftHelper,
    directionalLightBackHelper,
  };
};

const createLightsGUI = (
  gui: ViewerGuid | null,
  lights: Lights,
  helpers: {}
) => {
  // create controls debug GUI
  const lightsFolder = gui?.addFolder("Lights");
  // add gui for each light
  for (const light in lights) {
    const folder = createLightsFolder(lightsFolder, light);
    createGeneralLightGUI(folder, lights[light], helpers[`${light}Helper`]);
  }
};

const createGeneralLightGUI = (
  gui: GUI | undefined,
  light: THREE.Light,
  helper: any
) => {
  const generalSettings = gui?.addFolder("general");
  generalSettings?.add(light, "intensity", 0, 50, 0.1).name("intensity");
  generalSettings
    ?.add(light, "visible")
    .name("toggle")
    .onChange(() => {
      if (helper) helper.visible = light.visible;
    });

  const positionSettings = gui?.addFolder("position");
  positionSettings
    ?.add(light.position, "x", -100, 100, 0.001)
    .name("x")
    .onChange(() => helper && helper.update());
  positionSettings?.add(light.position, "y", -100, 100, 0.001).name("y");
  positionSettings?.add(light.position, "z", -100, 100, 0.001).name("z");
};

const createLightsFolder = (gui: GUI | undefined, light: string) => {
  return gui?.addFolder(light);
};
