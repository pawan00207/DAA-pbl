/**
 * @file /src/algorithms/bfs.ts
 * @description Breadth-First Search (BFS) with FIFO Queue tracking, hop-count minimization,
 * traversal tree recording, operation counters, and unreachable node handling.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { buildAdjacencyList, findEdgeBetween } from './adjacency';

export function runBFS(
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
      algorithm: 'bfs',
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
  const queue: string[] = [];
  const hops: Record<string, number> = {};
  const parents: Record<string, string | null> = {};

  for (const node of graph.nodes) {
    hops[node.id] = node.id === sourceId ? 0 : Infinity;
    parents[node.id] = null;
  }

  visited.add(sourceId);
  queue.push(sourceId);
  operations.queueOps++; // Enqueue source

  // Initial Step 0
  steps.push({
    stepNumber: 0,
    title: 'BFS Initialization',
    description: `Enqueue source vertex '${sourceId}' into FIFO Queue. Set hops d[${sourceId}] = 0. Mark '${sourceId}' as visited (gray/discovered).`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [sourceId],
    frontierNodes: [sourceId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'Queue',
    dataStructureItems: [{ label: sourceId, value: 'Hop: 0' }],
    distances: { ...hops },
    parents: { ...parents },
    pseudocodeLine: 4,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  const treeEdges: string[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    operations.queueOps++; // Dequeue
    const uHops = hops[u];

    steps.push({
      stepNumber: steps.length,
      title: `Dequeue Vertex '${u}' (Level ${uHops})`,
      description: `Dequeued vertex '${u}' from head of FIFO Queue. Now exploring all adjacent outgoing edges.`,
      currentNode: u,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [...queue],
      selectedEdges: [...treeEdges],
      rejectedEdges: [],
      dataStructureType: 'Queue',
      dataStructureItems: queue.map(id => ({ label: id, value: `Hop: ${hops[id]}` })),
      distances: { ...hops },
      parents: { ...parents },
      pseudocodeLine: 5,
      operationsSoFar: { ...operations },
      currentTotalCost: uHops,
      isComplete: false,
    });

    if (targetId && u === targetId) {
      break;
    }

    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.nodeId;
      const edge = findEdgeBetween(graph, u, v);
      operations.comparisons++; // visited check

      if (!visited.has(v)) {
        visited.add(v);
        hops[v] = uHops + 1;
        parents[v] = u;
        queue.push(v);
        operations.queueOps++; // Enqueue v
        operations.relaxations++; // Hop update
        if (edge) treeEdges.push(edge.id);

        steps.push({
          stepNumber: steps.length,
          title: `Discover Vertex '${v}' via (${u} -> ${v})`,
          description: `Vertex '${v}' was undiscovered (white). Mark '${v}' visited, set hop distance d[${v}] = ${hops[v]}, predecessor π[${v}] = '${u}'. Enqueue '${v}' into FIFO Queue.`,
          currentNode: u,
          currentEdge: edge ? edge.id : null,
          visitedNodes: Array.from(visited),
          frontierNodes: [...queue],
          selectedEdges: [...treeEdges],
          rejectedEdges: [],
          dataStructureType: 'Queue',
          dataStructureItems: queue.map(id => ({ label: id, value: `Hop: ${hops[id]}` })),
          distances: { ...hops },
          parents: { ...parents },
          pseudocodeLine: 5,
          operationsSoFar: { ...operations },
          currentTotalCost: hops[v],
          isComplete: false,
        });
      }
    }
  }

  // Path reconstruction
  let path: string[] = [];
  let pathEdges: string[] = [];
  let totalWeightedCost = 0;
  let success = true;
  let message = '';

  if (targetId) {
    if (hops[targetId] === Infinity) {
      success = false;
      message = `No path exists from '${sourceId}' to '${targetId}' via Breadth First Search.`;
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
      message = `BFS found minimum-hop path: ${path.join(' → ')} (${hops[targetId]} hops, total weighted cost = ${totalWeightedCost}).`;
    }
  } else {
    message = `BFS traversal complete from source '${sourceId}'. Visited ${visited.size} vertices.`;
  }

  steps.push({
    stepNumber: steps.length,
    title: success ? 'BFS Traversal Complete' : 'Destination Unreachable',
    description: success
      ? `BFS search completed successfully. Minimum hops to target: ${targetId ? hops[targetId] : 'All accessible nodes'}. Path: [${path.join(' → ')}].`
      : `BFS queue emptied without reaching target '${targetId}'.`,
    currentNode: targetId || null,
    currentEdge: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    selectedEdges: pathEdges.length > 0 ? pathEdges : treeEdges,
    rejectedEdges: [],
    dataStructureType: 'Queue',
    dataStructureItems: [],
    distances: { ...hops },
    parents: { ...parents },
    pseudocodeLine: 6,
    operationsSoFar: { ...operations },
    currentTotalCost: targetId ? hops[targetId] : visited.size,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'bfs',
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
