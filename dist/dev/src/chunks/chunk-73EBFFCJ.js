import {
  Alg
} from "./chunk-3UISCJBF.js";

// node_modules/cubing/dist/lib/cubing/chunks/chunk-KDMCYBSC.js
function parseSGS(kpuzzle, sgs) {
  const subgroupSizes = [];
  const sgsActions = [];
  for (const line of sgs.split("\n")) {
    const lineTokens = line.split(" ");
    if (line.startsWith("SetOrder ")) {
    } else if (line.startsWith("Alg ")) {
      const alg = Alg.fromString(line.substring(4));
      sgsActions.push({
        alg,
        transformation: kpuzzle.algToTransformation(alg)
      });
    } else if (line.startsWith("SubgroupSizes ")) {
      for (let j = 1; j < lineTokens.length; j++) {
        subgroupSizes.push(parseInt(lineTokens[j]));
      }
    }
  }
  const sgsCachedData = {
    ordering: new Array(subgroupSizes.length)
  };
  const subgroupAlgOffsets = [];
  let sum = 0;
  subgroupAlgOffsets.push(0);
  const emptyAlg = Alg.fromString("");
  const identity = kpuzzle.identityTransformation();
  for (let i = 0; i < subgroupSizes.length; i++) {
    sum += subgroupSizes[i];
    subgroupAlgOffsets.push(sum);
    sgsActions.splice(sum - 1, 0, { alg: emptyAlg, transformation: identity });
  }
  if (sgsActions.length !== sum) {
    throw Error(
      `Bad sgs; expected ${sum - subgroupSizes.length} algs but saw ${sgsActions.length - subgroupSizes.length}`
    );
  }
  const processedPieces = {};
  for (const orbitDefinition of kpuzzle.definition.orbits) {
    processedPieces[orbitDefinition.orbitName] = new Array(
      orbitDefinition.numPieces
    ).fill(false);
  }
  for (let i = subgroupSizes.length - 1; i >= 0; i--) {
    const pieceOrdering = [];
    for (let j = subgroupAlgOffsets[i]; j < subgroupAlgOffsets[i + 1]; j++) {
      const transformation = sgsActions[j].transformation;
      for (const orbitDefinition of kpuzzle.definition.orbits) {
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          if (transformation.transformationData[orbitDefinition.orbitName].permutation[idx] !== idx || transformation.transformationData[orbitDefinition.orbitName].orientationDelta[idx] !== 0) {
            if (!processedPieces[orbitDefinition.orbitName][idx]) {
              pieceOrdering.push({
                orbitName: orbitDefinition.orbitName,
                permutationIdx: idx
              });
              processedPieces[orbitDefinition.orbitName][idx] = true;
            }
          }
        }
      }
    }
    const lookup = {};
    for (let j = subgroupAlgOffsets[i]; j < subgroupAlgOffsets[i + 1]; j++) {
      const transformation = sgsActions[j].transformation.invert();
      let key = "";
      for (let k = 0; k < pieceOrdering.length; k++) {
        const loc = pieceOrdering[k];
        key = `${key} ${transformation.transformationData[loc.orbitName].permutation[loc.permutationIdx]} ${transformation.transformationData[loc.orbitName].orientationDelta[loc.permutationIdx]}`;
      }
      lookup[key] = sgsActions[j];
      sgsActions[j].alg = sgsActions[j].alg.invert();
      sgsActions[j].transformation = sgsActions[j].transformation.invert();
    }
    sgsCachedData.ordering[i] = {
      pieceOrdering,
      lookup
    };
  }
  return sgsCachedData;
}

export {
  parseSGS
};
//# sourceMappingURL=chunk-73EBFFCJ.js.map
