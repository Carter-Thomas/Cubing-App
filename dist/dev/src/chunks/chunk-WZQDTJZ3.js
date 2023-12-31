// node_modules/random-uint-below/dist/esm/index.js
var MAX_JS_PRECISE_INT = 9007199254740992;
var UPPER_HALF_MULTIPLIER = 2097152;
var LOWER_HALF_DIVIDER = 2048;
function crypto() {
  const { crypto: crypto2 } = globalThis;
  if (!crypto2) {
    const { node: nodeVersion } = globalThis.process?.versions;
    if (nodeVersion && parseInt(nodeVersion.split(".")[0]) < 19) {
      throw new Error(
        "`node` 19 or above is required for randomization using `random-uint-below`"
      );
    }
  }
  return crypto2;
}
function random53BitNumber() {
  const arr = new Uint32Array(2);
  crypto().getRandomValues(arr);
  const upper = arr[0];
  const lower = arr[1];
  return Math.floor(upper * UPPER_HALF_MULTIPLIER) + Math.floor(lower / LOWER_HALF_DIVIDER);
}
function validateMax(max) {
  if (typeof max !== "number" || max < 0 || Math.floor(max) !== max) {
    throw new Error(
      "randomUIntBelow() not called with a positive integer value."
    );
  }
  if (max > MAX_JS_PRECISE_INT) {
    throw new Error(
      `Called randomUIntBelow() with max === ${max}, which is larger than JavaScript can handle with integer precision.`
    );
  }
}
function randomUIntBelow(max) {
  validateMax(max);
  let val = random53BitNumber();
  const maxUniformSamplingRange = Math.floor(MAX_JS_PRECISE_INT / max) * max;
  while (val >= maxUniformSamplingRange) {
    return val = random53BitNumber();
  }
  return val % max;
}
function randomChoice(arr) {
  return arr[randomUIntBelow(arr.length)];
}

export {
  randomUIntBelow,
  randomChoice
};
//# sourceMappingURL=chunk-WZQDTJZ3.js.map
