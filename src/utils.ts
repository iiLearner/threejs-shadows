import camelCase from "lodash-es/camelCase";
import flow from "lodash-es/flow";
import upperFirst from "lodash-es/upperFirst";

const pascalCase = flow(camelCase, upperFirst);
export { pascalCase,camelCase };

export const empty = (elem: Element) => {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const canvasClickEvent = (canvas: HTMLCanvasElement) => {
  canvas.addEventListener("click", function () {
    let element = document.getElementById("viewer_tooltip");
    if (element) {
      element.remove();
    }
  });
};
