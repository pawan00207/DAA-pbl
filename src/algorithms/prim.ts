/**
 * @file /src/algorithms/prim.ts
 * @description Prim's Minimum Spanning Tree (MST) Algorithm with Cut Property visualization,
 * operation counters, Priority Queue edge tracking, and Disconnected Graph (MSForest) support.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, AlgorithmOperationCounters } from '../types/graph';
import { buildAdjacencyList, getConnectedComponents } from './adjacency';

interface CutEdge {
  u: string;
  v: string;
  weight: number;
  edgeId: string;
}

export function runPrim(graph: GraphData, startNodeId?: string): AlgorithmResult {
  const startTime = performance.now();
  const operations: AlgorithmOperationCounters = {
    comparisons: 0,
    relaxations: 0,
    queueOps: 0,
    dsuOps: 0,
  };

  if (graph.nodes.length === 0) {
    return {
      algorithm: 'prim',
      success: false,
      message: 'Graph contains no nodes.',
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  const adjList = buildAdjacencyList(graph);
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const selectedEdges: string[] = [];
  let totalMstCost = 0;

  const components = getConnectedComponents(graph);
  const isForest = components.length > 1;

  const key: Record<string, number> = {};
  const parent: Record<string, string | null> = {};

  for (const node of graph.nodes) {
    key[node.id] = Infinity;
    parent[node.id] = null;
  }

  const rootNodeId = startNodeId && graph.nodes.some(n => n.id === startNodeId)
    ? startNodeId
    : graph.nodes[0].id;

  const orderedComponents = [...components].sort((a, b) => {
    if (a.includes(rootNodeId)) return -1;
    if (b.includes(rootNodeId)) return 1;
    return 0;
  });

  let candidateCutEdges: CutEdge[] = [];

  // Step 0: Initialization
  steps.push({
    stepNumber: 0,
    title: 'Prim MST Initialization',
    description: `Initialize Prim's algorithm. Graph has ${graph.nodes.length} vertices and ${graph.edges.length} edges (${components.length} connected component${components.length > 1 ? 's' : ''}). ${isForest ? 'Notice: Disconnected graph detected. Prim will construct a Minimum Spanning Forest.' : 'Graph is connected; constructing a single MST.'}`,
    currentNode: rootNodeId,
    currentEdge: null,
    visitedNodes: [],
    frontierNodes: [rootNodeId],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [],
    distances: { ...key },
    parents: { ...parent },
    pseudocodeLine: 1,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  let componentIndex = 0;

  for (const comp of orderedComponents) {
    componentIndex++;
    const compStart = comp.includes(rootNodeId) && !visited.has(rootNodeId)
      ? rootNodeId
      : comp.find(id => !visited.has(id));

    if (!compStart) continue;

    visited.add(compStart);
    key[compStart] = 0;

    const neighbors = adjList.get(compStart) || [];
    for (const n of neighbors) {
      if (!visited.has(n.nodeId)) {
        candidateCutEdges.push({
          u: compStart,
          v: n.nodeId,
          weight: n.weight,
          edgeId: n.edgeId,
        });
        operations.queueOps++; // Insert cut edge
      }
    }

    steps.push({
      stepNumber: steps.length,
      title: `Start Component #${componentIndex} at Vertex '${compStart}'`,
      description: `Added seed vertex '${compStart}' into Tree S. Discovered ${neighbors.length} crossing cut edges (S, V \\ S).`,
      currentNode: compStart,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: candidateCutEdges.map(e => e.v),
      selectedEdges: [...selectedEdges],
      rejectedEdges: [],
      dataStructureType: 'PriorityQueue',
      dataStructureItems: candidateCutEdges
        .sort((a, b) => a.weight - b.weight)
        .map(e => ({ label: `(${e.u}—${e.v})`, value: `w=${e.weight}` })),
      distances: { ...key },
      parents: { ...parent },
      pseudocodeLine: 2,
      operationsSoFar: { ...operations },
      currentTotalCost: totalMstCost,
      isComplete: false,
    });

    while (candidateCutEdges.length > 0) {
      operations.comparisons += Math.max(1, Math.floor(Math.log2(candidateCutEdges.length + 1)));
      candidateCutEdges.sort((a, b) => a.weight - b.weight);
      const minEdge = candidateCutEdges.shift()!;
      operations.queueOps++; // Extract-Min

      if (visited.has(minEdge.v)) {
        continue;
      }

      const u = minEdge.u;
      const v = minEdge.v;
      visited.add(v);
      selectedEdges.push(minEdge.edgeId);
      totalMstCost += minEdge.weight;
      parent[v] = u;
      key[v] = minEdge.weight;
      operations.relaxations++; // Added edge to tree

      const vNeighbors = adjList.get(v) || [];
      for (const n of vNeighbors) {
        if (!visited.has(n.nodeId)) {
          candidateCutEdges.push({
            u: v,
            v: n.nodeId,
            weight: n.weight,
            edgeId: n.edgeId,
          });
          operations.queueOps++; // Add newly available cut edge
        }
      }

      candidateCutEdges = candidateCutEdges.filter(e => !visited.has(e.v));

      steps.push({
        stepNumber: steps.length,
        title: `Cut Property: Add Edge (${u} — ${v}, w=${minEdge.weight})`,
        description: `Cut Property Theorem: Minimum-weight edge crossing cut (S, V \\ S) is (${u} — ${v}) with weight ${minEdge.weight}. Added to MST. Absorbed vertex '${v}' into Tree S. Current MST weight = ${totalMstCost}.`,
        currentNode: v,
        currentEdge: minEdge.edgeId,
        visitedNodes: Array.from(visited),
        frontierNodes: candidateCutEdges.map(e => e.v),
        selectedEdges: [...selectedEdges],
        rejectedEdges: [],
        dataStructureType: 'PriorityQueue',
        dataStructureItems: candidateCutEdges
          .sort((a, b) => a.weight - b.weight)
          .map(e => ({ label: `(${e.u}—${e.v})`, value: `w=${e.weight}` })),
        distances: { ...key },
        parents: { ...parent },
        pseudocodeLine: 4,
        operationsSoFar: { ...operations },
        currentTotalCost: totalMstCost,
        isComplete: false,
      });
    }
  }

  const finalMsg = isForest
    ? `Constructed Minimum Spanning Forest with ${components.length} tree components across ${selectedEdges.length} edges. Total forest weight = ${totalMstCost}.`
    : `Constructed Minimum Spanning Tree with ${selectedEdges.length} edges (|V|-1 = ${graph.nodes.length - 1}). Total MST weight = ${totalMstCost}.`;

  steps.push({
    stepNumber: steps.length,
    title: isForest ? 'Prim Execution Complete (Minimum Spanning Forest)' : 'Prim Execution Complete (MST)',
    description: finalMsg,
    currentNode: null,
    currentEdge: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    selectedEdges: [...selectedEdges],
    rejectedEdges: [],
    dataStructureType: 'PriorityQueue',
    dataStructureItems: [],
    distances: { ...key },
    parents: { ...parent },
    pseudocodeLine: 5,
    operationsSoFar: { ...operations },
    currentTotalCost: totalMstCost,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'prim',
    success: true,
    message: finalMsg,
    steps,
    pathEdges: selectedEdges,
    totalCost: totalMstCost,
    hopCount: selectedEdges.length,
    nodesVisitedCount: visited.size,
    executionTimeMs,
    isForest,
    componentCount: components.length,
    operations,
  };
}
