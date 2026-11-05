/**
 * @file /src/algorithms/adjacency.ts
 * @description Graph representation as Adjacency List and Matrix, graph validation utilities.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, GraphEdge } from '../types/graph';

export interface AdjacencyNeighbor {
  nodeId: string;
  weight: number;
  edgeId: string;
}

export type AdjacencyList = Map<string, AdjacencyNeighbor[]>;

/**
 * Builds an Adjacency List representation from GraphData.
 * Adjacency lists are O(|V| + |E|) space-efficient compared to O(|V|^2) adjacency matrices.
 */
export function buildAdjacencyList(graph: GraphData): AdjacencyList {
  const adjList: AdjacencyList = new Map();

  // Initialize entry for all nodes
  for (const node of graph.nodes) {
    adjList.set(node.id, []);
  }

  // Populate edges
  for (const edge of graph.edges) {
    if (!adjList.has(edge.source)) adjList.set(edge.source, []);
    if (!adjList.has(edge.target)) adjList.set(edge.target, []);

    adjList.get(edge.source)!.push({
      nodeId: edge.target,
      weight: Number(edge.weight),
      edgeId: edge.id,
    });

    // If undirected, add reverse edge as well
    if (!graph.isDirected) {
      adjList.get(edge.target)!.push({
        nodeId: edge.source,
        weight: Number(edge.weight),
        edgeId: edge.id,
      });
    }
  }

  return adjList;
}

/**
 * Validates edge weights. Dijkstra requires non-negative edge weights (w(u,v) >= 0).
 */
export function checkHasNegativeWeights(graph: GraphData): { hasNegative: boolean; negativeEdges: GraphEdge[] } {
  const negativeEdges = graph.edges.filter(e => Number(e.weight) < 0);
  return {
    hasNegative: negativeEdges.length > 0,
    negativeEdges,
  };
}

/**
 * Finds edge between two nodes in either direction if undirected, or source->target if directed.
 */
export function findEdgeBetween(
  graph: GraphData,
  u: string,
  v: string
): GraphEdge | undefined {
  return graph.edges.find(e => {
    if (graph.isDirected) {
      return e.source === u && e.target === v;
    }
    return (
      (e.source === u && e.target === v) ||
      (e.source === v && e.target === u)
    );
  });
}

/**
 * Determines connected components in undirected graph (or weakly connected components in directed graph).
 */
export function getConnectedComponents(graph: GraphData): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];

  // Build an undirected view of the graph for component counting
  const undirectedAdj = new Map<string, string[]>();
  for (const n of graph.nodes) undirectedAdj.set(n.id, []);
  for (const e of graph.edges) {
    undirectedAdj.get(e.source)?.push(e.target);
    undirectedAdj.get(e.target)?.push(e.source);
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      const comp: string[] = [];
      const queue = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        comp.push(curr);
        for (const neighbor of undirectedAdj.get(curr) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(comp);
    }
  }

  return components;
}

/**
 * Generates an Adjacency Matrix representation for educational inspection.
 */
export function buildAdjacencyMatrix(graph: GraphData): {
  nodeIds: string[];
  matrix: (number | null)[][];
} {
  const nodeIds = graph.nodes.map(n => n.id);
  const n = nodeIds.length;
  const matrix: (number | null)[][] = Array.from({ length: n }, () =>
    Array(n).fill(null)
  );

  const idToIndex = new Map<string, number>();
  nodeIds.forEach((id, idx) => idToIndex.set(id, idx));

  for (const edge of graph.edges) {
    const u = idToIndex.get(edge.source);
    const v = idToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = Number(edge.weight);
      if (!graph.isDirected) {
        matrix[v][u] = Number(edge.weight);
      }
    }
  }

  return { nodeIds, matrix };
}
