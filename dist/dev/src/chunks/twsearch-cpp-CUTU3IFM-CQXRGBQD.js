import {
  Alg
} from "./chunk-3UISCJBF.js";
import "./chunk-GMPMBD5T.js";

// node_modules/cubing/dist/lib/cubing/chunks/twsearch-cpp-CUTU3IFM.js
console.info("Loading twsearch v0.4.2");
async function importOnce() {
  const fn = (await import("./twsearch-BDAXZGZU-JERMHHZP-A5XTUJRC.js")).default;
  return await fn();
}
var cachedEmscriptenModule = null;
async function emscriptenModule() {
  return cachedEmscriptenModule ?? (cachedEmscriptenModule = importOnce());
}
function cwrap(fn, returnType, argTypes, processReturnValue = (v) => v) {
  const wrapped = (async () => (await emscriptenModule()).cwrap(fn, returnType, argTypes))();
  return async (...args) => {
    return processReturnValue((await wrapped)(...args));
  };
}
var NoSolutionError = class extends Error {
};
function parseResult(s) {
  if (s === "--no solution--") {
    throw new NoSolutionError("");
  }
  return Alg.fromString(s);
}
var stringArg = ["string"];
var setArg = cwrap(
  "w_arg",
  "void",
  stringArg
);
var setKPuzzleDefString = cwrap(
  "w_setksolve",
  "void",
  stringArg
);
var solveScramble = cwrap(
  "w_solvescramble",
  "string",
  stringArg,
  parseResult
);
var solvePattern = cwrap(
  "w_solveposition",
  "string",
  stringArg,
  parseResult
);
var BLANK_LINE = "";
var END = "End";
function sanitize(s) {
  return s.replaceAll(/[^A-Za-z0-9]/g, "_");
}
function serializeMoveTransformation(name, t) {
  const outputLines = [];
  outputLines.push(`MoveTransformation ${sanitize(name)}`);
  for (const [orbitName, orbitData] of Object.entries(t)) {
    outputLines.push(sanitize(orbitName));
    outputLines.push(orbitData.permutation.join(" "));
    outputLines.push(orbitData.orientationDelta.join(" "));
  }
  outputLines.push(END);
  outputLines.push(BLANK_LINE);
  return outputLines.join("\n");
}
function serializeScramblePattern(name, t) {
  const outputLines = [];
  outputLines.push(`ScrambleState ${sanitize(name)}`);
  for (const [orbitName, orbitData] of Object.entries(t)) {
    outputLines.push(sanitize(orbitName));
    outputLines.push(orbitData.pieces.join(" "));
    const orientationEntries = [];
    for (let i = 0; i < orbitData.orientation.length; i++) {
      switch (orbitData.orientationMod?.[i] ?? 0) {
        case 0: {
          orientationEntries.push(orbitData.orientation[i]);
          break;
        }
        case 1: {
          orientationEntries.push("?");
          break;
        }
        default:
          throw new Error("Unsupported `orientationMod` value.");
      }
    }
    outputLines.push(orientationEntries.join(" "));
  }
  outputLines.push(END);
  outputLines.push(BLANK_LINE);
  return outputLines.join("\n");
}
function serializeDefToTws(kpuzzle, options) {
  let outputLines = [];
  const def = kpuzzle.definition;
  outputLines.push(`Name ${sanitize(def.name ?? "CustomPuzzle")}`);
  outputLines.push(BLANK_LINE);
  for (const orbitDefinition of def.orbits) {
    outputLines.push(
      `Set ${sanitize(orbitDefinition.orbitName)} ${orbitDefinition.numPieces} ${orbitDefinition.numOrientations}`
    );
  }
  outputLines.push(BLANK_LINE);
  outputLines.push("StartState");
  if (options?.startPattern) {
    outputLines.push(options?.startPattern);
  } else {
    for (const [orbitName, orbitData] of Object.entries(def.defaultPattern)) {
      outputLines.push(sanitize(orbitName));
      outputLines.push(orbitData.pieces.join(" "));
      const orientationEntries = [];
      for (let i = 0; i < orbitData.orientation.length; i++) {
        switch (orbitData.orientationMod?.[i] ?? 0) {
          case 0: {
            orientationEntries.push(orbitData.orientation[i]);
            break;
          }
          case 1: {
            orientationEntries.push("?");
            break;
          }
          default:
            throw new Error("Unsupported `orientationMod` value.");
        }
      }
      outputLines.push(orientationEntries.join(" "));
    }
  }
  outputLines.push(END);
  outputLines.push(BLANK_LINE);
  function include(moveName) {
    if (options?.moveSubset) {
      return options.moveSubset.includes(moveName);
    } else {
      return true;
    }
  }
  for (const [moveName, moveDef] of Object.entries(def.moves)) {
    if (include(moveName)) {
      outputLines.push(serializeMoveTransformation(moveName, moveDef));
    }
  }
  for (const [moveName, moveAlgDef] of Object.entries(
    def.derivedMoves ?? {}
  )) {
    if (include(moveName)) {
      const transformation = kpuzzle.algToTransformation(moveAlgDef);
      outputLines.push(
        serializeMoveTransformation(
          moveName,
          transformation.transformationData
        )
      );
    }
  }
  return outputLines.join("\n");
}
export {
  NoSolutionError,
  serializeDefToTws,
  serializeMoveTransformation,
  serializeScramblePattern,
  setArg,
  setKPuzzleDefString,
  solvePattern,
  solveScramble
};
//# sourceMappingURL=twsearch-cpp-CUTU3IFM-CQXRGBQD.js.map
