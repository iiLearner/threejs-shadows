import toolTipImage from "./../assets/handmoveL.png";

class Dom {
  container: Element;
  constructor(_container: Element) {
    this.container = _container;
  }


  createToolTip = (): void => {
    const tooltip_div = document.createElement("div");
    tooltip_div.className = "tooltip";
    tooltip_div.id = "viewer_tooltip";

    const img_div = document.createElement("div");
    img_div.id = "animate";
    tooltip_div.appendChild(img_div);

    const tooltip_img = document.createElement("img");
    tooltip_img.className = "handmove";
    tooltip_img.src = toolTipImage;
    img_div.appendChild(tooltip_img);

    const tooltip_text = document.createElement("p");
    tooltip_text.className = "text-muted";
    tooltip_text.innerHTML = "Click & hold to rotate & zoom";
    tooltip_div.appendChild(tooltip_text);
    

    this.container.appendChild(tooltip_div);
  };
}

export default Dom;
