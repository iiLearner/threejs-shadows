import * as THREE from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";
import { DynamicShadowProps } from "../../model/shadow";
import Gui, { ViewerGuid } from "../gui/Gui";
import { Asset } from "../Model";

export const shadowState = {
  shadow: {
    blur: 3,
    darkness: 1,
    opacity: 1,
  },
  plane: {
    color: "#ffffff",
    opacity: 1,
  },
  camera: {
    height: -1,
  },
};

export const addDynamicShadow = async (
  object: Asset
): Promise<DynamicShadowProps> => {
  // calculate the boundingBox of the object
  const boundingBox = new THREE.Box3().setFromObject(object.getModel());

  // set plane size and camera height accordingly to our object
  const PLANE_WIDTH = -boundingBox.min.x + boundingBox.max.x + 1;
  const PLANE_HEIGHT = (-boundingBox.min.y + boundingBox.max.y) * 2;
  shadowState.camera.height = (-boundingBox.min.z + boundingBox.max.z) / 3;

  // create and add the shadow group to the scene
  const shadowGroup = new THREE.Group();
  shadowGroup.position.y = boundingBox.min.y;

  const renderTarget = new THREE.WebGLRenderTarget(512, 512);
  renderTarget.texture.generateMipmaps = false;

  const renderTargetBlur = new THREE.WebGLRenderTarget(512, 512);
  renderTargetBlur.texture.generateMipmaps = false;

  const planeGeometry = new THREE.PlaneGeometry(
    PLANE_WIDTH,
    PLANE_HEIGHT
  ).rotateX(Math.PI / 2);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
    opacity: shadowState.shadow.opacity,
    transparent: true,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.renderOrder = 1;
  shadowGroup.add(plane);
  plane.scale.y = -1;

  const blurPlane = new THREE.Mesh(planeGeometry);
  blurPlane.visible = false;
  shadowGroup.add(blurPlane);

  const fillPlaneMaterial = new THREE.ShadowMaterial({
    color: shadowState.plane.color,
    opacity: shadowState.plane.opacity,
    transparent: true,
    depthWrite: false,
  });
  const fillPlane = new THREE.Mesh(planeGeometry, fillPlaneMaterial);
  fillPlane.rotateX(Math.PI);
  shadowGroup.add(fillPlane);

  const shadowCamera = new THREE.OrthographicCamera(
    -PLANE_WIDTH / 2,
    PLANE_WIDTH / 2,
    PLANE_HEIGHT / 2,
    -PLANE_HEIGHT / 2,
    0,
    shadowState.camera.height
  );
  shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
  shadowCamera.position.y = -0.01;
  shadowGroup.add(shadowCamera);

  const cameraHelper = new THREE.CameraHelper(shadowCamera);

  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.userData.darkness = { value: shadowState.shadow.darkness };
  depthMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.darkness = depthMaterial.userData.darkness;
    shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(
              "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
              "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );"
            )}
					`;
  };

  depthMaterial.depthTest = false;
  depthMaterial.depthWrite = false;

  const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
  horizontalBlurMaterial.depthTest = false;

  const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
  verticalBlurMaterial.depthTest = false;

  const opts = {
    renderTarget,
    renderTargetBlur,
    depthMaterial,
    horizontalBlurMaterial,
    verticalBlurMaterial,
    cameraHelper,
    shadowCamera,
    blurPlane,
    shadowGroup,
    plane,
    fillPlane,
  };

  const gui = new Gui();
  if (gui.debug) createDynamicShadowGUI(gui.debug, opts);
  return opts;
};

export const blurShadow = (
  amount: number,
  renderer: THREE.WebGLRenderer,
  dynamicShadowProps: DynamicShadowProps
) => {
  const {
    renderTarget,
    renderTargetBlur,
    blurPlane,
    horizontalBlurMaterial,
    verticalBlurMaterial,
    shadowCamera,
  } = dynamicShadowProps;

  blurPlane.visible = true;

  // blur horizontally and draw in the renderTargetBlur
  blurPlane.material = horizontalBlurMaterial;
  blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture;
  horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

  renderer.setRenderTarget(renderTargetBlur);
  renderer.render(blurPlane, shadowCamera);

  // blur vertically and draw in the main renderTarget
  blurPlane.material = verticalBlurMaterial;
  blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture;
  verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

  renderer.setRenderTarget(renderTarget);
  renderer.render(blurPlane, shadowCamera);

  blurPlane.visible = false;
};

export const dynamicShadowTick = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  dynamicShadowProps?: DynamicShadowProps
) => {
  if (dynamicShadowProps) {
    const {
      cameraHelper,
      depthMaterial,
      renderTarget,
      shadowCamera,
    } = dynamicShadowProps;
    cameraHelper.visible = false;
    scene.overrideMaterial = depthMaterial;

    const initialClearAlpha = renderer.getClearAlpha();
    renderer.setClearAlpha(0);

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, shadowCamera);

    scene.overrideMaterial = null;
    cameraHelper.visible = true;

    blurShadow(shadowState.shadow.blur, renderer, dynamicShadowProps);
    blurShadow(shadowState.shadow.blur * 0.4, renderer, dynamicShadowProps);

    renderer.setRenderTarget(null);
    renderer.setClearAlpha(initialClearAlpha);
  }
};

const createDynamicShadowGUI = (
  gui: ViewerGuid | null,
  opts: DynamicShadowProps
) => {
  const shadowFolder = gui?.addFolder("Shadow");
  shadowFolder?.add(shadowState.shadow, "blur", 0, 10, 0.001);
  shadowFolder?.add(shadowState.shadow, "darkness", 0, 5, 0.01).onChange(() => {
    opts.depthMaterial.userData.darkness.value = shadowState.shadow.darkness;
  });
  shadowFolder?.add(shadowState.shadow, "opacity", 0, 5, 0.001).onChange(() => {
    opts.plane.material.opacity = shadowState.shadow.opacity;
  });
};
