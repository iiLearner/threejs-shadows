import * as THREE from "three";
import Gui from "../gui/Gui";
import { createLightsDebug } from "./lights-config-new";

export type Lights = {
  hemisphereLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  pointLightFront: THREE.PointLight;
  pointLightBack: THREE.PointLight;
  directionalLightLeft: THREE.DirectionalLight;
  directionalLightBack: THREE.DirectionalLight;
};

export const createLights = (
  scene: THREE.Scene,
) => {
  const hemisphereLight = createHemisphereLight();
  const ambientLight = createAmbientLight();
  const pointLightFront = createPointLightFront();
  const pointLightBack = createPointLightBack();
  const directionalLightLeft = createDirectionalLightLeft();
  const directionalLightBack = createDirectionalLightBack();
  scene.add(
    hemisphereLight,
    pointLightBack,
    directionalLightLeft,
    directionalLightBack,
    pointLightFront
  );

  const lightsCollection: Lights = {
    hemisphereLight,
    ambientLight,
    pointLightFront,
    pointLightBack,
    directionalLightLeft,
    directionalLightBack,
  };

  const gui = new Gui();
  if (gui.debug)
    createLightsDebug(scene, gui.debug, lightsCollection);
  return lightsCollection;
};

const createAmbientLight = (): THREE.AmbientLight => {
  const light: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.1);
  return light;
};

const createHemisphereLight = (): THREE.HemisphereLight => {
  const light: THREE.HemisphereLight = new THREE.HemisphereLight(
    13824255,
    13288633,
    2
  );
  light.position.set(0, 30.76964, 0);
  return light;
};

const createPointLightFront = (): THREE.PointLight => {
  const light: THREE.PointLight = new THREE.PointLight(16777215, 24, 0, 1);
  light.position.set(12.825554, 16.340102, 10.718796);
  return light;
};

const createPointLightBack = (): THREE.PointLight => {
  const light: THREE.PointLight = new THREE.PointLight(16777215, 30, 0, 1);
  light.position.set(0.223137, 10.075519, -20.203);
  return light;
};

const createDirectionalLightLeft = (): THREE.DirectionalLight => {
  const light: THREE.DirectionalLight = new THREE.DirectionalLight(16777215, 3);
  light.position.set(-25.132806, 11.739785, 28.437942);
  return light;
};

const createDirectionalLightBack = (): THREE.DirectionalLight => {
  const light: THREE.DirectionalLight = new THREE.DirectionalLight(16777215, 2);
  light.position.set(-19.027508, 13.855078, -14.548573);
  return light;
};
