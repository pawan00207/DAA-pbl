/**
 * @file /src/types/graph.ts
 * @description Core TypeScript definitions for Graph structures, Algorithm execution,
 * step-by-step tracing, operation counters, and simulation history.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  directed?: boolean;
}

export interface GraphData {
  id: string;
  name: string;
  description?: string;
  isDirected: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type AlgorithmType =
  | 'dijkstra'
  | 'bfs'
  | 'dfs'
  | 'prim'
  | 'kruskal'
  | 'bellman-ford'
  | 'astar'
  | 'floyd-warshall';

export interface QueueItem {
  id: string;
  priority?: number;
  label?: string;
}

export interface KruskalEdgeItem {
  edgeId: string;
  u: string;
  v: string;
  weight: number;
  status: 'pending' | 'selected' | 'rejected';
  reason?: string;
}

export interface AlgorithmOperationCounters {
  comparisons: number;
  relaxations: number;
  queueOps: number;
  dsuOps: number;
  matrixUpdates?: number;
}

export interface AStarNodeMetrics {
  g: number; // cost from start
  h: number; // heuristic to target
  f: number; // g + h
}

export interface AlgorithmStep {
  stepNumber: number;
  title: string;
  description: string;
  currentNode: string | null;
  currentEdge: string | null;
  visitedNodes: string[];
  frontierNodes: string[]; // nodes currently in queue/stack/cut
  selectedEdges: string[]; // edges in shortest path or MST so far
  rejectedEdges: string[]; // edges rejected (e.g. Kruskal cycle)
  
  // Data structure snapshot for educational visualization
  dataStructureType: 'PriorityQueue' | 'Queue' | 'Stack' | 'EdgeList' | 'DisjointSet' | 'DistanceMatrix';
  dataStructureItems: Array<{ label: string; value: string | number; extra?: string }>;
  
  // Table state (distances, parents, sets)
  distances: Record<string, number>;
  parents: Record<string, string | null>;
  dsuSets?: Record<string, string>; // for Kruskal (node -> representative)
  
  // Live pseudocode sync
  pseudocodeLine?: number;

  // Real-time operations count at this step
  operationsSoFar?: AlgorithmOperationCounters;

  // A* specific heuristic breakdowns
  aStarMetrics?: Record<string, AStarNodeMetrics>;

  // Floyd-Warshall matrix state
  matrixSnapshot?: (number | null)[][];
  matrixChangedCells?: { row: number; col: number }[];
  matrixKVertex?: string | null;

  // Bellman-Ford negative cycle detected
  negativeCycleDetected?: boolean;
  negativeCycleNodes?: string[];

  // Accumulated metrics
  currentTotalCost?: number;
  isComplete?: boolean;
}

export interface AlgorithmResult {
  algorithm: AlgorithmType;
  success: boolean;
  message: string;
  steps: AlgorithmStep[];
  path?: string[]; // Node IDs in order for Dijkstra/BFS/DFS/A*
  pathEdges?: string[]; // Edge IDs in order
  totalCost?: number;
  hopCount?: number;
  nodesVisitedCount: number;
  executionTimeMs: number;
  isForest?: boolean; // For Prim/Kruskal on disconnected graph
  componentCount?: number;
  
  // Operation counters
  operations: AlgorithmOperationCounters;

  // Negative cycle specifics for Bellman-Ford
  hasNegativeCycle?: boolean;
  negativeCycleEdges?: string[];

  // All pairs matrix for Floyd-Warshall
  allPairsMatrix?: (number | null)[][];
  matrixNodeIds?: string[];
}

export interface SimulationRecord {
  id: string;
  timestamp: number;
  algorithm: AlgorithmType;
  graphName: string;
  nodeCount: number;
  edgeCount: number;
  isDirected: boolean;
  sourceNode?: string;
  targetNode?: string;
  success: boolean;
  totalCost?: number;
  hopCount?: number;
  executionTimeMs: number;
  message: string;
  operations?: AlgorithmOperationCounters;
}

export interface TheoreticalComplexity {
  algorithm: AlgorithmType;
  name: string;
  inventor: string;
  year: string;
  paradigm: string;
  dataStructures: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  spaceComplexity: string;
  primaryUse: string;
  negativeWeightsAllowed: boolean;
  handlesDisconnected: boolean;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}
