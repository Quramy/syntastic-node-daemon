import _resolve from "resolve";

export function resolve(id, opt) {
  try {
    return _resolve.sync(id, opt);
  } catch (e) {
    return null;
  }
}
