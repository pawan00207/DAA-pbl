/**
 * @file /src/algorithms/benchmarks.ts
 * @description Benchmarking suite for empirical performance vs theoretical complexity analysis.
 * Generates test graphs and benchmarks Dijkstra, BFS, DFS, Prim, Kruskal, Bellman-Ford, A*, and Floyd-Warshall.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { GraphData, GraphNode, GraphEdge, TheoreticalComplexity } from '../types/graph';
import { runDijkstra } from './dijkstra';
import { runBFS } from './bfs';
import { runDFS } from './dfs';
import { runPrim } from './prim';
import { runKruskal } from './kruskal';
import { runBellmanFord } from './bellmanFord';
import { runAStar } from './aStar';
import { runFloydWarshall } from './floydWarshall';

export const THEORETICAL_COMPLEXITIES: TheoreticalComplexity[] = [
  {
    algorithm: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    inventor: 'Edsger W. Dijkstra',
    year: '1956',
    paradigm: 'Greedy Algorithm',
    dataStructures: 'Min-Priority Queue (Binary Heap / Fibonacci Heap), Adjacency List',
    timeBest: 'O(|V| log |V| + |E|)',
    timeAvg: 'O((|V| + |E|) log |V|)',
    timeWorst: 'O((|V| + |E|) log |V|) [or O(|V|² + |E|) with array]',
    spaceComplexity: 'O(|V| + |E|)',
    primaryUse: 'Single-source shortest path with non-negative edge weights (GPS, IP routing)',
    negativeWeightsAllowed: false,
    handlesDisconnected: true,
  },
  {
    algorithm: 'astar',
    name: 'A* Heuristic Search',
    inventor: 'Hart, Nilsson & Raphael',
    year: '1968',
    paradigm: 'Informed / Best-First Heuristic',
    dataStructures: 'Min-Priority Queue (f=g+h), Adjacency List, Euclidean Heuristic',
    timeBest: 'O(|E|) [perfect heuristic]',
    timeAvg: 'O((|V| + |E|) log |V|)',
    timeWorst: 'O(|V|²)',
    spaceComplexity: 'O(|V|)',
    primaryUse: 'Targeted pathfinding in game AI, robotics, route planning with spatial coordinates',
    negativeWeightsAllowed: false,
    handlesDisconnected: true,
  },
  {
    algorithm: 'bfs',
    name: 'Breadth First Search (BFS)',
    inventor: 'Konrad Zuse / E. F. Moore',
    year: '1959',
    paradigm: 'Level-Order Graph Traversal',
    dataStructures: 'FIFO Queue, Visited Set, Adjacency List',
    timeBest: 'O(1) [target is root]',
    timeAvg: 'O(|V| + |E|)',
    timeWorst: 'O(|V| + |E|)',
    spaceComplexity: 'O(|V|)',
    primaryUse: 'Unweighted shortest path (minimum hops), connectivity, peer-to-peer torrents',
    negativeWeightsAllowed: true,
    handlesDisconnected: true,
  },
  {
    algorithm: 'dfs',
    name: 'Depth First Search (DFS)',
    inventor: 'Charles Pierre Trémaux',
    year: '1882',
    paradigm: 'Backtracking / Depth Exploration',
    dataStructures: 'LIFO Stack / Call Stack, Visited Set, Adjacency List',
    timeBest: 'O(1) [target is root]',
    timeAvg: 'O(|V| + |E|)',
    timeWorst: 'O(|V| + |E|)',
    spaceComplexity: 'O(|V|) [recursion depth]',
    primaryUse: 'Topological sort, strongly connected components (Tarjan/Kosaraju), cycle detection',
    negativeWeightsAllowed: true,
    handlesDisconnected: true,
  },
  {
    algorithm: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    inventor: 'Richard Bellman & Lester Ford Jr.',
    year: '1958',
    paradigm: 'Dynamic Programming / Edge Relaxation',
    dataStructures: 'Array of Edges, Distance Array d[v]',
    timeBest: 'O(|E|) [converged in 1 pass]',
    timeAvg: 'O(|V| · |E|)',
    timeWorst: 'O(|V| · |E|)',
    spaceComplexity: 'O(|V|)',
    primaryUse: 'Shortest paths with arbitrary/negative edge weights, negative cycle detection (RIP protocol)',
    negativeWeightsAllowed: true,
    handlesDisconnected: true,
  },
  {
    algorithm: 'floyd-warshall',
    name: 'Floyd-Warshall (APSP)',
    inventor: 'Robert Floyd & Stephen Warshall',
    year: '1962',
    paradigm: 'Dynamic Programming (Triply Nested)',
    dataStructures: '|V| × |V| 2D Distance Matrix D^(k)',
    timeBest: 'O(|V|³)',
    timeAvg: 'O(|V|³)',
    timeWorst: 'O(|V|³)',
    spaceComplexity: 'O(|V|²)',
    primaryUse: 'All-Pairs Shortest Paths in dense networks, transitive closure, matrix routing',
    negativeWeightsAllowed: true,
    handlesDisconnected: true,
  },
  {
    algorithm: 'prim',
    name: "Prim's Minimum Spanning Tree",
    inventor: 'Vojtěch Jarník / Robert C. Prim',
    year: '1957',
    paradigm: 'Greedy Algorithm (Cut Property)',
    dataStructures: 'Min-Priority Queue, Key array, Adjacency List',
    timeBest: 'O(|E| log |V|)',
    timeAvg: 'O(|E| log |V|)',
    timeWorst: 'O(|E| log |V|) [Fibonacci Heap: O(|E| + |V| log |V|)]',
    spaceComplexity: 'O(|V| + |E|)',
    primaryUse: 'Minimum Spanning Tree in dense networks, telecom cabling, cluster analysis',
    negativeWeightsAllowed: true,
    handlesDisconnected: true, // As MSForest
  },
  {
    algorithm: 'kruskal',
    name: "Kruskal's Minimum Spanning Tree",
    inventor: 'Joseph Kruskal',
    year: '1956',
    paradigm: 'Greedy Algorithm (Cycle Avoidance)',
    dataStructures: 'Disjoint Set Union (DSU / Union-Find with Path Compression), Edge Array',
    timeBest: 'O(|E| log |E|)',
    timeAvg: 'O(|E| log |E|)',
    timeWorst: 'O(|E| log |E|) = O(|E| log |V|)',
    spaceComplexity: 'O(|V| + |E|)',
    primaryUse: 'Minimum Spanning Tree in sparse graphs, network design, image segmentation',
    negativeWeightsAllowed: true,
    handlesDisconnected: true, // As MSForest
  },
];

/**
 * Generates a connected random graph with given number of vertices and approximate edge density.
 */
