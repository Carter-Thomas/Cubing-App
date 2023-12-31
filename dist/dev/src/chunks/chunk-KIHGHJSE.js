import {
  from
} from "./chunk-BLFUUVBB.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __privateWrapper,
  __publicField
} from "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-ITZZ44VH.js
var twistyDebugGlobals = {
  shareAllNewRenderers: "auto",
  showRenderStats: false
};
var _latestAssignedIdx, _latestResolvedIdx, _a;
var StaleDropper = (_a = class {
  constructor() {
    __privateAdd(this, _latestAssignedIdx, 0);
    __privateAdd(this, _latestResolvedIdx, 0);
  }
  queue(p) {
    return new Promise(async (resolve, reject) => {
      try {
        const idx = ++__privateWrapper(this, _latestAssignedIdx)._;
        const result = await p;
        if (idx > __privateGet(this, _latestResolvedIdx)) {
          __privateSet(this, _latestResolvedIdx, idx);
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}, _latestAssignedIdx = new WeakMap(), _latestResolvedIdx = new WeakMap(), _a);
var globalSourceGeneration = 0;
var _children, _rawListeners, _scheduleRawDispatch, scheduleRawDispatch_fn, _rawDispatchPending, _dispatchRawListeners, dispatchRawListeners_fn, _freshListeners, _a2;
var TwistyPropParent = (_a2 = class {
  constructor() {
    /** @deprecated */
    __privateAdd(this, _scheduleRawDispatch);
    __privateAdd(this, _dispatchRawListeners);
    // Propagation
    __privateAdd(this, _children, /* @__PURE__ */ new Set());
    __publicField(this, "lastSourceGeneration", 0);
    __privateAdd(this, _rawListeners, /* @__PURE__ */ new Set());
    __privateAdd(this, _rawDispatchPending, false);
    __privateAdd(this, _freshListeners, /* @__PURE__ */ new Map());
  }
  // Don't overwrite this. Overwrite `canReuseValue` instead.
  canReuse(v1, v2) {
    return v1 === v2 || this.canReuseValue(v1, v2);
  }
  // Overwrite with a cheap semantic comparison when possible.
  // Note that this is not called if `v1 === v2` (in which case the value is automatically reused).
  canReuseValue(_v1, _v2) {
    return false;
  }
  debugGetChildren() {
    return Array.from(__privateGet(this, _children).values());
  }
  addChild(child) {
    __privateGet(this, _children).add(child);
  }
  removeChild(child) {
    __privateGet(this, _children).delete(child);
  }
  // Synchronously marks all descendants as stale. This doesn't actually
  // literally mark as stale, but it updates the last source generation, which
  // is used to tell if a cahced result is stale.
  markStale(sourceEvent) {
    if (sourceEvent.detail.generation !== globalSourceGeneration) {
      throw new Error("A TwistyProp was marked stale too late!");
    }
    if (this.lastSourceGeneration === sourceEvent.detail.generation) {
      return;
    }
    this.lastSourceGeneration = sourceEvent.detail.generation;
    for (const child of __privateGet(this, _children)) {
      child.markStale(sourceEvent);
    }
    __privateMethod(this, _scheduleRawDispatch, scheduleRawDispatch_fn).call(this);
  }
  /** @deprecated */
  addRawListener(listener, options) {
    __privateGet(this, _rawListeners).add(listener);
    if (options?.initial) {
      listener();
    }
  }
  /** @deprecated */
  removeRawListener(listener) {
    __privateGet(this, _rawListeners).delete(listener);
  }
  // TODO: Pick a better name.
  addFreshListener(listener) {
    const staleDropper = new StaleDropper();
    let lastResult = null;
    const callback = async () => {
      const result = await staleDropper.queue(this.get());
      if (lastResult !== null && this.canReuse(lastResult, result)) {
        return;
      }
      lastResult = result;
      listener(result);
    };
    __privateGet(this, _freshListeners).set(listener, callback);
    this.addRawListener(callback, { initial: true });
  }
  removeFreshListener(listener) {
    this.removeRawListener(__privateGet(this, _freshListeners).get(listener));
    __privateGet(this, _freshListeners).delete(listener);
  }
}, _children = new WeakMap(), _rawListeners = new WeakMap(), _scheduleRawDispatch = new WeakSet(), scheduleRawDispatch_fn = function() {
  if (!__privateGet(this, _rawDispatchPending)) {
    __privateSet(this, _rawDispatchPending, true);
    setTimeout(() => __privateMethod(this, _dispatchRawListeners, dispatchRawListeners_fn).call(this), 0);
  }
}, _rawDispatchPending = new WeakMap(), _dispatchRawListeners = new WeakSet(), dispatchRawListeners_fn = function() {
  if (!__privateGet(this, _rawDispatchPending)) {
    throw new Error("Invalid dispatch state!");
  }
  for (const listener of __privateGet(this, _rawListeners)) {
    listener();
  }
  __privateSet(this, _rawDispatchPending, false);
}, _freshListeners = new WeakMap(), _a2);
var _value, _a3;
var TwistyPropSource = (_a3 = class extends TwistyPropParent {
  constructor(initialValue) {
    super();
    __privateAdd(this, _value, void 0);
    __privateSet(this, _value, from(() => this.getDefaultValue()));
    if (initialValue) {
      __privateSet(this, _value, this.deriveFromPromiseOrValue(initialValue, __privateGet(this, _value)));
    }
  }
  set(input) {
    __privateSet(this, _value, this.deriveFromPromiseOrValue(input, __privateGet(this, _value)));
    const sourceEventDetail = {
      sourceProp: this,
      value: __privateGet(this, _value),
      generation: ++globalSourceGeneration
    };
    this.markStale(
      new CustomEvent("stale", {
        detail: sourceEventDetail
      })
    );
  }
  async get() {
    return __privateGet(this, _value);
  }
  async deriveFromPromiseOrValue(input, oldValuePromise) {
    return this.derive(await input, oldValuePromise);
  }
}, _value = new WeakMap(), _a3);
var SimpleTwistyPropSource = class extends TwistyPropSource {
  derive(input) {
    return input;
  }
};
var NO_VALUE = Symbol("no value");
var _parents, _cachedLastSuccessfulCalculation, _cachedLatestGenerationCalculation, _getParents, getParents_fn, _cacheDerive, cacheDerive_fn, _a4;
var TwistyPropDerived = (_a4 = class extends TwistyPropParent {
  constructor(parents, userVisibleErrorTracker) {
    super();
    __privateAdd(this, _getParents);
    __privateAdd(this, _cacheDerive);
    // cachedInputs:
    __privateAdd(this, _parents, void 0);
    __privateAdd(this, _cachedLastSuccessfulCalculation, null);
    __privateAdd(this, _cachedLatestGenerationCalculation, null);
    this.userVisibleErrorTracker = userVisibleErrorTracker;
    __privateSet(this, _parents, parents);
    for (const parent of Object.values(parents)) {
      parent.addChild(this);
    }
  }
  async get() {
    const generation = this.lastSourceGeneration;
    if (__privateGet(this, _cachedLatestGenerationCalculation)?.generation === generation) {
      return __privateGet(this, _cachedLatestGenerationCalculation).output;
    }
    const latestGenerationCalculation = {
      generation,
      output: __privateMethod(this, _cacheDerive, cacheDerive_fn).call(this, __privateMethod(this, _getParents, getParents_fn).call(this), generation, __privateGet(this, _cachedLastSuccessfulCalculation))
    };
    __privateSet(this, _cachedLatestGenerationCalculation, latestGenerationCalculation);
    this.userVisibleErrorTracker?.reset();
    return latestGenerationCalculation.output;
  }
}, _parents = new WeakMap(), _cachedLastSuccessfulCalculation = new WeakMap(), _cachedLatestGenerationCalculation = new WeakMap(), _getParents = new WeakSet(), getParents_fn = async function() {
  const inputValuePromises = {};
  for (const [key, parent] of Object.entries(__privateGet(this, _parents))) {
    inputValuePromises[key] = parent.get();
  }
  const inputs = {};
  for (const key in __privateGet(this, _parents)) {
    inputs[key] = await inputValuePromises[key];
  }
  return inputs;
}, _cacheDerive = new WeakSet(), cacheDerive_fn = async function(inputsPromise, generation, cachedLatestGenerationCalculation = null) {
  const inputs = await inputsPromise;
  const cache = (output) => {
    __privateSet(this, _cachedLastSuccessfulCalculation, {
      inputs,
      output: Promise.resolve(output),
      generation
    });
    return output;
  };
  if (!cachedLatestGenerationCalculation) {
    return cache(await this.derive(inputs));
  }
  const cachedInputs = cachedLatestGenerationCalculation.inputs;
  for (const key in __privateGet(this, _parents)) {
    const parent = __privateGet(this, _parents)[key];
    if (!parent.canReuse(inputs[key], cachedInputs[key])) {
      return cache(await this.derive(inputs));
    }
  }
  return cachedLatestGenerationCalculation.output;
}, _a4);
var _disconnectionFunctions, _a5;
var FreshListenerManager = (_a5 = class {
  constructor() {
    __privateAdd(this, _disconnectionFunctions, []);
  }
  addListener(prop, listener) {
    let disconnected = false;
    const wrappedListener = (value) => {
      if (disconnected) {
        return;
      }
      listener(value);
    };
    prop.addFreshListener(wrappedListener);
    __privateGet(this, _disconnectionFunctions).push(() => {
      prop.removeFreshListener(wrappedListener);
      disconnected = true;
    });
  }
  // TODO: Figure out the signature to let us do overloads
  /** @deprecated */
  addMultiListener3(props, listener) {
    this.addMultiListener(props, listener);
  }
  addMultiListener(props, listener) {
    let disconnected = false;
    let initialIgnoresLeft = props.length - 1;
    const wrappedListener = async (_) => {
      if (initialIgnoresLeft > 0) {
        initialIgnoresLeft--;
        return;
      }
      if (disconnected) {
        return;
      }
      const promises = props.map(
        (prop) => prop.get()
      );
      const values = await Promise.all(promises);
      listener(values);
    };
    for (const prop of props) {
      prop.addFreshListener(wrappedListener);
    }
    __privateGet(this, _disconnectionFunctions).push(() => {
      for (const prop of props) {
        prop.removeFreshListener(wrappedListener);
      }
      disconnected = true;
    });
  }
  disconnect() {
    for (const disconnectionFunction of __privateGet(this, _disconnectionFunctions)) {
      disconnectionFunction();
    }
  }
}, _disconnectionFunctions = new WeakMap(), _a5);
var RenderScheduler = class {
  constructor(callback) {
    __publicField(this, "animFrameID", null);
    __publicField(this, "animFrame", this.animFrameWrapper.bind(this));
    this.callback = callback;
  }
  requestIsPending() {
    return !!this.animFrameID;
  }
  requestAnimFrame() {
    if (!this.animFrameID) {
      this.animFrameID = requestAnimationFrame(this.animFrame);
    }
  }
  cancelAnimFrame() {
    if (this.animFrameID) {
      cancelAnimationFrame(this.animFrameID);
      this.animFrameID = 0;
    }
  }
  animFrameWrapper(timestamp) {
    this.animFrameID = 0;
    this.callback(timestamp);
  }
};
var hintFaceletStyles = {
  floating: true,
  // default
  none: true
};
var HintFaceletProp = class extends SimpleTwistyPropSource {
  getDefaultValue() {
    return "auto";
  }
};
var TAU = Math.PI * 2;
var DEGREES_PER_RADIAN = 360 / TAU;
var HTMLElementStub = class {
};
var HTMLElementShim;
if (globalThis.HTMLElement) {
  HTMLElementShim = HTMLElement;
} else {
  HTMLElementShim = HTMLElementStub;
}
var CustomElementsStub = class {
  define() {
  }
};
var customElementsShim;
if (globalThis.customElements) {
  customElementsShim = customElements;
} else {
  customElementsShim = new CustomElementsStub();
}
var CSSSource = class {
  constructor(sourceText) {
    this.sourceText = sourceText;
  }
  getAsString() {
    return this.sourceText;
  }
};
var _cssSourceMap, _a6;
var ManagedCustomElement = (_a6 = class extends HTMLElementShim {
  constructor(options) {
    super();
    __publicField(this, "shadow");
    // TODO: hide this
    __publicField(this, "contentWrapper");
    // TODO: can we get rid of this wrapper?
    __privateAdd(this, _cssSourceMap, /* @__PURE__ */ new Map());
    this.shadow = this.attachShadow({ mode: options?.mode ?? "closed" });
    this.contentWrapper = document.createElement("div");
    this.contentWrapper.classList.add("wrapper");
    this.shadow.appendChild(this.contentWrapper);
  }
  // Add the source, if not already added.
  // Returns the existing if it's already on the element.
  addCSS(cssSource) {
    const existing = __privateGet(this, _cssSourceMap).get(cssSource);
    if (existing) {
      return existing;
    }
    const cssElem = document.createElement("style");
    cssElem.textContent = cssSource.getAsString();
    __privateGet(this, _cssSourceMap).set(cssSource, cssElem);
    this.shadow.appendChild(cssElem);
    return cssElem;
  }
  // Remove the source, if it's currently added.
  removeCSS(cssSource) {
    const cssElem = __privateGet(this, _cssSourceMap).get(cssSource);
    if (!cssElem) {
      return;
    }
    this.shadow.removeChild(cssElem);
    __privateGet(this, _cssSourceMap).delete(cssSource);
  }
  addElement(element) {
    return this.contentWrapper.appendChild(element);
  }
  prependElement(element) {
    this.contentWrapper.prepend(element);
  }
  removeElement(element) {
    return this.contentWrapper.removeChild(element);
  }
}, _cssSourceMap = new WeakMap(), _a6);
customElementsShim.define(
  "twisty-managed-custom-element",
  ManagedCustomElement
);
var performance = globalThis.performance;
var Stats = class {
  constructor() {
    __publicField(this, "mode", 0);
    __publicField(this, "dom", document.createElement("div"));
    __publicField(this, "beginTime", (performance || Date).now());
    __publicField(this, "prevTime", this.beginTime);
    __publicField(this, "frames", 0);
    __publicField(this, "fpsPanel", this.addPanel(new StatsPanel("FPS", "#0ff", "#002")));
    __publicField(this, "msPanel", this.addPanel(new StatsPanel("MS", "#0f0", "#020")));
    __publicField(this, "memPanel", performance?.memory ? this.addPanel(new StatsPanel("MB", "#f08", "#201")) : null);
    __publicField(this, "REVISION", 16);
    this.dom.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
    this.dom.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.showPanel(++this.mode % this.dom.children.length);
      },
      false
    );
    this.showPanel(0);
  }
  addPanel(panel) {
    this.dom.appendChild(panel.dom);
    return panel;
  }
  showPanel(id) {
    for (let i = 0; i < this.dom.children.length; i++) {
      this.dom.children[i].style.display = i === id ? "block" : "none";
    }
    this.mode = id;
  }
  begin() {
    this.beginTime = (performance || Date).now();
  }
  end() {
    this.frames++;
    const time = (performance || Date).now();
    this.msPanel.update(time - this.beginTime, 200);
    if (time >= this.prevTime + 1e3) {
      this.fpsPanel.update(this.frames * 1e3 / (time - this.prevTime), 100);
      this.prevTime = time;
      this.frames = 0;
      if (this.memPanel) {
        const memory = performance.memory;
        this.memPanel.update(
          memory.usedJSHeapSize / 1048576,
          memory.jsHeapSizeLimit / 1048576
        );
      }
    }
    return time;
  }
  update() {
    this.beginTime = this.end();
  }
};
var PR = Math.round(globalThis?.window?.devicePixelRatio ?? 1);
var WIDTH = 80 * PR;
var HEIGHT = 48 * PR;
var TEXT_X = 3 * PR;
var TEXT_Y = 2 * PR;
var GRAPH_X = 3 * PR;
var GRAPH_Y = 15 * PR;
var GRAPH_WIDTH = 74 * PR;
var GRAPH_HEIGHT = 30 * PR;
var StatsPanel = class {
  constructor(name, fg, bg) {
    __publicField(this, "min", Infinity);
    __publicField(this, "max", 0);
    __publicField(this, "dom", document.createElement("canvas"));
    __publicField(this, "context", this.dom.getContext("2d"));
    this.name = name;
    this.fg = fg;
    this.bg = bg;
    this.dom.width = WIDTH;
    this.dom.height = HEIGHT;
    this.dom.style.cssText = "width:80px;height:48px";
    this.context.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`;
    this.context.textBaseline = "top";
    this.context.fillStyle = bg;
    this.context.fillRect(0, 0, WIDTH, HEIGHT);
    this.context.fillStyle = fg;
    this.context.fillText(name, TEXT_X, TEXT_Y);
    this.context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    this.context.fillStyle = bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
  }
  update(value, maxValue) {
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 1;
    this.context.fillRect(0, 0, WIDTH, GRAPH_Y);
    this.context.fillStyle = this.fg;
    this.context.fillText(
      `${Math.round(value)} ${this.name} (${Math.round(this.min)}-${Math.round(
        this.max
      )})`,
      TEXT_X,
      TEXT_Y
    );
    this.context.drawImage(
      this.dom,
      GRAPH_X + PR,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT,
      GRAPH_X,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT
    );
    this.context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      PR,
      GRAPH_HEIGHT
    );
    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      PR,
      Math.round((1 - value / maxValue) * GRAPH_HEIGHT)
    );
  }
};
var cachedConstructorProxy = null;
async function proxy3D() {
  return cachedConstructorProxy ?? (cachedConstructorProxy = import("./twisty-dynamic-3d-IRLKRUGR-YHAK4V5M.js"));
}
var THREEJS = from(
  async () => (await proxy3D()).T3I
);
var globalPixelRatioOverride = null;
function pixelRatio() {
  return globalPixelRatioOverride ?? (devicePixelRatio || 1);
}
var twisty3DVantageCSS = new CSSSource(
  `
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  place-content: center;
  contain: strict;
}

.loading {
  width: 4em;
  height: 4em;
  border-radius: 2.5em;
  border: 0.5em solid rgba(0, 0, 0, 0);
  border-top: 0.5em solid rgba(0, 0, 0, 0.7);
  border-right: 0.5em solid rgba(0, 0, 0, 0.7);
  animation: fade-in-delayed 4s, rotate 1s linear infinite;
}

@keyframes fade-in-delayed {
  0% { opacity: 0; }
  25% {opacity: 0; }
  100% { opacity: 1; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* TODO: This is due to stats hack. Replace with \`canvas\`. */
.wrapper > canvas {
  max-width: 100%;
  max-height: 100%;
  animation: fade-in 0.25s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wrapper.invisible {
  opacity: 0;
}

.wrapper.drag-input-enabled > canvas {
  cursor: grab;
}

.wrapper.drag-input-enabled > canvas:active {
  cursor: grabbing;
}
`
);
var MOVEMENT_EPSILON = 0.1;
var _dragInfoMap, _targetListeners, _lazyListenersRegistered, _registerLazyListeners, registerLazyListeners_fn, _clear, clear_fn, _trackDrag, trackDrag_fn, _a7;
var DragTracker = (_a7 = class extends EventTarget {
  constructor(target) {
    super();
    __privateAdd(this, _registerLazyListeners);
    __privateAdd(this, _clear);
    // `null`: means: ignore this result (no movement, or not
    __privateAdd(this, _trackDrag);
    __privateAdd(this, _dragInfoMap, /* @__PURE__ */ new Map());
    __privateAdd(this, _targetListeners, /* @__PURE__ */ new Map());
    // This allows us to avoid getting a callback every time the pointer moves over the canvas, until we have a down event.
    // TODO: Ideally we'd also support unregistering when we're certain there are no more active touches. But this means we need to properly handle every way a pointer "click" can end, which is tricky across environments (due to e.g. mouse vs. touch vs. stylues, canvas/viewport/window/scroll boundaries, right-click and other ways of losing focus, etc.), so we conservatively leave the listeners on.
    __privateAdd(this, _lazyListenersRegistered, false);
    this.target = target;
  }
  // Idempotent
  start() {
    this.addTargetListener("pointerdown", this.onPointerDown.bind(this));
    this.addTargetListener("contextmenu", (e) => {
      e.preventDefault();
    });
    this.addTargetListener("touchmove", (e) => e.preventDefault());
    this.addTargetListener("dblclick", (e) => e.preventDefault());
  }
  // Idempotent
  stop() {
    for (const [eventType, listener] of __privateGet(this, _targetListeners).entries()) {
      this.target.removeEventListener(eventType, listener);
    }
    __privateGet(this, _targetListeners).clear();
    __privateSet(this, _lazyListenersRegistered, false);
  }
  addTargetListener(eventType, listener) {
    if (!__privateGet(this, _targetListeners).has(eventType)) {
      this.target.addEventListener(eventType, listener);
      __privateGet(this, _targetListeners).set(eventType, listener);
    }
  }
  onPointerDown(e) {
    __privateMethod(this, _registerLazyListeners, registerLazyListeners_fn).call(this);
    const newDragInfo = {
      attachedInfo: {},
      hasMoved: false,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      lastTimeStamp: e.timeStamp
    };
    __privateGet(this, _dragInfoMap).set(e.pointerId, newDragInfo);
    this.target.setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    const movementInfo = __privateMethod(this, _trackDrag, trackDrag_fn).call(this, e).movementInfo;
    if (movementInfo) {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("move", {
          detail: movementInfo
        })
      );
    }
  }
  onPointerUp(e) {
    const trackDragResult = __privateMethod(this, _trackDrag, trackDrag_fn).call(this, e);
    const existing = __privateGet(this, _dragInfoMap).get(e.pointerId);
    __privateMethod(this, _clear, clear_fn).call(this, e);
    this.target.releasePointerCapture(e.pointerId);
    let event;
    if (trackDragResult.hasMoved) {
      event = new CustomEvent("up", {
        detail: { attachedInfo: existing.attachedInfo }
      });
    } else {
      const { altKey, ctrlKey, metaKey, shiftKey } = e;
      event = new CustomEvent("press", {
        detail: {
          normalizedX: e.offsetX / this.target.offsetWidth * 2 - 1,
          normalizedY: 1 - e.offsetY / this.target.offsetHeight * 2,
          rightClick: !!(e.button & 2),
          keys: {
            altKey,
            ctrlOrMetaKey: ctrlKey || metaKey,
            shiftKey
          }
        }
      });
    }
    this.dispatchEvent(event);
  }
}, _dragInfoMap = new WeakMap(), _targetListeners = new WeakMap(), _lazyListenersRegistered = new WeakMap(), _registerLazyListeners = new WeakSet(), registerLazyListeners_fn = function() {
  if (__privateGet(this, _lazyListenersRegistered)) {
    return;
  }
  this.addTargetListener("pointermove", this.onPointerMove.bind(this));
  this.addTargetListener("pointerup", this.onPointerUp.bind(this));
  __privateSet(this, _lazyListenersRegistered, true);
}, _clear = new WeakSet(), clear_fn = function(e) {
  __privateGet(this, _dragInfoMap).delete(e.pointerId);
}, _trackDrag = new WeakSet(), trackDrag_fn = function(e) {
  const existing = __privateGet(this, _dragInfoMap).get(e.pointerId);
  if (!existing) {
    return { movementInfo: null, hasMoved: false };
  }
  let movementInfo;
  if ((e.movementX ?? 0) !== 0 || (e.movementY ?? 0) !== 0) {
    movementInfo = {
      attachedInfo: existing.attachedInfo,
      movementX: e.movementX,
      movementY: e.movementY,
      elapsedMs: e.timeStamp - existing.lastTimeStamp
    };
  } else {
    movementInfo = {
      attachedInfo: existing.attachedInfo,
      movementX: e.clientX - existing.lastClientX,
      movementY: e.clientY - existing.lastClientY,
      elapsedMs: e.timeStamp - existing.lastTimeStamp
    };
  }
  existing.lastClientX = e.clientX;
  existing.lastClientY = e.clientY;
  existing.lastTimeStamp = e.timeStamp;
  if (Math.abs(movementInfo.movementX) < MOVEMENT_EPSILON && Math.abs(movementInfo.movementY) < MOVEMENT_EPSILON) {
    return { movementInfo: null, hasMoved: existing.hasMoved };
  } else {
    existing.hasMoved = true;
    return { movementInfo, hasMoved: existing.hasMoved };
  }
}, _a7);
var renderers = [];
async function rawRenderPooled(width, height, scene, camera) {
  if (renderers.length === 0) {
    renderers.push(newRenderer());
  }
  const renderer = await renderers[0];
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  return renderer.domElement;
}
async function renderPooled(width, height, canvas, scene, camera) {
  if (width === 0 || height === 0) {
    return;
  }
  if (renderers.length === 0) {
    renderers.push(newRenderer());
  }
  const rendererCanvas = await rawRenderPooled(width, height, scene, camera);
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(rendererCanvas, 0, 0);
}
async function newRenderer() {
  const rendererConstructor = (await THREEJS).WebGLRenderer;
  const renderer = new rendererConstructor({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(pixelRatio());
  return renderer;
}
var INERTIA_DEFAULT = true;
var INERTIA_DURATION_MS = 500;
var INERTIA_TIMEOUT_MS = 50;
var VERTICAL_MOVEMENT_BASE_SCALE = 0.75;
function momentumScale(progress) {
  return (Math.exp(1 - progress) - (1 - progress)) / (1 - Math.E) + 1;
}
var Inertia = class {
  constructor(startTimestamp, momentumX, momentumY, callback) {
    __publicField(this, "scheduler", new RenderScheduler(this.render.bind(this)));
    __publicField(this, "lastTimestamp");
    this.startTimestamp = startTimestamp;
    this.momentumX = momentumX;
    this.momentumY = momentumY;
    this.callback = callback;
    this.scheduler.requestAnimFrame();
    this.lastTimestamp = startTimestamp;
  }
  render(now) {
    const progressBefore = (this.lastTimestamp - this.startTimestamp) / INERTIA_DURATION_MS;
    const progressAfter = Math.min(
      1,
      (now - this.startTimestamp) / INERTIA_DURATION_MS
    );
    if (progressBefore === 0 && progressAfter > INERTIA_TIMEOUT_MS / INERTIA_DURATION_MS) {
      return;
    }
    const delta = momentumScale(progressAfter) - momentumScale(progressBefore);
    this.callback(this.momentumX * delta * 1e3, this.momentumY * delta * 1e3);
    if (progressAfter < 1) {
      this.scheduler.requestAnimFrame();
    }
    this.lastTimestamp = now;
  }
};
var TwistyOrbitControls = class {
  constructor(model, mirror, canvas, dragTracker) {
    /** @deprecated */
    __publicField(this, "experimentalInertia", INERTIA_DEFAULT);
    __publicField(this, "onMovementBound", this.onMovement.bind(this));
    __publicField(this, "experimentalHasBeenMoved", false);
    this.model = model;
    this.mirror = mirror;
    this.canvas = canvas;
    this.dragTracker = dragTracker;
    this.dragTracker.addEventListener("move", this.onMove.bind(this));
    this.dragTracker.addEventListener("up", this.onUp.bind(this));
  }
  // f is the fraction of the canvas traversed per ms.
  temperMovement(f) {
    return Math.sign(f) * Math.log(Math.abs(f * 10) + 1) / 6;
  }
  onMove(e) {
    var _a9;
    (_a9 = e.detail).attachedInfo ?? (_a9.attachedInfo = {});
    const { temperedX, temperedY } = this.onMovement(
      e.detail.movementX,
      e.detail.movementY
    );
    const attachedInfo = e.detail.attachedInfo;
    attachedInfo.lastTemperedX = temperedX * 10;
    attachedInfo.lastTemperedY = temperedY * 10;
    attachedInfo.timestamp = e.timeStamp;
  }
  onMovement(movementX, movementY) {
    const scale = this.mirror ? -1 : 1;
    const minDim = Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight);
    const temperedX = this.temperMovement(movementX / minDim);
    const temperedY = this.temperMovement(
      movementY / minDim * VERTICAL_MOVEMENT_BASE_SCALE
    );
    this.model.twistySceneModel.orbitCoordinatesRequest.set(
      (async () => {
        const prevCoords = await this.model.twistySceneModel.orbitCoordinates.get();
        const newCoords = {
          latitude: prevCoords.latitude + 2 * temperedY * DEGREES_PER_RADIAN * scale,
          longitude: prevCoords.longitude - 2 * temperedX * DEGREES_PER_RADIAN
        };
        return newCoords;
      })()
    );
    return { temperedX, temperedY };
  }
  onUp(e) {
    e.preventDefault();
    if ("lastTemperedX" in e.detail.attachedInfo && "lastTemperedY" in e.detail.attachedInfo && "timestamp" in e.detail.attachedInfo && e.timeStamp - e.detail.attachedInfo.timestamp < 60) {
      new Inertia(
        e.timeStamp,
        // TODO
        e.detail.attachedInfo.lastTemperedX,
        e.detail.attachedInfo.lastTemperedY,
        this.onMovementBound
      );
    }
  }
};
async function setCameraFromOrbitCoordinates(camera, orbitCoordinates, backView = false) {
  const spherical = new (await THREEJS).Spherical(
    orbitCoordinates.distance,
    (90 - (backView ? -1 : 1) * orbitCoordinates.latitude) / DEGREES_PER_RADIAN,
    ((backView ? 180 : 0) + orbitCoordinates.longitude) / DEGREES_PER_RADIAN
  );
  spherical.makeSafe();
  camera.position.setFromSpherical(spherical);
  camera.lookAt(0, 0, 0);
}
var dedicatedRenderersSoFar = 0;
var DEFAULT_MAX_DEDICATED_RENDERERS = 2;
var sharingRenderers = false;
function shareRenderer() {
  if (twistyDebugGlobals.shareAllNewRenderers !== "auto") {
    if (!twistyDebugGlobals.shareAllNewRenderers) {
      dedicatedRenderersSoFar++;
    }
    return twistyDebugGlobals.shareAllNewRenderers !== "never";
  }
  if (dedicatedRenderersSoFar < DEFAULT_MAX_DEDICATED_RENDERERS) {
    dedicatedRenderersSoFar++;
    return false;
  } else {
    sharingRenderers = true;
    return true;
  }
}
function haveStartedSharingRenderers() {
  return sharingRenderers;
}
var _setupBasicPresses, setupBasicPresses_fn, _onResizeStaleDropper, _width, _height, _onResize, onResize_fn, _cachedRenderer, _cachedCanvas, _cachedDragTracker, _dragTracker, dragTracker_fn, _cachedCamera, _cachedOrbitControls, _disconnectionFunctions2, _experimentalNextRenderFinishedCallback, _scheduler, _a8;
var Twisty3DVantage = (_a8 = class extends ManagedCustomElement {
  constructor(model, scene, options) {
    super();
    __privateAdd(this, _setupBasicPresses);
    __privateAdd(this, _onResize);
    __privateAdd(this, _dragTracker);
    __publicField(this, "scene", null);
    __publicField(this, "stats", null);
    __publicField(this, "rendererIsShared", shareRenderer());
    __publicField(this, "loadingElement", null);
    __privateAdd(this, _onResizeStaleDropper, new StaleDropper());
    // TODO: Why doesn't this work for the top-right back view height?
    __privateAdd(this, _width, 0);
    __privateAdd(this, _height, 0);
    __privateAdd(this, _cachedRenderer, null);
    __privateAdd(this, _cachedCanvas, null);
    __privateAdd(this, _cachedDragTracker, null);
    __privateAdd(this, _cachedCamera, null);
    __privateAdd(this, _cachedOrbitControls, null);
    __privateAdd(this, _disconnectionFunctions2, []);
    __privateAdd(this, _experimentalNextRenderFinishedCallback, null);
    __privateAdd(this, _scheduler, new RenderScheduler(this.render.bind(this)));
    this.model = model;
    this.options = options;
    this.scene = scene ?? null;
    this.loadingElement = this.addElement(document.createElement("div"));
    this.loadingElement.classList.add("loading");
    if (twistyDebugGlobals.showRenderStats) {
      this.stats = new Stats();
      this.stats.dom.style.position = "absolute";
      this.contentWrapper.appendChild(this.stats.dom);
    }
  }
  async connectedCallback() {
    this.addCSS(twisty3DVantageCSS);
    this.addElement((await this.canvasInfo()).canvas);
    __privateMethod(this, _onResize, onResize_fn).call(this);
    const observer = new ResizeObserver(__privateMethod(this, _onResize, onResize_fn).bind(this));
    observer.observe(this.contentWrapper);
    this.orbitControls();
    __privateMethod(this, _setupBasicPresses, setupBasicPresses_fn).call(this);
    this.scheduleRender();
  }
  async clearCanvas() {
    if (this.rendererIsShared) {
      const canvasInfo = await this.canvasInfo();
      canvasInfo.context.clearRect(
        0,
        0,
        canvasInfo.canvas.width,
        canvasInfo.canvas.height
      );
    } else {
      const renderer = await this.renderer();
      const context = renderer.getContext();
      context.clear(context.COLOR_BUFFER_BIT);
    }
  }
  async renderer() {
    if (this.rendererIsShared) {
      throw new Error("renderer expected to be shared.");
    }
    return __privateGet(this, _cachedRenderer) ?? __privateSet(this, _cachedRenderer, newRenderer());
  }
  async canvasInfo() {
    return __privateGet(this, _cachedCanvas) ?? __privateSet(this, _cachedCanvas, (async () => {
      let canvas;
      if (this.rendererIsShared) {
        canvas = this.addElement(document.createElement("canvas"));
      } else {
        const renderer = await this.renderer();
        canvas = this.addElement(renderer.domElement);
      }
      this.loadingElement?.remove();
      const context = canvas.getContext("2d");
      return { canvas, context };
    })());
  }
  async camera() {
    return __privateGet(this, _cachedCamera) ?? __privateSet(this, _cachedCamera, (async () => {
      const camera = new (await THREEJS).PerspectiveCamera(
        20,
        1,
        // We rely on the resize logic to handle this.
        0.1,
        20
      );
      camera.position.copy(
        new (await THREEJS).Vector3(2, 4, 4).multiplyScalar(
          this.options?.backView ? -1 : 1
        )
      );
      camera.lookAt(0, 0, 0);
      return camera;
    })());
  }
  async orbitControls() {
    return __privateGet(this, _cachedOrbitControls) ?? __privateSet(this, _cachedOrbitControls, (async () => {
      const orbitControls = new TwistyOrbitControls(
        this.model,
        !!this.options?.backView,
        (await this.canvasInfo()).canvas,
        await __privateMethod(this, _dragTracker, dragTracker_fn).call(this)
      );
      if (this.model) {
        this.addListener(
          this.model.twistySceneModel.orbitCoordinates,
          async (orbitCoordinates) => {
            const camera = await this.camera();
            setCameraFromOrbitCoordinates(
              camera,
              orbitCoordinates,
              this.options?.backView
            );
            this.scheduleRender();
          }
        );
      }
      return orbitControls;
    })());
  }
  addListener(prop, listener) {
    prop.addFreshListener(listener);
    __privateGet(this, _disconnectionFunctions2).push(() => {
      prop.removeFreshListener(listener);
    });
  }
  disconnect() {
    for (const fn of __privateGet(this, _disconnectionFunctions2)) {
      fn();
    }
    __privateSet(this, _disconnectionFunctions2, []);
  }
  experimentalNextRenderFinishedCallback(callback) {
    __privateSet(this, _experimentalNextRenderFinishedCallback, callback);
  }
  async render() {
    var _a9;
    if (!this.scene) {
      throw new Error("Attempted to render without a scene");
    }
    this.stats?.begin();
    const [scene, camera, canvas] = await Promise.all([
      this.scene.scene(),
      this.camera(),
      this.canvasInfo()
    ]);
    if (this.rendererIsShared) {
      renderPooled(__privateGet(this, _width), __privateGet(this, _height), canvas.canvas, scene, camera);
    } else {
      (await this.renderer()).render(scene, camera);
    }
    this.stats?.end();
    (_a9 = __privateGet(this, _experimentalNextRenderFinishedCallback)) == null ? void 0 : _a9.call(this);
    __privateSet(this, _experimentalNextRenderFinishedCallback, null);
  }
  scheduleRender() {
    __privateGet(this, _scheduler).requestAnimFrame();
  }
}, _setupBasicPresses = new WeakSet(), setupBasicPresses_fn = async function() {
  const dragTracker = await __privateMethod(this, _dragTracker, dragTracker_fn).call(this);
  dragTracker.addEventListener("press", async (e) => {
    const movePressInput = await this.model.twistySceneModel.movePressInput.get();
    if (movePressInput !== "basic") {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("press", {
        detail: {
          pressInfo: e.detail,
          cameraPromise: this.camera()
        }
      })
    );
  });
}, _onResizeStaleDropper = new WeakMap(), _width = new WeakMap(), _height = new WeakMap(), _onResize = new WeakSet(), onResize_fn = async function() {
  const camera = await __privateGet(this, _onResizeStaleDropper).queue(this.camera());
  const w = this.contentWrapper.clientWidth;
  const h = this.contentWrapper.clientHeight;
  __privateSet(this, _width, w);
  __privateSet(this, _height, h);
  const off = 0;
  let yoff = 0;
  let excess = 0;
  if (h > w) {
    excess = h - w;
    yoff = -Math.floor(0.5 * excess);
  }
  camera.aspect = w / h;
  camera.setViewOffset(w, h - excess, off, yoff, w, h);
  camera.updateProjectionMatrix();
  this.clearCanvas();
  if (this.rendererIsShared) {
    const canvasInfo = await this.canvasInfo();
    canvasInfo.canvas.width = w * pixelRatio();
    canvasInfo.canvas.height = h * pixelRatio();
    canvasInfo.canvas.style.width = `${w.toString()}px`;
    canvasInfo.canvas.style.height = `${h.toString()}px`;
  } else {
    const renderer = await this.renderer();
    renderer.setSize(w, h, true);
  }
  this.scheduleRender();
}, _cachedRenderer = new WeakMap(), _cachedCanvas = new WeakMap(), _cachedDragTracker = new WeakMap(), _dragTracker = new WeakSet(), dragTracker_fn = async function() {
  return __privateGet(this, _cachedDragTracker) ?? __privateSet(this, _cachedDragTracker, (async () => {
    const dragTracker = new DragTracker((await this.canvasInfo()).canvas);
    this.model?.twistySceneModel.dragInput.addFreshListener(
      (dragInputMode) => {
        let dragInputEnabled = false;
        switch (dragInputMode) {
          case "auto": {
            dragTracker.start();
            dragInputEnabled = true;
            break;
          }
          case "none": {
            dragTracker.stop();
            break;
          }
        }
        this.contentWrapper.classList.toggle(
          "drag-input-enabled",
          dragInputEnabled
        );
      }
    );
    return dragTracker;
  })());
}, _cachedCamera = new WeakMap(), _cachedOrbitControls = new WeakMap(), _disconnectionFunctions2 = new WeakMap(), _experimentalNextRenderFinishedCallback = new WeakMap(), _scheduler = new WeakMap(), _a8);
customElementsShim.define("twisty-3d-vantage", Twisty3DVantage);

export {
  StaleDropper,
  TwistyPropSource,
  SimpleTwistyPropSource,
  NO_VALUE,
  TwistyPropDerived,
  FreshListenerManager,
  RenderScheduler,
  hintFaceletStyles,
  HintFaceletProp,
  TAU,
  DEGREES_PER_RADIAN,
  HTMLElementShim,
  customElementsShim,
  CSSSource,
  ManagedCustomElement,
  proxy3D,
  THREEJS,
  rawRenderPooled,
  setCameraFromOrbitCoordinates,
  haveStartedSharingRenderers,
  Twisty3DVantage
};
//# sourceMappingURL=chunk-KIHGHJSE.js.map
