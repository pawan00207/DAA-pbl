/**
 * @file /src/algorithms/aStar.ts
 * @description A* Search Algorithm utilizing Euclidean distance heuristic from node coordinates,
 * tracking f(n) = g(n) + h(n), Priority Queue operations, and step-by-step relaxation.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters, AStarNodeMetrics } from '../types/graph';
import { buildAdjacencyList, findEdgeBetween, checkHasNegativeWeights } from './adjacency';

export function runAStar(
  graph: GraphData,
  sourceId: string,
  targetId: string
): AlgorithmResult {
  const startTime = performance.now();
  const operations: AlgorithmOperationCounters = {
    comparisons: 0,
    relaxations: 0,
    queueOps: 0,
    dsuOps: 0,
  };

  const { hasNegative, negativeEdges } = checkHasNegativeWeights(graph);
  if (hasNegative) {
    const edgeNames = negativeEdges.map(e => `(${e.source} -> ${e.target}: weight ${e.weight})`).join(', ');
    return {
      algorithm: 'astar',
      success: false,
      message: `A* Search cannot run: Negative edge weights detected [${edgeNames}]. Heuristic search assumes edge weights are non-negative to guarantee admissible and consistent heuristic properties.`,
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: Number((performance.now() - startTime).toFixed(3)),
      operations,
    };
  }

  const sourceNode = graph.nodes.find(n => n.id === sourceId);
  const targetNode = graph.nodes.find(n => n.id === targetId);

  if (!sourceNode || !targetNode) {
    return {
      algorithm: 'astar',
      success: false,
      message: `Source or Destination node does not exist in graph.`,
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  // Calculate Admissible Euclidean Distance Heuristic
  // Finds minimum positive edge weight and normalizes Euclidean distance by max canvas dimension
  const minEdgeWeight = Math.min(...graph.edges.map(e => Number(e.weight)).filter(w => w > 0), 1);
  const computeHeuristic = (nodeId: string): number => {
    const n = graph.nodes.find(node => node.id === nodeId);
    if (!n) return 0;
    const dx = n.x - targetNode.x;
    const dy = n.y - targetNode.y;
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    // Guarantees h(u) <= minEdgeWeight * (euclidean / 1000) <= true shortest distance (admissible)
    return Number(((euclidean / 1000) * minEdgeWeight).toFixed(2));
  };

  const adjList = buildAdjacencyList(graph);
  const steps: AlgorithmStep[] = [];

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const parents: Record<string, string | null> = {};
  const closedSet = new Set<string>();

  // Priority Queue: array of { id: string, f: number, g: number }
  const openSet: Array<{ id: string; f: number; g: number }> = [];

  for (const node of graph.nodes) {
    gScore[node.id] = node.id === sourceId ? 0 : Infinity;
    fScore[node.id] = node.id === sourceId ? computeHeuristic(sourceId) : Infinity;
    parents[node.id] = null;
  }

  openSet.push({ id: sourceId, f: fScore[sourceId], g: 0 });
  operations.queueOps++;

  const aStarMetricsSnapshot: Record<string, AStarNodeMetrics> = {};
  for (const n of graph.nodes) {
    const h = computeHeuristic(n.id);
    aStarMetricsSnapshot[n.id] = {
      g: gScore[n.id],
      h,
      f: fScore[n.id],
    };
  }

  // Step 0: Initialization
  steps.push({
    stepNumber: 0,
    title: 'A* Search Initialization',
    description: `Initialize A* Search. Calculated Euclidean heuristic h(n) towards target '${targetId}'. For source '${sourceId}', g=0, h=${aStarMetricsSnapshot[sourceId].h}, f = g+h = ${aStarMetricsSnapshot[sourceId].f}.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [],
    frontierNodes: [sourceId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [{ label: sourceId, value: `f: ${fScore[sourceId]} (g:0, h:${aStarMetricsSnapshot[sourceId].h})` }],
    distances: { ...gScore },
    parents: { ...parents },
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    aStarMetrics: { ...aStarMetricsSnapshot },
    currentTotalCost: 0,
    isComplete: false,
  });

  let foundTarget = false;

  while (openSet.length > 0) {
    // Extract node with lowest fScore
    operations.comparisons += Math.max(1, Math.floor(Math.log2(openSet.length + 1)));
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    operations.queueOps++;
    const u = current.id;

    if (closedSet.has(u)) continue;
    closedSet.add(u);

    // Tree edges so far
    const currentTreeEdges: string[] = [];
    for (const [child, par] of Object.entries(parents)) {
      if (par && closedSet.has(child)) {
        const edge = findEdgeBetween(graph, par, child);
        if (edge) currentTreeEdges.push(edge.id);
      }
    }

    steps.push({
      stepNumber: steps.length,
      title: `Extract Lowest f(n): Vertex '${u}'`,
      description: `Popped vertex '${u}' from Open Set with lowest priority f[${u}] = ${fScore[u]} (g=${gScore[u]}, h=${aStarMetricsSnapshot[u].h}). Added to Closed Set.`,
      currentNode: u,
      currentEdge: null,
      visitedNodes: Array.from(closedSet),
      frontierNodes: openSet.map(i => i.id),
      selectedEdges: currentTreeEdges,
      rejectedEdges: [],
      dataStructureType: 'PriorityQueue',
      dataStructureItems: openSet.map(i => ({ label: i.id, value: `f:${i.f} (g:${i.g})` })),
      distances: { ...gScore },
      parents: { ...parents },
      pseudocodeLine: 3,
      operationsSoFar: { ...operations },
      aStarMetrics: { ...aStarMetricsSnapshot },
      currentTotalCost: gScore[u],
      isComplete: false,
    });

    if (u === targetId) {
      foundTarget = true;
      break;
    }

    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.nodeId;
      const weight = neighbor.weight;
      const edge = findEdgeBetween(graph, u, v);

      if (closedSet.has(v)) continue;

      operations.comparisons++;
      const tentativeG = gScore[u] + weight;

      if (tentativeG < gScore[v]) {
        operations.relaxations++;
        parents[v] = u;
        gScore[v] = tentativeG;
        const h = computeHeuristic(v);
        fScore[v] = Number((tentativeG + h).toFixed(1));
        aStarMetricsSnapshot[v] = { g: tentativeG, h, f: fScore[v] };

        openSet.push({ id: v, f: fScore[v], g: tentativeG });
        operations.queueOps++;

        const updatedEdges: string[] = [];
        for (const [child, par] of Object.entries(parents)) {
          if (par) {
            const ed = findEdgeBetween(graph, par, child);
            if (ed) updatedEdges.push(ed.id);
          }
        }

        steps.push({
          stepNumber: steps.length,
          title: `Evaluate Neighbor '${v}': f=${fScore[v]}`,
          description: `Discovered better path to '${v}' via '${u}'. Updated g[${v}] = ${tentativeG}, h[${v}] = ${h}, total f[${v}] = ${fScore[v]}. Inserted into Open Set.`,
          currentNode: u,
          currentEdge: edge?.id || null,
          visitedNodes: Array.from(closedSet),
          frontierNodes: openSet.map(i => i.id),
          selectedEdges: updatedEdges,
          rejectedEdges: [],
          dataStructureType: 'PriorityQueue',
          dataStructureItems: openSet.map(i => ({ label: i.id, value: `f:${i.f}` })),
          distances: { ...gScore },
          parents: { ...parents },
          pseudocodeLine: 5,
          operationsSoFar: { ...operations },
          aStarMetrics: { ...aStarMetricsSnapshot },
          currentTotalCost: tentativeG,
          isComplete: false,
        });
      }
    }
  }

  // Path reconstruction
  let path: string[] = [];
  let pathEdges: string[] = [];
  let totalCost: number | undefined = undefined;
  let success = foundTarget;
  let message = '';

  if (!foundTarget) {
    message = `Destination '${targetId}' is unreachable from '${sourceId}' via A* search.`;
  } else {
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
    totalCost = gScore[targetId];
    message = `A* optimal path found: ${path.join(' → ')} with total weighted cost = ${totalCost}.`;
  }

  steps.push({
    stepNumber: steps.length,
    title: success ? 'A* Search Complete' : 'Target Unreachable',
    description: success
      ? `A* Search terminated with optimal heuristic path. Final: [${path.join(' → ')}], Cost = ${totalCost}.`
      : message,
    currentNode: targetId,
    currentEdge: null,
    visitedNodes: Array.from(closedSet),
    frontierNodes: [],
    selectedEdges: pathEdges,
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [],
    distances: { ...gScore },
    parents: { ...parents },
    pseudocodeLine: 6,
    operationsSoFar: { ...operations },
    aStarMetrics: { ...aStarMetricsSnapshot },
    currentTotalCost: totalCost ?? 0,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'astar',
    success,
    message,
    steps,
    path: path.length > 0 ? path : undefined,
    pathEdges: pathEdges.length > 0 ? pathEdges : undefined,
    totalCost,
    hopCount: path.length > 0 ? path.length - 1 : 0,
    nodesVisitedCount: closedSet.size,
    executionTimeMs,
    operations,
  };
}
