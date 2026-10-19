import { fromKey } from "./finance.mjs";

export const niceDate = (key, options = { day: "numeric", month: "long" }) =>
  fromKey(key).toLocaleDateString("es-ES", options);
