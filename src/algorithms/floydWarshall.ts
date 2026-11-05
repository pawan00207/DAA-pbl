/**
 * @file /src/algorithms/floydWarshall.ts
 * @description Floyd-Warshall All-Pairs Shortest Path (APSP) Dynamic Programming Algorithm,
 * tracking intermediate vertex k transitions, distance matrix updates, and negative cycle detection.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { buildAdjacencyMatrix } from './adjacency';

export function runFloydWarshall(graph: GraphData): AlgorithmResult {
  const startTime = performance.now();
  const operations: AlgorithmOperationCounters = {
    comparisons: 0,
    relaxations: 0,
    queueOps: 0,
    dsuOps: 0,
    matrixUpdates: 0,
  };

  const steps: AlgorithmStep[] = [];
  const { nodeIds, matrix: initialMatrix } = buildAdjacencyMatrix(graph);
  const n = nodeIds.length;

  if (n === 0) {
    return {
      algorithm: 'floyd-warshall',
      success: false,
      message: 'Graph contains no vertices.',
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  // Deep clone initial matrix D^(0)
  // Diagonal D[i][i] = 0, D[i][j] = weight or Infinity
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (initialMatrix[i][j] !== null) {
        dist[i][j] = initialMatrix[i][j]!;
      }
    }
  }

  // Helper to clone snapshot for steps
  const snapshotMatrix = (): (number | null)[][] => {
    return dist.map(row => row.map(val => (val === Infinity ? null : val)));
  };

  // Step 0: Initial Base Matrix D^(0)
  steps.push({
    stepNumber: 0,
    title: 'Floyd-Warshall Base Matrix D^(0)',
    description: `Constructed initial distance matrix D^(0). Diagonal entries D[i][i]=0, direct edges have initial weight, and non-adjacent pairs are set to ∞. Dynamic programming will test every intermediate vertex k ∈ {1...${n}}.`,
    currentNode: null,
    currentEdge: null,
    visitedNodes: nodeIds,
    frontierNodes: [],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'DistanceMatrix',
    dataStructureItems: [{ label: 'Matrix Order', value: `${n}×${n}` }],
    distances: {},
    parents: {},
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    matrixSnapshot: snapshotMatrix(),
    matrixChangedCells: [],
    matrixKVertex: null,
    currentTotalCost: 0,
    isComplete: false,
  });

  let hasNegativeCycle = false;

  // Triply-nested loop: k (pivot), i (source), j (destination)
  for (let k = 0; k < n; k++) {
    const kNodeId = nodeIds[k];
    const changedCellsInK: { row: number; col: number }[] = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        operations.comparisons++;

        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const throughK = dist[i][k] + dist[k][j];
          if (throughK < dist[i][j]) {
            dist[i][j] = throughK;
            operations.relaxations++;
            operations.matrixUpdates!++;
            changedCellsInK.push({ row: i, col: j });
          }
        }
      }
    }

    steps.push({
      stepNumber: steps.length,
      title: `Iteration k=${k + 1} / ${n} (Pivot Vertex: '${kNodeId}')`,
      description: `Tested routing all pairs (i, j) through intermediate pivot vertex '${kNodeId}'. D^(${k + 1})[i][j] = min(D^(${k})[i][j], D^(${k})[i][${kNodeId}] + D^(${k})[${kNodeId}][j]). Updated ${changedCellsInK.length} matrix cells.`,
      currentNode: kNodeId,
      currentEdge: null,
      visitedNodes: nodeIds,
      frontierNodes: [kNodeId],
      selectedEdges: [],
      rejectedEdges: [],
      dataStructureType: 'DistanceMatrix',
      dataStructureItems: [{ label: `Pivot k=${k + 1}`, value: `'${kNodeId}'` }, { label: 'Updates', value: changedCellsInK.length }],
      distances: {},
      parents: {},
      pseudocodeLine: 3,
      operationsSoFar: { ...operations },
      matrixSnapshot: snapshotMatrix(),
      matrixChangedCells: changedCellsInK,
      matrixKVertex: kNodeId,
      currentTotalCost: operations.matrixUpdates!,
      isComplete: false,
    });
  }

  // Check for negative cycles on diagonal D[i][i] < 0
  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  const finalMsg = hasNegativeCycle
    ? 'Negative cycle detected: Diagonal entry D[i][i] < 0 confirms graph contains a negative-weight cycle.'
    : `All-Pairs Shortest Path matrix successfully computed for all ${n} vertices (${n * n} pairwise distances).`;

  // Final Step
  steps.push({
    stepNumber: steps.length,
    title: hasNegativeCycle ? 'Floyd-Warshall Terminated (Negative Cycle)' : 'Floyd-Warshall Complete',
    description: finalMsg,
    currentNode: null,
    currentEdge: null,
    visitedNodes: nodeIds,
    frontierNodes: [],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'DistanceMatrix',
    dataStructureItems: [{ label: 'Total Matrix Updates', value: operations.matrixUpdates! }],
    distances: {},
    parents: {},
    pseudocodeLine: 4,
    operationsSoFar: { ...operations },
    matrixSnapshot: snapshotMatrix(),
    matrixChangedCells: [],
    matrixKVertex: null,
    currentTotalCost: operations.matrixUpdates!,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'floyd-warshall',
    success: !hasNegativeCycle,
    message: finalMsg,
    steps,
    nodesVisitedCount: n,
    executionTimeMs,
    operations,
    hasNegativeCycle,
    allPairsMatrix: snapshotMatrix(),
    matrixNodeIds: nodeIds,
  };
}
