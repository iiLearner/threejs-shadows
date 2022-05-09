import viewer from "./src/index";

const params = new URLSearchParams(window.location.search);
const modelCode = params.get('modelCode') ?? ''


viewer({
  selector: "body",
  modelCode,
});
