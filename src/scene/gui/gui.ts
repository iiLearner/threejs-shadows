import * as dat from "dat.gui";
import { camelCase } from "../../utils";

let instance: any = null;
export type ViewerGuid = dat.GUI;

class Gui {
  debug: dat.GUI | null = null;
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
  }

  init() {
    if (new URLSearchParams(window.location.search).get("debug") === "true") {
      const gui = new dat.GUI({ width: 400 });
      const exportButton = {
        export: () => {
          const filename = "scene-customization.json";
          const jsonStr = JSON.stringify(this.exportCustomProperties(gui));

          let element = document.createElement("a");
          element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
          );
          element.setAttribute("download", filename);

          element.style.display = "none";
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
        },
      };
      gui.add(exportButton, "export").name("Export");
      this.debug = gui;
      this.debug.open();
    }
  }

  createObjectGUI(gui: dat.GUI | null, object: THREE.Object3D, name: string) {
    const objectFolder = gui?.addFolder(name);

    // create a folder to handle object position
    const objectPositionFolder = objectFolder?.addFolder("Position");

    //add position properties
    objectPositionFolder?.add(object.position, "x").min(-3).max(3).step(0.0001);
    objectPositionFolder?.add(object.position, "y").min(-3).max(3).step(0.0001);
    objectPositionFolder?.add(object.position, "z").min(-3).max(3).step(0.0001);

    // create a folder to handle object position
    const objectRotationFolder = objectFolder?.addFolder("Rotation");

    //add position properties
    objectRotationFolder
      ?.add(object.rotation, "x")
      .min(-10)
      .max(10)
      .step(0.0001);
    objectRotationFolder
      ?.add(object.rotation, "y")
      .min(-10)
      .max(10)
      .step(0.0001);
    objectRotationFolder
      ?.add(object.rotation, "z")
      .min(-10)
      .max(10)
      .step(0.0001);
  }

  exportCustomProperties(gui: dat.GUI) {
    if (!Object.keys(gui.__folders).length) {
      return gui.__controllers.reduce(
        (acc, curr) => ({
          ...acc,
          [camelCase(curr.property)]: curr.getValue(),
        }),
        {}
      );
    }
    return Object.entries(gui.__folders)
      .map(([key, value]) => ({
        [camelCase(key)]: this.exportCustomProperties(value),
      }))
      .reduce((curr, acc) => ({ ...acc, ...curr }), {});
  }
}

export default Gui;