export function generateBenchmarkGraph(vertexCount: number, edgeDensity: number = 0.3): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (let i = 0; i < vertexCount; i++) {
    nodes.push({
      id: `v${i}`,
      label: `V${i}`,
      x: 100 + Math.random() * 800,
      y: 100 + Math.random() * 500,
    });
  }

  // Ensure connectivity by forming a random spanning backbone first
  for (let i = 1; i < vertexCount; i++) {
    const parent = Math.floor(Math.random() * i);
    edges.push({
      id: `e_init_${i}`,
      source: `v${parent}`,
      target: `v${i}`,
      weight: Math.floor(Math.random() * 30) + 1,
    });
  }

  // Add additional edges based on density
  let edgeIdCounter = vertexCount;
  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      if (Math.random() < edgeDensity) {
        const alreadyExists = edges.some(
          e => (e.source === `v${i}` && e.target === `v${j}`) || (e.source === `v${j}` && e.target === `v${i}`)
        );
        if (!alreadyExists) {
          edges.push({
            id: `e_${edgeIdCounter++}`,
            source: `v${i}`,
            target: `v${j}`,
            weight: Math.floor(Math.random() * 50) + 1,
          });
        }
      }
    }
  }

  return {
    id: `bench_v${vertexCount}`,
    name: `Synthetic Graph (|V|=${vertexCount}, |E|=${edges.length})`,
    isDirected: false,
    nodes,
    edges,
  };
}

export interface BenchmarkDataPoint {
  vertexCount: number;
  edgeCount: number;
  dijkstraTime: number;
  bfsTime: number;
  dfsTime: number;
  primTime: number;
  kruskalTime: number;
  bellmanFordTime: number;
  aStarTime: number;
  dijkstraOps?: number;
  bfsOps?: number;
  primOps?: number;
  kruskalOps?: number;
}

/**
 * Runs benchmarks across multiple input sizes.
 */
export function runEmpiricalBenchmarks(sizes: number[] = [10, 25, 50, 100, 150]): BenchmarkDataPoint[] {
  const results: BenchmarkDataPoint[] = [];

  for (const size of sizes) {
    const graph = generateBenchmarkGraph(size, 0.25);
    const sourceId = graph.nodes[0].id;
    const targetId = graph.nodes[graph.nodes.length - 1].id;

    const TRIALS = 3;

    let dTime = 0;
    let bTime = 0;
    let dfTime = 0;
    let pTime = 0;
    let kTime = 0;
    let bfTime = 0;
    let astTime = 0;

    let dOps = 0;
    let bOps = 0;
    let pOps = 0;
    let kOps = 0;

    for (let t = 0; t < TRIALS; t++) {
      const dRes = runDijkstra(graph, sourceId, targetId);
      const bRes = runBFS(graph, sourceId, targetId);
      const dfRes = runDFS(graph, sourceId, targetId);
      const pRes = runPrim(graph, sourceId);
      const kRes = runKruskal(graph);
      const bfRes = size <= 80 ? runBellmanFord(graph, sourceId, targetId) : { executionTimeMs: 0 };
      const astRes = runAStar(graph, sourceId, targetId);

      dTime += dRes.executionTimeMs;
      bTime += bRes.executionTimeMs;
      dfTime += dfRes.executionTimeMs;
      pTime += pRes.executionTimeMs;
      kTime += kRes.executionTimeMs;
      bfTime += bfRes.executionTimeMs;
      astTime += astRes.executionTimeMs;

      if (t === 0) {
        dOps = dRes.operations.relaxations + dRes.operations.comparisons;
        bOps = bRes.operations.relaxations + bRes.operations.comparisons;
        pOps = pRes.operations.relaxations + pRes.operations.comparisons;
        kOps = kRes.operations.dsuOps + kRes.operations.comparisons;
      }
    }

    results.push({
      vertexCount: size,
      edgeCount: graph.edges.length,
      dijkstraTime: Number((dTime / TRIALS).toFixed(3)),
      bfsTime: Number((bTime / TRIALS).toFixed(3)),
      dfsTime: Number((dfTime / TRIALS).toFixed(3)),
      primTime: Number((pTime / TRIALS).toFixed(3)),
      kruskalTime: Number((kTime / TRIALS).toFixed(3)),
      bellmanFordTime: Number((bfTime / TRIALS).toFixed(3)),
      aStarTime: Number((astTime / TRIALS).toFixed(3)),
      dijkstraOps: dOps,
      bfsOps: bOps,
      primOps: pOps,
      kruskalOps: kOps,
    });
  }

  return results;
}
