/**
 * @file /src/algorithms/algorithms.test.ts
 * @description Comprehensive Vitest unit test suite for all 8 graph algorithms.
 * Tests CLRS textbook benchmarks, disconnected forests, negative cycles, and edge cases.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import { describe, it, expect } from 'vitest';
import { runDijkstra } from './dijkstra';
import { runBellmanFord } from './bellmanFord';
import { runAStar } from './aStar';
import { runBFS } from './bfs';
import { runDFS } from './dfs';
import { runPrim } from './prim';
import { runKruskal } from './kruskal';
import { runFloydWarshall } from './floydWarshall';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';
import { GraphData } from '../types/graph';

describe('1. Dijkstra Shortest Path Algorithm', () => {
  const clrsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_clrs_shortest_path')!;

  it('computes correct shortest path on CLRS Textbook Fig 24.6 (s -> x)', () => {
    // In CLRS Fig 24.6: s->y=5, y->t=3, t->x=1 => total cost = 9 (path: s -> y -> t -> x)
    const res = runDijkstra(clrsGraph, 's', 'x');
    expect(res.success).toBe(true);
    expect(res.totalCost).toBe(9);
    expect(res.path).toEqual(['s', 'y', 't', 'x']);
  });

  it('strictly rejects graphs with negative edge weights', () => {
    const negGraph: GraphData = {
      id: 'neg_test',
      name: 'Neg Graph',
      isDirected: true,
      nodes: [{ id: 'A', label: 'A', x: 0, y: 0 }, { id: 'B', label: 'B', x: 10, y: 10 }],
      edges: [{ id: 'e1', source: 'A', target: 'B', weight: -3 }],
    };
    const res = runDijkstra(negGraph, 'A', 'B');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Negative edge weights detected');
  });

  it('correctly handles unreachable destination on disconnected graph', () => {
    const islandsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_disconnected_islands')!;
    const res = runDijkstra(islandsGraph, 'A1', 'B1');
    expect(res.success).toBe(false);
    expect(res.message).toContain('unreachable');
  });
});

describe('2. Bellman-Ford Algorithm', () => {
  it('correctly computes shortest path with negative edge weights', () => {
    const graphWithNegative: GraphData = {
      id: 'bf_valid',
      name: 'BF Valid',
      isDirected: true,
      nodes: [
        { id: 'S', label: 'S', x: 0, y: 0 },
        { id: 'A', label: 'A', x: 10, y: 0 },
        { id: 'B', label: 'B', x: 20, y: 0 },
      ],
      edges: [
        { id: 'e1', source: 'S', target: 'A', weight: 5 },
        { id: 'e2', source: 'A', target: 'B', weight: -2 },
      ],
    };
    const res = runBellmanFord(graphWithNegative, 'S', 'B');
    expect(res.success).toBe(true);
    expect(res.totalCost).toBe(3);
    expect(res.path).toEqual(['S', 'A', 'B']);
  });

  it('detects negative-weight cycles and halts with error', () => {
    const negCycleGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_negative_cycle')!;
    const res = runBellmanFord(negCycleGraph, 'S', 'D');
    expect(res.success).toBe(false);
    expect(res.hasNegativeCycle).toBe(true);
    expect(res.message).toContain('Negative-weight cycle detected');
  });
});

describe('3. A* Search Algorithm', () => {
  const clrsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_clrs_shortest_path')!;

  it('computes identical optimal path to Dijkstra on spatial graphs', () => {
    const res = runAStar(clrsGraph, 's', 'x');
    expect(res.success).toBe(true);
    expect(res.totalCost).toBe(9);
    expect(res.path).toEqual(['s', 'y', 't', 'x']);
  });
});

describe('4. Breadth-First Search (BFS)', () => {
  const transitGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_delhi_transit')!;

  it('minimizes hop count rather than weighted distance', () => {
    const res = runBFS(transitGraph, 'KG', 'NOI');
    expect(res.success).toBe(true);
    expect(res.hopCount).toBe(2);
    expect([['KG', 'CP', 'NOI'], ['KG', 'ANV', 'NOI']]).toContainEqual(res.path);
  });

  it('handles unreachable destination', () => {
    const islandsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_disconnected_islands')!;
    const res = runBFS(islandsGraph, 'A1', 'B2');
    expect(res.success).toBe(false);
  });
});

describe('5. Depth-First Search (DFS)', () => {
  const clrsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_clrs_shortest_path')!;

  it('explores deep paths and visits all reachable nodes', () => {
    const res = runDFS(clrsGraph, 's');
    expect(res.success).toBe(true);
    expect(res.nodesVisitedCount).toBe(5);
  });
});

describe('6. Prim Minimum Spanning Tree (MST)', () => {
  it('constructs optimal MST on complete graph K5', () => {
    const k5Graph = SAMPLE_GRAPHS.find(g => g.id === 'sample_complete_k5')!;
    const res = runPrim(k5Graph);
    expect(res.success).toBe(true);
    expect(res.isForest).toBe(false);
    expect(res.pathEdges?.length).toBe(4); // |V| - 1 = 4
  });

  it('constructs Minimum Spanning Forest on disconnected graphs', () => {
    const islandsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_disconnected_islands')!;
    const res = runPrim(islandsGraph);
    expect(res.success).toBe(true);
    expect(res.isForest).toBe(true);
    expect(res.componentCount).toBe(2);
  });
});

describe('7. Kruskal Minimum Spanning Tree (MST)', () => {
  it('constructs optimal MST with cycle avoidance', () => {
    const k5Graph = SAMPLE_GRAPHS.find(g => g.id === 'sample_complete_k5')!;
    const res = runKruskal(k5Graph);
    expect(res.success).toBe(true);
    expect(res.isForest).toBe(false);
    expect(res.pathEdges?.length).toBe(4); // |V| - 1 = 4
  });

  it('constructs Minimum Spanning Forest on disconnected graph', () => {
    const islandsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_disconnected_islands')!;
    const res = runKruskal(islandsGraph);
    expect(res.success).toBe(true);
    expect(res.isForest).toBe(true);
    expect(res.componentCount).toBe(2);
  });
});

describe('8. Floyd-Warshall All-Pairs Shortest Path', () => {
  const clrsGraph = SAMPLE_GRAPHS.find(g => g.id === 'sample_clrs_shortest_path')!;

  it('computes full pairwise distance matrix', () => {
    const res = runFloydWarshall(clrsGraph);
    expect(res.success).toBe(true);
    expect(res.allPairsMatrix).toBeDefined();
    expect(res.allPairsMatrix?.length).toBe(5);
  });
});
