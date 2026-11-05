/**
 * @file /src/algorithms/bellmanFord.ts
 * @description Bellman-Ford Shortest Path Algorithm supporting negative edge weights,
 * negative-cycle detection & highlighting, and step-by-step relaxation passes.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { findEdgeBetween } from './adjacency';

export function runBellmanFord(
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

  if (!graph.nodes.some(n => n.id === sourceId)) {
    return {
      algorithm: 'bellman-ford',
      success: false,
      message: `Source node '${sourceId}' does not exist in graph.`,
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  const steps: AlgorithmStep[] = [];
  const V = graph.nodes.length;
  const distances: Record<string, number> = {};
  const parents: Record<string, string | null> = {};

  // Step 1: Initialize-Single-Source
  for (const node of graph.nodes) {
    distances[node.id] = node.id === sourceId ? 0 : Infinity;
    parents[node.id] = null;
  }

  // Build edge list (considering directed vs undirected)
  const allEdges: Array<{ id: string; u: string; v: string; weight: number }> = [];
  for (const e of graph.edges) {
    allEdges.push({ id: e.id, u: e.source, v: e.target, weight: Number(e.weight) });
    if (!graph.isDirected) {
      allEdges.push({ id: `${e.id}_rev`, u: e.target, v: e.source, weight: Number(e.weight) });
    }
  }

  // Step 0: Initialization Step
  steps.push({
    stepNumber: 0,
    title: 'Bellman-Ford Initialization',
    description: `Set d[${sourceId}] = 0 and d[v] = ∞ for all other ${V - 1} vertices. Bellman-Ford will perform up to |V|-1 = ${Math.max(1, V - 1)} relaxation passes across all ${allEdges.length} directed edges.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [sourceId],
    frontierNodes: [sourceId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'EdgeList',
    dataStructureItems: allEdges.slice(0, 10).map(e => ({
      label: `(${e.u}→${e.v})`,
      value: `w=${e.weight}`,
    })),
    distances: { ...distances },
    parents: { ...parents },
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  // Passes 1 to |V| - 1
  let relaxedInPass = false;
  for (let pass = 1; pass <= Math.max(1, V - 1); pass++) {
    relaxedInPass = false;

    for (const edge of allEdges) {
      operations.comparisons++;
      const u = edge.u;
      const v = edge.v;
      const w = edge.weight;

      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        operations.relaxations++;
        distances[v] = distances[u] + w;
        parents[v] = u;
        relaxedInPass = true;

        // Tree edges
        const currentTreeEdges: string[] = [];
        for (const [child, par] of Object.entries(parents)) {
          if (par) {
            const ed = findEdgeBetween(graph, par, child);
            if (ed) currentTreeEdges.push(ed.id);
          }
        }

        steps.push({
          stepNumber: steps.length,
          title: `Pass ${pass}: Relax Edge (${u} → ${v}, w=${w})`,
          description: `Relaxation condition satisfied in Pass ${pass}: d[${u}] (${distances[u] - w}) + w(${w}) = ${distances[v]} < previous d[${v}]. Updated d[${v}] = ${distances[v]}, π[${v}] = '${u}'.`,
          currentNode: v,
          currentEdge: edge.id.replace('_rev', ''),
          visitedNodes: Object.keys(distances).filter(id => distances[id] !== Infinity),
          frontierNodes: [v],
          selectedEdges: currentTreeEdges,
          rejectedEdges: [],
          dataStructureType: 'EdgeList',
          dataStructureItems: [{ label: `Pass ${pass}/${V - 1}`, value: `Edge (${u}→${v})` }],
          distances: { ...distances },
          parents: { ...parents },
          pseudocodeLine: 4,
          operationsSoFar: { ...operations },
          currentTotalCost: distances[v],
          isComplete: false,
        });
      }
    }

    // Early termination if no relaxation occurred in full pass
    if (!relaxedInPass) {
      steps.push({
        stepNumber: steps.length,
        title: `Pass ${pass}: Convergence Reached Early`,
        description: `No edge distances changed during Pass ${pass}. Distances have stabilized before reaching the theoretical maximum of |V|-1 passes.`,
        currentNode: null,
        currentEdge: null,
        visitedNodes: Object.keys(distances).filter(id => distances[id] !== Infinity),
        frontierNodes: [],
        selectedEdges: Object.entries(parents)
          .map(([child, par]) => (par ? findEdgeBetween(graph, par, child)?.id : null))
          .filter(Boolean) as string[],
        rejectedEdges: [],
        dataStructureType: 'EdgeList',
        dataStructureItems: [{ label: 'Status', value: 'Converged' }],
        distances: { ...distances },
        parents: { ...parents },
        pseudocodeLine: 3,
        operationsSoFar: { ...operations },
        currentTotalCost: targetId && distances[targetId] !== Infinity ? distances[targetId] : 0,
        isComplete: false,
      });
      break;
    }
  }

  // Step 2: Negative-Weight Cycle Detection (Pass |V|)
  let hasNegativeCycle = false;
  const negativeCycleNodes: string[] = [];
  const negativeCycleEdges: string[] = [];

  for (const edge of allEdges) {
    operations.comparisons++;
    if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
      hasNegativeCycle = true;
      negativeCycleNodes.push(edge.u, edge.v);
      const originalEdge = findEdgeBetween(graph, edge.u, edge.v);
      if (originalEdge) negativeCycleEdges.push(originalEdge.id);

      steps.push({
        stepNumber: steps.length,
        title: `Negative Cycle Detected on (${edge.u} → ${edge.v})`,
        description: `CRITICAL DAA CONDITION: Edge (${edge.u} → ${edge.v}) can still be relaxed after |V|-1 passes! d[${edge.u}] + w = ${distances[edge.u] + edge.weight} < d[${edge.v}]. This mathematically proves the presence of a Negative Weight Cycle reachable from source. Shortest paths are undefined (-∞).`,
        currentNode: edge.u,
        currentEdge: originalEdge?.id || null,
        visitedNodes: Object.keys(distances).filter(id => distances[id] !== Infinity),
        frontierNodes: [edge.u, edge.v],
        selectedEdges: [],
        rejectedEdges: originalEdge ? [originalEdge.id] : [],
        dataStructureType: 'EdgeList',
        dataStructureItems: [{ label: 'Negative Cycle', value: `(${edge.u}→${edge.v})` }],
        distances: { ...distances },
        parents: { ...parents },
        pseudocodeLine: 6,
        operationsSoFar: { ...operations },
        negativeCycleDetected: true,
        negativeCycleNodes: [edge.u, edge.v],
        currentTotalCost: -Infinity,
        isComplete: true,
      });
      break;
    }
  }

  // Reconstruct path if successful
  let path: string[] = [];
  let pathEdges: string[] = [];
  let totalCost: number | undefined = undefined;
  let success = !hasNegativeCycle;
  let message = '';

  if (hasNegativeCycle) {
    message = 'Negative-weight cycle detected. Graph contains a cycle whose edge sum is negative; shortest path is undefined (-∞).';
  } else if (targetId) {
    if (distances[targetId] === Infinity) {
      success = false;
      message = `No path exists from '${sourceId}' to '${targetId}'. Destination is unreachable.`;
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
      totalCost = distances[targetId];
      message = `Bellman-Ford found shortest path: ${path.join(' → ')} with total weighted cost = ${totalCost}.`;
    }
  } else {
    message = `Bellman-Ford single-source shortest path tree completed from '${sourceId}'.`;
    totalCost = Object.values(distances).filter(d => d !== Infinity).reduce((a, b) => a + b, 0);
  }

  // Final step
  if (!hasNegativeCycle) {
    steps.push({
      stepNumber: steps.length,
      title: success ? 'Bellman-Ford Complete' : 'Destination Unreachable',
      description: success
        ? `Optimal path found with negative weight support. Path: [${path.join(' → ')}], Cost: ${totalCost}. Verified no negative-weight cycles exist.`
        : `Search finished. Destination '${targetId}' is unreachable from '${sourceId}'.`,
      currentNode: targetId || null,
      currentEdge: null,
      visitedNodes: Object.keys(distances).filter(id => distances[id] !== Infinity),
      frontierNodes: [],
      selectedEdges: pathEdges,
      rejectedEdges: [],
      dataStructureType: 'EdgeList',
      dataStructureItems: [],
      distances: { ...distances },
      parents: { ...parents },
      pseudocodeLine: 7,
      operationsSoFar: { ...operations },
      currentTotalCost: totalCost ?? 0,
      isComplete: true,
    });
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'bellman-ford',
    success,
    message,
    steps,
    path: path.length > 0 ? path : undefined,
    pathEdges: pathEdges.length > 0 ? pathEdges : undefined,
    totalCost,
    hopCount: path.length > 0 ? path.length - 1 : 0,
    nodesVisitedCount: Object.values(distances).filter(d => d !== Infinity).length,
    executionTimeMs,
    operations,
    hasNegativeCycle,
    negativeCycleEdges,
  };
}
