/**
 * @file /src/algorithms/dfs.ts
 * @description Depth-First Search (DFS) with LIFO Stack visualization, backtracking recording,
 * operation counters, traversal path extraction, and unreachable target handling.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { buildAdjacencyList, findEdgeBetween } from './adjacency';

export function runDFS(
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
      algorithm: 'dfs',
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

  const visited = new Set<string>();
  const stack: string[] = [sourceId];
  const parents: Record<string, string | null> = {};
  const depth: Record<string, number> = {};

  for (const node of graph.nodes) {
    parents[node.id] = null;
    depth[node.id] = node.id === sourceId ? 0 : Infinity;
  }
  operations.queueOps++; // Push source

  // Step 0: Initialization
  steps.push({
    stepNumber: 0,
    title: 'DFS Initialization',
    description: `Push source vertex '${sourceId}' onto LIFO Stack. Set depth[${sourceId}] = 0.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [],
    frontierNodes: [sourceId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'Stack',
    dataStructureItems: [{ label: sourceId, value: 'Depth: 0' }],
    distances: { ...depth },
    parents: { ...parents },
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  const treeEdges: string[] = [];
  let foundTarget = false;

  while (stack.length > 0) {
    const u = stack[stack.length - 1]; // peek top of stack

    if (!visited.has(u)) {
      visited.add(u);

      steps.push({
        stepNumber: steps.length,
        title: `Visit Vertex '${u}' (Depth ${depth[u]})`,
        description: `Popped/Active top of stack '${u}'. Mark '${u}' visited (gray). Investigating neighbors to plunge deeper.`,
        currentNode: u,
        currentEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [...stack],
        selectedEdges: [...treeEdges],
        rejectedEdges: [],
        dataStructureType: 'Stack',
        dataStructureItems: stack.map(id => ({ label: id, value: `Depth: ${depth[id]}` })),
        distances: { ...depth },
        parents: { ...parents },
        pseudocodeLine: 2,
        operationsSoFar: { ...operations },
        currentTotalCost: depth[u],
        isComplete: false,
      });

      if (targetId && u === targetId) {
        foundTarget = true;
        break;
      }
    }

    // Find an unvisited adjacent vertex
    const neighbors = adjList.get(u) || [];
    let unvisitedNeighbor: { nodeId: string; weight: number; edgeId: string } | null = null;

    for (const neighbor of neighbors) {
      operations.comparisons++;
      if (!visited.has(neighbor.nodeId)) {
        unvisitedNeighbor = neighbor;
        break;
      }
    }

    if (unvisitedNeighbor) {
      const v = unvisitedNeighbor.nodeId;
      parents[v] = u;
      depth[v] = depth[u] + 1;
      treeEdges.push(unvisitedNeighbor.edgeId);
      stack.push(v);
      operations.queueOps++; // Push v
      operations.relaxations++; // Depth update

      steps.push({
        stepNumber: steps.length,
        title: `Advance Deep: (${u} -> ${v})`,
        description: `Found unvisited neighbor '${v}'. Tree edge discovered. Push '${v}' onto LIFO Stack (Depth: ${depth[v]}).`,
        currentNode: u,
        currentEdge: unvisitedNeighbor.edgeId,
        visitedNodes: Array.from(visited),
        frontierNodes: [...stack],
        selectedEdges: [...treeEdges],
        rejectedEdges: [],
        dataStructureType: 'Stack',
        dataStructureItems: stack.map(id => ({ label: id, value: `Depth: ${depth[id]}` })),
        distances: { ...depth },
        parents: { ...parents },
        pseudocodeLine: 3,
        operationsSoFar: { ...operations },
        currentTotalCost: depth[v],
        isComplete: false,
      });
    } else {
      // Dead end, backtrack
      const popped = stack.pop()!;
      operations.queueOps++; // Pop

      steps.push({
        stepNumber: steps.length,
        title: `Backtrack from Vertex '${popped}'`,
        description: `All outgoing edges from '${popped}' lead to visited vertices. No further depth can be explored along this branch. Backtracking up the recursion stack.`,
        currentNode: stack.length > 0 ? stack[stack.length - 1] : null,
        currentEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [...stack],
        selectedEdges: [...treeEdges],
        rejectedEdges: [],
        dataStructureType: 'Stack',
        dataStructureItems: stack.map(id => ({ label: id, value: `Depth: ${depth[id]}` })),
        distances: { ...depth },
        parents: { ...parents },
        pseudocodeLine: 4,
        operationsSoFar: { ...operations },
        currentTotalCost: depth[popped],
        isComplete: false,
      });
    }
  }

  // Path reconstruction
  let path: string[] = [];
  let pathEdges: string[] = [];
  let totalWeightedCost = 0;
  let success = true;
  let message = '';

  if (targetId) {
    if (!foundTarget && !visited.has(targetId)) {
      success = false;
      message = `No path exists from '${sourceId}' to '${targetId}' via Depth First Search.`;
    } else {
      let curr: string | null = targetId;
      while (curr !== null) {
        path.unshift(curr);
        const p: string | null = parents[curr];
        if (p) {
          const edge = findEdgeBetween(graph, p, curr);
          if (edge) {
            pathEdges.unshift(edge.id);
            totalWeightedCost += Number(edge.weight);
          }
        }
        curr = p;
      }
      message = `DFS path found: ${path.join(' → ')} (${path.length - 1} hops, total weighted cost = ${totalWeightedCost}).`;
    }
  } else {
    message = `DFS traversal complete from source '${sourceId}'. Discovered ${visited.size} vertices.`;
  }

  steps.push({
    stepNumber: steps.length,
    title: success ? 'DFS Exploration Finished' : 'Destination Unreachable via DFS',
    description: success
      ? `DFS finished. Deep traversal complete. Path: [${path.length > 0 ? path.join(' → ') : 'Traversal Forest'}].`
      : `DFS stack exhausted without reaching destination '${targetId}'.`,
    currentNode: targetId || null,
    currentEdge: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    selectedEdges: pathEdges.length > 0 ? pathEdges : treeEdges,
    rejectedEdges: [],
    dataStructureType: 'Stack',
    dataStructureItems: [],
    distances: { ...depth },
    parents: { ...parents },
    pseudocodeLine: 5,
    operationsSoFar: { ...operations },
    currentTotalCost: targetId ? totalWeightedCost : visited.size,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'dfs',
    success,
    message,
    steps,
    path: path.length > 0 ? path : undefined,
    pathEdges: pathEdges.length > 0 ? pathEdges : undefined,
    totalCost: targetId ? totalWeightedCost : undefined,
    hopCount: path.length > 0 ? path.length - 1 : 0,
    nodesVisitedCount: visited.size,
    executionTimeMs,
    operations,
  };
}
