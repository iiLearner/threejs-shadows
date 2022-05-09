export interface DynamicShadowProps {
  renderTarget: THREE.WebGLRenderTarget;
  renderTargetBlur: THREE.WebGLRenderTarget;
  shadowCamera: THREE.OrthographicCamera;
  cameraHelper: THREE.CameraHelper;
  depthMaterial: THREE.MeshDepthMaterial;
  horizontalBlurMaterial: THREE.ShaderMaterial;
  verticalBlurMaterial: THREE.ShaderMaterial;
  plane: any;
  fillPlane: any;
  blurPlane: any; // due to a bug in typings
  shadowGroup: THREE.Group; // this contains everything related to the objects on the scene for the shadow
}
