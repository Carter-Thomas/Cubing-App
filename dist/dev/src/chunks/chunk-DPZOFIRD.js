import {
  exposeAPI
} from "./chunk-M2B7MMQB.js";
import {
  node_adapter_default,
  wrap
} from "./chunk-N4ZS44MS.js";
import {
  randomUIntBelow
} from "./chunk-WZQDTJZ3.js";
import {
  Alg
} from "./chunk-3UISCJBF.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-72RDBMAX.js
var pins = ["UR", "DR", "DL", "UL"];
var backMoves = ["U", "R", "D", "L", "ALL"];
var frontMoves = pins.concat(backMoves);
function randomClockScrambleString() {
  let filteringMoveCount = 0;
  function randomSuffix() {
    const amount = randomUIntBelow(12);
    if (amount !== 0) {
      filteringMoveCount++;
    }
    if (amount <= 6) {
      return `${amount}+`;
    } else {
      return `${12 - amount}-`;
    }
  }
  const moves = [];
  function side(families) {
    for (const family of families) {
      moves.push(`${family}${randomSuffix()}`);
    }
  }
  side(frontMoves);
  moves.push("y2");
  side(backMoves);
  if (filteringMoveCount < 2) {
    return randomClockScrambleString();
  }
  for (const pin of pins) {
    if (randomUIntBelow(2) === 0) {
      moves.push(pin);
    }
  }
  return moves.join(" ");
}
var worker_threads_mangled = "node:w-orker-_threa-ds";
var worker_threads_unmangled = () => worker_threads_mangled.replace(/-/g, "");
var useNodeWorkarounds = typeof globalThis.Worker === "undefined" && typeof globalThis.WorkerNavigator === "undefined";
async function nodeWorker(source, options) {
  const { Worker: NodeWorker } = await import(
    /* @vite-ignore */
    worker_threads_unmangled()
  );
  const worker = new NodeWorker(source, options);
  worker.unref();
  return node_adapter_default(worker);
}
async function constructWorker(source, options) {
  let worker;
  if (useNodeWorkarounds) {
    return nodeWorker(source, { eval: options?.eval });
  } else {
    if (options?.eval) {
      const blob = new Blob([source], {
        type: "application/javascript"
      });
      source = URL.createObjectURL(blob);
    }
    worker = new globalThis.Worker(source, {
      type: options ? options.type : void 0
      // TODO: Is it safe to use `options?.type`?
    });
  }
  return worker;
}
async function searchWorkerURLImportMetaResolve() {
  return import.meta.resolve("./search-worker-entry.js");
}
function searchWorkerURLNewURLImportMetaURL() {
  return new URL("./search-worker-entry.js", import.meta.url);
}
async function searchWorkerURLEsbuildWorkaround() {
  exposeAPI.expose = false;
  return (await import("./search-worker-entry-EFJIBSYX.js")).WORKER_ENTRY_FILE_URL;
}
function instantiateSearchWorkerURLNewURLImportMetaURL() {
  return new Worker(new URL("./search-worker-entry.js", import.meta.url), {
    type: "module"
  });
}
function probablyCrossOrigin(workerEntryFileURL) {
  try {
    const scriptOrigin = globalThis.location?.origin;
    const workerOrigin = workerEntryFileURL.origin;
    return !!scriptOrigin && !!workerOrigin && scriptOrigin !== workerOrigin;
  } catch {
    return false;
  }
}
async function instantiateModuleWorker(workerEntryFileURL) {
  const url = new URL(workerEntryFileURL, import.meta.url);
  const tryTrampolineFirst = probablyCrossOrigin(url);
  try {
    return instantiateModuleWorkerAttempt(url, tryTrampolineFirst);
  } catch {
    return instantiateModuleWorkerAttempt(url, !tryTrampolineFirst);
  }
}
async function instantiateModuleWorkerAttempt(workerEntryFileURL, crossOriginTrampoline) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!workerEntryFileURL) {
        reject(new Error("Could not get worker entry file URL."));
      }
      let url = workerEntryFileURL;
      if (crossOriginTrampoline) {
        const importSrc = `import ${JSON.stringify(
          workerEntryFileURL.toString()
        )};`;
        const blob = new Blob([importSrc], {
          type: "text/javascript"
        });
        url = new URL(URL.createObjectURL(blob));
      }
      const worker = await constructWorker(url, {
        type: "module"
      });
      worker.unref?.();
      const onError = (e) => {
        reject(e);
      };
      const onFirstMessage = (messageData) => {
        if (messageData === "comlink-exposed") {
          resolve(wrapWithTerminate(worker));
        } else {
          reject(
            new Error(`wrong module instantiation message ${messageData}`)
          );
        }
      };
      if (worker.nodeWorker) {
        worker.nodeWorker.once("message", onFirstMessage);
      } else {
        worker.addEventListener("error", onError, {
          once: true
        });
        worker.addEventListener("message", (e) => onFirstMessage(e.data), {
          once: true
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}
async function instantiateModuleWorkerDirectlyForBrowser() {
  return new Promise(async (resolve, reject) => {
    try {
      const worker = instantiateSearchWorkerURLNewURLImportMetaURL();
      const onError = (e) => {
        reject(e);
      };
      const onFirstMessage = (messageData) => {
        if (messageData === "comlink-exposed") {
          resolve(wrapWithTerminate(worker));
        } else {
          reject(
            new Error(`wrong module instantiation message ${messageData}`)
          );
        }
      };
      worker.addEventListener("error", onError, {
        once: true
      });
      worker.addEventListener("message", (e) => onFirstMessage(e.data), {
        once: true
      });
    } catch (e) {
      reject(e);
    }
  });
}
function wrapWithTerminate(worker) {
  const insideAPI = wrap(worker);
  const terminate = worker.terminate.bind(worker);
  return { insideAPI, outsideAPI: { terminate } };
}
var allInsideOutsideAPIPromises = [];
async function instantiateWorker() {
  const insideOutsideAPIPromise = instantiateWorkerImplementation();
  allInsideOutsideAPIPromises.push(insideOutsideAPIPromise);
  const { insideAPI } = await insideOutsideAPIPromise;
  insideAPI.setDebugMeasurePerf(searchOutsideDebugGlobals.logPerf);
  insideAPI.setScramblePrefetchLevel(
    searchOutsideDebugGlobals.scramblePrefetchLevel
  );
  return insideOutsideAPIPromise;
}
async function instantiateWorkerImplementation() {
  if (globalThis.location?.protocol === "file:") {
    console.warn(
      "This current web page is loaded from the local filesystem (a URL that starts with `file://`). In this situation, `cubing.js` may be unable to generate scrambles or perform searches in some browsers. See: https://js.cubing.net/cubing/scramble/#file-server-required"
    );
  }
  function failed(methodDescription) {
    return `Module worker instantiation${methodDescription ? ` ${methodDescription}` : ""} failed`;
  }
  const fallbackOrder = [
    [
      async () => instantiateModuleWorker(await searchWorkerURLImportMetaResolve()),
      "using `import.meta.resolve(\u2026)",
      null
    ],
    // TODO: This fallback should be lower (because it's less portable), but we need to try it earlier to work around https://github.com/parcel-bundler/parcel/issues/9051
    [
      instantiateModuleWorkerDirectlyForBrowser,
      "using inline `new URL(\u2026, import.meta.url)`",
      "may"
    ],
    [
      async () => instantiateModuleWorker(searchWorkerURLNewURLImportMetaURL()),
      "using `new URL(\u2026, import.meta.url)`",
      "will"
    ],
    [
      async () => instantiateModuleWorker(await searchWorkerURLEsbuildWorkaround()),
      "using the `esbuild` workaround",
      "will"
    ]
  ];
  for (const [fn, description, warnOnSuccess] of fallbackOrder) {
    try {
      const worker = await fn();
      if (warnOnSuccess) {
        if (searchOutsideDebugGlobals.showWorkerInstantiationWarnings) {
          console.warn(
            `Module worker instantiation required ${description}. \`cubing.js\` ${warnOnSuccess} not support this fallback in the future.`
          );
        }
      }
      return worker;
    } catch {
      if (searchOutsideDebugGlobals.showWorkerInstantiationWarnings) {
        console.warn(`${failed(description)}, falling back.`);
      }
    }
  }
  throw new Error(
    `${failed()}. There are no more fallbacks available. If you are using Firefox, please update to version 114 or later.`
  );
}
var cachedWorkerInstance;
function getCachedWorkerInstance() {
  return cachedWorkerInstance ?? (cachedWorkerInstance = instantiateWorker());
}
async function randomScrambleForEvent(eventID) {
  switch (eventID) {
    case "clock":
      return Alg.fromString(await randomClockScrambleString());
  }
  const prom = _randomScrambleStringForEvent(eventID);
  const wat = await prom;
  return Alg.fromString(wat);
}
async function _randomScrambleStringForEvent(eventID) {
  if (searchOutsideDebugGlobals.forceNewWorkerForEveryScramble) {
  }
  const worker = searchOutsideDebugGlobals.forceNewWorkerForEveryScramble ? await instantiateWorker() : await getCachedWorkerInstance();
  return worker.insideAPI.randomScrambleStringForEvent(eventID);
}
var searchOutsideDebugGlobals = {
  logPerf: true,
  scramblePrefetchLevel: "auto",
  disableStringWorker: false,
  forceNewWorkerForEveryScramble: false,
  showWorkerInstantiationWarnings: true
};

export {
  randomScrambleForEvent
};
//# sourceMappingURL=chunk-DPZOFIRD.js.map
