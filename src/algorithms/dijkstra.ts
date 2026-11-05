/**
 * @file /src/algorithms/dijkstra.ts
 * @description Dijkstra's Algorithm with step-by-step state capture, priority queue tracking,
 * negative weight validation, operation counters, and unreachable destination handling.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { buildAdjacencyList, checkHasNegativeWeights, findEdgeBetween } from './adjacency';

export function runDijkstra(
  graph: GraphData,
  sourceId: string,
  targetId?: string
): AlgorithmResult {
  const startTime = performance.now();
  const operations: AlgorithmOperationCounters = {
    comparisons: 0,
    relaxations: 0,
    queueOps: 0,
    dsuOps: 0,
  };

  // Edge Case 1: Check for negative weights
  const { hasNegative, negativeEdges } = checkHasNegativeWeights(graph);
  if (hasNegative) {
    const edgeNames = negativeEdges.map(e => `(${e.source} -> ${e.target}: weight ${e.weight})`).join(', ');
    return {
      algorithm: 'dijkstra',
      success: false,
      message: `Dijkstra's Algorithm cannot run: Negative edge weights detected [${edgeNames}]. Dijkstra assumes edge weights are non-negative (w(u,v) >= 0) because greedy relaxation fails when negative cycles or negative edges exist. Switch to Bellman-Ford algorithm for graphs with negative weights.`,
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: Number((performance.now() - startTime).toFixed(3)),
      operations,
    };
  }

  // Edge Case 2: Validate source node existence
  if (!graph.nodes.some(n => n.id === sourceId)) {
    return {
      algorithm: 'dijkstra',
      success: false,
      message: `Source node '${sourceId}' does not exist in graph.`,
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  const adjList = buildAdjacencyList(graph);
  const steps: AlgorithmStep[] = [];

  const distances: Record<string, number> = {};
  const parents: Record<string, string | null> = {};
  const visited = new Set<string>();

  // Priority Queue simulated with min-priority sorting
  const pq: Array<{ id: string; dist: number }> = [];

  // Initialize single source
  for (const node of graph.nodes) {
    distances[node.id] = node.id === sourceId ? 0 : Infinity;
    parents[node.id] = null;
  }
  pq.push({ id: sourceId, dist: 0 });
  operations.queueOps++; // Insert source

  // Initial Step 0
  steps.push({
    stepNumber: 0,
    title: 'Initialization (Initialize-Single-Source)',
    description: `Set distance to source node '${sourceId}' as 0. Set distance to all other |V|-1 nodes as ∞. Insert source '${sourceId}' with priority 0 into the Min-Priority Queue.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [],
    frontierNodes: [sourceId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [{ label: sourceId, value: `dist: 0` }],
    distances: { ...distances },
    parents: { ...parents },
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  const selectedEdgesSoFar: string[] = [];

  while (pq.length > 0) {
    // Sort to extract min
    operations.comparisons += Math.max(1, Math.floor(Math.log2(pq.length + 1)));
    pq.sort((a, b) => a.dist - b.dist);
    const minElem = pq.shift()!;
    operations.queueOps++; // Extract-Min
    const u = minElem.id;
    const uDist = minElem.dist;

    // If we popped an outdated or already visited node
    if (visited.has(u)) {
      continue;
    }

    visited.add(u);

    // If target node is reached, we can optionally stop early or finalize
    const isTarget = targetId && u === targetId;

    // Build current tree edges from parents
    const currentTreeEdges: string[] = [];
    for (const [child, par] of Object.entries(parents)) {
      if (par && visited.has(child)) {
        const edge = findEdgeBetween(graph, par, child);
        if (edge) currentTreeEdges.push(edge.id);
      }
    }

    steps.push({
      stepNumber: steps.length,
      title: `Extract-Min: Visited Node '${u}'`,
      description: `Extracted vertex '${u}' with minimum distance (${uDist === Infinity ? '∞' : uDist}). Mark '${u}' as finalized (cloud S). Exploring its incident edges.`,
      currentNode: u,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: pq.map(item => item.id),
      selectedEdges: [...currentTreeEdges],
      rejectedEdges: [],
      dataStructureType: 'PriorityQueue',
      dataStructureItems: pq.map(item => ({ label: item.id, value: `dist: ${item.dist}` })),
      distances: { ...distances },
      parents: { ...parents },
      pseudocodeLine: 5,
      operationsSoFar: { ...operations },
      currentTotalCost: uDist === Infinity ? 0 : uDist,
      isComplete: false,
    });

    if (isTarget) {
      break; // Shortest path to target found!
    }

    // Relax all edges leaving u
    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.nodeId;
      const weight = neighbor.weight;
      const edgeId = neighbor.edgeId;

      if (visited.has(v)) {
        continue; // Already finalized
      }

      operations.comparisons++;
      const alt = distances[u] + weight;
      const oldDist = distances[v];

      if (alt < oldDist) {
        operations.relaxations++;
        distances[v] = alt;
        parents[v] = u;
        pq.push({ id: v, dist: alt });
        operations.queueOps++; // Decrease-Key / Push

        // Update selected tree edges
        const updatedEdges: string[] = [];
        for (const [child, par] of Object.entries(parents)) {
          if (par) {
            const edge = findEdgeBetween(graph, par, child);
            if (edge) updatedEdges.push(edge.id);
          }
        }

        steps.push({
          stepNumber: steps.length,
          title: `Relax Edge (${u} -> ${v}, w=${weight})`,
          description: `Distance relaxation condition met: d[${u}] (${distances[u]}) + w(${weight}) = ${alt} < d[${v}] (${oldDist === Infinity ? '∞' : oldDist}). Updated d[${v}] = ${alt}, predecessor π[${v}] = '${u}'. Decreased key in Priority Queue.`,
          currentNode: u,
          currentEdge: edgeId,
          visitedNodes: Array.from(visited),
          frontierNodes: pq.map(item => item.id),
          selectedEdges: [...updatedEdges],
          rejectedEdges: [],
          dataStructureType: 'PriorityQueue',
          dataStructureItems: pq.map(item => ({ label: item.id, value: `dist: ${item.dist}` })),
          distances: { ...distances },
          parents: { ...parents },
          pseudocodeLine: 9,
          operationsSoFar: { ...operations },
          currentTotalCost: alt,
          isComplete: false,
        });
      } else {
        // Did not relax
        steps.push({
          stepNumber: steps.length,
          title: `Inspect Edge (${u} -> ${v}, w=${weight}) [No Relaxation]`,
          description: `Relaxation not beneficial: d[${u}] (${distances[u]}) + w(${weight}) = ${alt} >= d[${v}] (${oldDist}). Existing path to '${v}' is shorter or equal.`,
          currentNode: u,
          currentEdge: edgeId,
          visitedNodes: Array.from(visited),
          frontierNodes: pq.map(item => item.id),
          selectedEdges: [...currentTreeEdges],
          rejectedEdges: [],
          dataStructureType: 'PriorityQueue',
          dataStructureItems: pq.map(item => ({ label: item.id, value: `dist: ${item.dist}` })),
          distances: { ...distances },
          parents: { ...parents },
          pseudocodeLine: 8,
          operationsSoFar: { ...operations },
          currentTotalCost: distances[u],
          isComplete: false,
        });
      }
    }
  }

  // Path reconstruction
  let path: string[] = [];
  let pathEdges: string[] = [];
  let totalCost: number | undefined = undefined;
  let success = true;
  let message = '';

  if (targetId) {
    if (distances[targetId] === Infinity) {
      success = false;
      message = `No path exists from '${sourceId}' to '${targetId}'. Destination is unreachable in this graph.`;
      path = [];
      pathEdges = [];
    } else {
      // Reconstruct
      let curr: string | null = targetId;
      while (curr !== null) {
        path.unshift(curr);
        const p: string | null = parents[curr];
        if (p) {
          const edge = findEdgeBetween(graph, p, curr);
          if (edge) pathEdges.unshift(edge.id);
        }
        curr = p;
      }
      totalCost = distances[targetId];
      message = `Shortest path found: ${path.join(' → ')} with total weighted cost = ${totalCost}.`;
    }
  } else {
    message = `Single-source shortest path tree computed from '${sourceId}' to all reachable vertices.`;
    totalCost = Object.values(distances).filter(d => d !== Infinity).reduce((a, b) => a + b, 0);
  }

  // Final step
  steps.push({
    stepNumber: steps.length,
    title: success ? 'Dijkstra Execution Complete' : 'Search Terminated (Unreachable)',
    description: success
      ? `Optimal shortest path determined. Final path: [${path.length > 0 ? path.join(' → ') : 'All Reachable Tree'}]. Total cost: ${totalCost ?? 'N/A'}.`
      : `Algorithm completed. Destination '${targetId}' was not reachable from '${sourceId}'.`,
    currentNode: targetId || null,
    currentEdge: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    selectedEdges: pathEdges.length > 0 ? pathEdges : selectedEdgesSoFar,
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [],
    distances: { ...distances },
    parents: { ...parents },
    pseudocodeLine: 10,
    operationsSoFar: { ...operations },
    currentTotalCost: totalCost ?? 0,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'dijkstra',
    success,
    message,
    steps,
    path: path.length > 0 ? path : undefined,
    pathEdges: pathEdges.length > 0 ? pathEdges : undefined,
    totalCost,
    hopCount: path.length > 0 ? path.length - 1 : 0,
    nodesVisitedCount: visited.size,
    executionTimeMs,
    operations,
  };
}
