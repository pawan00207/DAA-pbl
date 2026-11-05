/**
 * @file /src/algorithms/kruskal.ts
 * @description Kruskal's Minimum Spanning Tree (MST) Algorithm with Disjoint Set Union (DSU / Union-Find),
 * edge sorting, operation counters, cycle detection & rejection, and MSForest support.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, AlgorithmResult, AlgorithmStep, GraphEdge, AlgorithmOperationCounters } from '../types/graph';
import { getConnectedComponents } from './adjacency';

class DisjointSet {
  parent: Record<string, string> = {};
  rank: Record<string, number> = {};

  constructor(elements: string[]) {
    for (const elem of elements) {
      this.parent[elem] = elem;
      this.rank[elem] = 0;
    }
  }

  find(x: string, ops?: AlgorithmOperationCounters): string {
    if (ops) ops.dsuOps++;
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x], ops);
    }
    return this.parent[x];
  }

  union(x: string, y: string, ops?: AlgorithmOperationCounters): boolean {
    const rootX = this.find(x, ops);
    const rootY = this.find(y, ops);

    if (ops) ops.comparisons++;
    if (rootX === rootY) {
      return false;
    }

    if (ops) ops.dsuOps++;
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX] += 1;
    }

    return true;
  }

  getSets(): Record<string, string> {
    const sets: Record<string, string> = {};
    for (const key of Object.keys(this.parent)) {
      sets[key] = this.find(key);
    }
    return sets;
  }
}

export function runKruskal(graph: GraphData): AlgorithmResult {
  const startTime = performance.now();
  const operations: AlgorithmOperationCounters = {
    comparisons: 0,
    relaxations: 0,
    queueOps: 0,
    dsuOps: 0,
  };

  if (graph.nodes.length === 0) {
    return {
      algorithm: 'kruskal',
      success: false,
      message: 'Graph contains no nodes.',
      steps: [],
      nodesVisitedCount: 0,
      executionTimeMs: 0,
      operations,
    };
  }

  const steps: AlgorithmStep[] = [];
  const components = getConnectedComponents(graph);
  const isForest = components.length > 1;

  const nodeIds = graph.nodes.map(n => n.id);
  const dsu = new DisjointSet(nodeIds);
  operations.dsuOps += nodeIds.length; // MAKE-SET

  // Sort all edges: O(|E| log |E|)
  operations.comparisons += Math.max(1, Math.floor(graph.edges.length * Math.log2(graph.edges.length + 1)));
  const sortedEdges: GraphEdge[] = [...graph.edges].sort(
    (a, b) => Number(a.weight) - Number(b.weight)
  );

  const selectedEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let totalMstCost = 0;

  // Step 0: Initialization
  steps.push({
    stepNumber: 0,
    title: 'Kruskal Initialization & Edge Sorting',
    description: `Initialized Disjoint Set Union (DSU) with ${nodeIds.length} singleton sets. Sorted all ${sortedEdges.length} edges in non-decreasing order of weight. ${isForest ? `Notice: Graph has ${components.length} components; will construct a Minimum Spanning Forest.` : ''}`,
    currentNode: null,
    currentEdge: null,
    visitedNodes: [],
    frontierNodes: [],
    selectedEdges: [],
    rejectedEdges: [],
    dataStructureType: 'EdgeList',
    dataStructureItems: sortedEdges.map(e => ({
      label: `(${e.source}—${e.target})`,
      value: `w=${e.weight}`,
      extra: 'Pending',
    })),
    distances: {},
    parents: {},
    dsuSets: dsu.getSets(),
    pseudocodeLine: 3,
    operationsSoFar: { ...operations },
    currentTotalCost: 0,
    isComplete: false,
  });

  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const u = edge.source;
    const v = edge.target;
    const w = Number(edge.weight);

    const rootU = dsu.find(u, operations);
    const rootV = dsu.find(v, operations);
    operations.comparisons++;

    if (rootU !== rootV) {
      dsu.union(u, v, operations);
      selectedEdges.push(edge.id);
      totalMstCost += w;
      operations.relaxations++;

      const currentDsuSnapshot = dsu.getSets();

      steps.push({
        stepNumber: steps.length,
        title: `Select Safe Edge: (${u} — ${v}, w=${w})`,
        description: `Find-Set('${u}') = '${rootU}' ≠ Find-Set('${v}') = '${rootV}'. Vertices belong to distinct components. Edge does NOT introduce a cycle. Union('${rootU}', '${rootV}'). Added edge to MST. Current weight = ${totalMstCost}.`,
        currentNode: null,
        currentEdge: edge.id,
        visitedNodes: Object.keys(currentDsuSnapshot),
        frontierNodes: [u, v],
        selectedEdges: [...selectedEdges],
        rejectedEdges: [...rejectedEdges],
        dataStructureType: 'DisjointSet',
        dataStructureItems: Object.entries(currentDsuSnapshot).map(([node, root]) => ({
          label: node,
          value: `Root: ${root}`,
        })),
        distances: {},
        parents: {},
        dsuSets: currentDsuSnapshot,
        pseudocodeLine: 4,
        operationsSoFar: { ...operations },
        currentTotalCost: totalMstCost,
        isComplete: false,
      });

      if (!isForest && selectedEdges.length === graph.nodes.length - 1) {
        break;
      }
    } else {
      rejectedEdges.push(edge.id);

      steps.push({
        stepNumber: steps.length,
        title: `Reject Edge: (${u} — ${v}, w=${w}) [Cycle Detected]`,
        description: `Find-Set('${u}') = '${rootU}' == Find-Set('${v}') = '${rootV}'. Both endpoints already share root representative '${rootU}'. Adding this edge would create a cycle! Edge rejected.`,
        currentNode: null,
        currentEdge: edge.id,
        visitedNodes: Object.keys(dsu.getSets()),
        frontierNodes: [u, v],
        selectedEdges: [...selectedEdges],
        rejectedEdges: [...rejectedEdges],
        dataStructureType: 'EdgeList',
        dataStructureItems: sortedEdges.slice(i + 1).map(e => ({
          label: `(${e.source}—${e.target})`,
          value: `w=${e.weight}`,
        })),
        distances: {},
        parents: {},
        dsuSets: dsu.getSets(),
        pseudocodeLine: 4,
        operationsSoFar: { ...operations },
        currentTotalCost: totalMstCost,
        isComplete: false,
      });
    }
  }

  const finalMsg = isForest
    ? `Kruskal created Minimum Spanning Forest across ${components.length} components using ${selectedEdges.length} edges. Total forest weight = ${totalMstCost}.`
    : `Kruskal created Minimum Spanning Tree with ${selectedEdges.length} edges (|V|-1). Total MST weight = ${totalMstCost}.`;

  steps.push({
    stepNumber: steps.length,
    title: isForest ? 'Kruskal Complete (Minimum Spanning Forest)' : 'Kruskal Complete (MST)',
    description: finalMsg,
    currentNode: null,
    currentEdge: null,
    visitedNodes: nodeIds,
    frontierNodes: [],
    selectedEdges: [...selectedEdges],
    rejectedEdges: [...rejectedEdges],
    dataStructureType: 'DisjointSet',
    dataStructureItems: Object.entries(dsu.getSets()).map(([node, root]) => ({
      label: node,
      value: `Root: ${root}`,
    })),
    distances: {},
    parents: {},
    dsuSets: dsu.getSets(),
    pseudocodeLine: 5,
    operationsSoFar: { ...operations },
    currentTotalCost: totalMstCost,
    isComplete: true,
  });

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    algorithm: 'kruskal',
    success: true,
    message: finalMsg,
    steps,
    pathEdges: selectedEdges,
    totalCost: totalMstCost,
    hopCount: selectedEdges.length,
    nodesVisitedCount: nodeIds.length,
    executionTimeMs,
    isForest,
    componentCount: components.length,
    operations,
  };
}
