import invariant from "invariant";
import "./assets/app.css";
import Gui from "./scene/gui/Gui";
import Scene from "./scene/Scene";
import AuthViewer from "./viewer/AuthViewer";
import DropViewer from "./viewer/DropViewer";

export type Options = {
  selector: string;
  modelCode: string;
};


export type shadowOptions = {
  add(): void;
  remove(): void;
};


const Viewer = async (opts: Options = {} as Options): Promise<void> => {
  const { selector, modelCode } = opts

  // check if container is valid
  invariant(selector, 'Selector not defined')
  const container = document.querySelector(selector)!
  invariant(container, 'Container is undefined')

  // initiate debug gui
  const gui = new Gui()
  gui.init()

  // initialize scene
  const scene = new Scene(opts, container)

  // setup the scene with renderer and canvas
  scene.init()

  // if input is provided, load Auth viewer - which loads a model
  if (modelCode) {
    const authViewer = new AuthViewer()
    await authViewer.init()
  }

  // otherwise, load Drop viewer - which loads assets from user
  else {
    const dropViewer = new DropViewer()
    dropViewer.init()
  }
}

export default Viewer;
