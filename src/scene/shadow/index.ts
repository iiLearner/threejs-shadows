import { Asset } from "../Model";
import { addDynamicShadow } from "./shadow";

export const addShadow = async (object: Asset) => {
   return addDynamicShadow(object)
};
