/**
 * @file /src/components/LearningCenter.tsx
 * @description Comprehensive DAA Learning Center featuring all 8 algorithms,
 * formal CLRS pseudocode, time/space proofs, viva exam questions accordion,
 * and algorithm cheat-sheet comparison table.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState } from 'react';
import { AlgorithmType, VivaQuestion } from '../types/graph';
import {
  BookOpen,
  Check,
  Cpu,
  Layers,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
} from 'lucide-react';

interface AlgorithmStudyGuide {
  id: AlgorithmType;
  title: string;
  inventor: string;
  year: string;
  paradigm: string;
  tagline: string;
  introduction: string;
  workingPrinciple: string;
  invariant: string;
  pseudocode: string[];
  stepExplanation: string[];
  timeComplexityBreakdown: {
    best: string;
    avg: string;
    worst: string;
    explanation: string;
  };
  spaceComplexity: string;
  realWorldApplications: string[];
  advantages: string[];
  limitations: string[];
  vivaQuestions: VivaQuestion[];
}

export const STUDY_GUIDES: AlgorithmStudyGuide[] = [
  {
    id: 'dijkstra',
    title: "Dijkstra's Shortest Path Algorithm",
    inventor: 'Edsger W. Dijkstra',
    year: '1956 (Published 1959)',
    paradigm: 'Greedy Technique',
    tagline: 'Single-source shortest path on weighted graphs with non-negative edge weights.',
    introduction: `Conceived by Dutch computer scientist Edsger W. Dijkstra in 1956. It is the fundamental algorithm powering Internet Protocol routing (OSPF, IS-IS) and satellite GPS turn-by-turn navigation.`,
    workingPrinciple: `Dijkstra maintains a set S of finalized vertices. At each step, it greedily extracts the vertex u with the smallest tentative distance from a Min-Priority Queue. Because all edge weights are non-negative, u's tentative distance can never decrease further, proving optimality. Incident edges are relaxed: d[v] = min(d[v], d[u] + w(u,v)).`,
    invariant: `Loop Invariant: For each finalized vertex u ∈ S, tentative distance d[u] equals the exact shortest path weight δ(s, u) from source s.`,
    pseudocode: [
      'DIJKSTRA(G, w, s):',
      '  INITIALIZE-SINGLE-SOURCE(G, s)',
      '  S = ∅  // Finalized cloud',
      '  Q = G.V  // Min-Priority Queue',
      '  while Q ≠ ∅:',
      '    u = EXTRACT-MIN(Q)',
      '    S = S ∪ {u}',
      '    for each v ∈ G.Adj[u]:',
      '      RELAX(u, v, w):',
      '        if d[v] > d[u] + w(u, v):',
      '          d[v] = d[u] + w(u, v);  π[v] = u',
      '          DECREASE-KEY(Q, v, d[v])',
      '  return d, π',
    ],
    stepExplanation: [
      'Initialize: Set d[s]=0 and d[v]=∞ for all v ≠ s. Insert all vertices into Priority Queue Q.',
      'Extract-Min: Dequeue vertex u with smallest tentative distance.',
      'Finalize: Add u to finalized cloud S.',
      'Relaxation: For each neighbor v, if d[u] + w(u,v) < d[v], update d[v] and predecessor π[v].',
      'Repeat until Q is empty or destination is extracted.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|V| log |V| + |E|)',
      avg: 'O((|V| + |E|) log |V|)',
      worst: 'O((|V| + |E|) log |V|) with Binary Heap; O(|V|² + |E|) with Array',
      explanation: `EXTRACT-MIN is called |V| times taking O(|V| log |V|). DECREASE-KEY is called at most |E| times taking O(|E| log |V|). With a Fibonacci Heap, amortized DECREASE-KEY is O(1), bringing time to O(|E| + |V| log |V|).`,
    },
    spaceComplexity: 'O(|V| + |E|) for Adjacency List and Min-Priority Queue keys.',
    realWorldApplications: [
      'Turn-by-turn road navigation (Google Maps, Waze).',
      'OSPF and IS-IS interior gateway network routing protocols.',
      'High-speed optical fiber bandwidth reservation.',
    ],
    advantages: [
      'Proven mathematical optimality on graphs with non-negative edge weights.',
      'Efficient O((V + E) log V) scalability to millions of nodes.',
      'Computes full single-source shortest path tree in a single pass.',
    ],
    limitations: [
      'Fails on negative edge weights (w(u,v) < 0). Greedy finalization assumes distances cannot decrease once locked. Use Bellman-Ford instead.',
    ],
    vivaQuestions: [
      {
        question: 'Why does Dijkstra fail when negative edge weights exist?',
        answer: 'Dijkstra permanently locks a vertex into the finalized set S upon extraction from the priority queue, assuming no future relaxation can produce a shorter path. A negative edge explored later can violate this greedy invariant.',
      },
      {
        question: 'What is the time complexity of Dijkstra using a Fibonacci Heap?',
        answer: 'O(|E| + |V| log |V|), because decrease-key operations run in amortized O(1) time while extract-min runs in O(log |V|).',
      },
      {
        question: 'What data structure is used to implement Dijkstra efficiently?',
        answer: 'A Min-Priority Queue, typically backed by a binary min-heap, pairing heap, or Fibonacci heap.',
      },
      {
        question: 'How does Dijkstra differ from Prim algorithm?',
        answer: 'Dijkstra keys priority on accumulated distance from source d[u] + w(u,v), while Prim keys priority solely on the incident edge weight w(u,v) to the growing tree.',
      },
      {
        question: 'Can Dijkstra detect cycles?',
        answer: 'Dijkstra does not detect negative cycles (it loops indefinitely or gives incorrect output), but standard cycles with non-negative weights are handled correctly without looping.',
      },
    ],
  },
  {
    id: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    inventor: 'Richard Bellman & Lester Ford Jr.',
    year: '1958',
    paradigm: 'Dynamic Programming',
    tagline: 'Single-source shortest path supporting negative edge weights and negative cycle detection.',
    introduction: `Published by Richard Bellman and Lester Ford Jr. in 1958. It is famous for its use in distance-vector routing protocols such as the Routing Information Protocol (RIP).`,
    workingPrinciple: `Bellman-Ford relaxes all |E| edges repeatedly for |V|-1 iterations. A simple path in a graph contains at most |V|-1 edges, so after |V|-1 passes, all shortest paths must have stabilized. A final |V|-th pass checks if any edge can still be relaxed; if so, a negative-weight cycle is detected.`,
    invariant: `Pass Invariant: After pass k (1 ≤ k ≤ |V|-1), d[v] is at most the weight of any shortest path from source s to v that uses at most k edges.`,
    pseudocode: [
      'BELLMAN-FORD(G, w, s):',
      '  INITIALIZE-SINGLE-SOURCE(G, s)',
      '  for i = 1 to |G.V| - 1:',
      '    for each edge (u, v) ∈ G.E:',
      '      RELAX(u, v, w)',
      '  for each edge (u, v) ∈ G.E:',
      '    if d[v] > d[u] + w(u, v):',
      '      return FALSE // Negative-weight cycle detected!',
      '  return TRUE, d, π',
    ],
    stepExplanation: [
      'Initialize: Set d[s]=0 and d[v]=∞ for all other vertices.',
      'Relaxation Passes: Iterate i from 1 to |V|-1: for every edge (u, v), if d[u] + w(u,v) < d[v], update d[v].',
      'Negative Cycle Check: Perform one additional pass. If any d[u] + w(u,v) < d[v], a negative cycle exists.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|E|) [If distances converge in pass 1]',
      avg: 'O(|V| · |E|)',
      worst: 'O(|V| · |E|)',
      explanation: `There are |V|-1 outer loop iterations. In each iteration, all |E| edges are relaxed in O(|E|) time. Overall time is strictly O(|V| · |E|). In a dense graph (|E| ≈ |V|²), runtime is O(|V|³).`,
    },
    spaceComplexity: 'O(|V|) for the distance and parent arrays.',
    realWorldApplications: [
      'Routing Information Protocol (RIP) in early autonomous networks.',
      'Currency arbitrage detection in foreign exchange trading markets (converting rates via -log(rate)).',
      'Chemical reaction equilibrium path calculation.',
    ],
    advantages: [
      'Robustly handles graphs with negative edge weights.',
      'Mathematically detects and isolates negative-weight cycles.',
      'Conceptually straightforward and easily distributed across autonomous network nodes.',
    ],
    limitations: [
      'Significantly slower than Dijkstra: O(|V| · |E|) vs O((|V| + |E|) log |V|).',
    ],
    vivaQuestions: [
      {
        question: 'Why does Bellman-Ford iterate exactly |V|-1 times?',
        answer: 'A simple path in a graph with |V| vertices can contain at most |V|-1 edges without repeating vertices. Each relaxation pass guarantees computing shortest paths with one additional edge hop.',
      },
      {
        question: 'How does Bellman-Ford detect negative cycles?',
        answer: 'By running a |V|-th pass. Since all valid shortest paths require at most |V|-1 edges, if an edge distance can still decrease on the |V|-th pass, a cycle with net negative weight must exist.',
      },
      {
        question: 'How is Bellman-Ford used in currency arbitrage?',
        answer: 'Exchange rates r(i, j) are transformed into weights w(i, j) = -log(r(i, j)). A product of rates > 1 becomes a negative sum, which Bellman-Ford detects as a negative cycle.',
      },
      {
        question: 'Can Bellman-Ford be stopped early?',
        answer: 'Yes. If an entire pass completes without relaxing any edge, distances have converged and the algorithm terminates immediately.',
      },
    ],
  },
  {
    id: 'astar',
    title: 'A* Heuristic Search',
    inventor: 'Peter Hart, Nils Nilsson & Bertram Raphael',
    year: '1968',
    paradigm: 'Informed / Best-First Heuristic Search',
    tagline: 'Shortest path guided by heuristic estimates f(n) = g(n) + h(n).',
    introduction: `Formulated in 1968 at Stanford Research Institute for the Shakey the Robot project. A* extends Dijkstra by utilizing a heuristic function h(n) to orient the search toward the destination.`,
    workingPrinciple: `A* evaluates vertices using the evaluation function f(n) = g(n) + h(n), where g(n) is the exact known cost from source to n, and h(n) is an admissible heuristic estimate of the cost from n to target. When h(n) is admissible (never overestimates true cost) and consistent, A* is guaranteed to be optimal.`,
    invariant: `Admissibility Invariant: If h(n) ≤ h*(n) for all n, A* never overestimates remaining cost and always outputs an optimal shortest path.`,
    pseudocode: [
      'A-STAR(G, s, target, h):',
      '  openSet = {s}',
      '  gScore[s] = 0;  fScore[s] = h(s)',
      '  while openSet ≠ ∅:',
      '    current = node in openSet with lowest fScore',
      '    if current == target: return reconstruct_path()',
      '    for each neighbor v of current:',
      '      tentative_g = gScore[current] + weight(current, v)',
      '      if tentative_g < gScore[v]:',
      '        gScore[v] = tentative_g;  fScore[v] = tentative_g + h(v)',
      '        openSet.insert(v)',
    ],
    stepExplanation: [
      'Initialize openSet with source vertex, g[s]=0, f[s]=h[s].',
      'Extract vertex with minimum f(n) = g(n) + h(n).',
      'If current == target, path is found.',
      'Relax neighbors: if tentative_g < g[v], update g[v], compute f[v]=g[v]+h[v], add to openSet.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|E|) [With perfect heuristic]',
      avg: 'O((|V| + |E|) log |V|)',
      worst: 'O(|V|²)',
      explanation: `Depends on the quality of heuristic h. If h=0, A* degenerates into Dijkstra. If h is perfect (h=h*), A* traverses directly to the target in linear time without exploring irrelevant nodes.`,
    },
    spaceComplexity: 'O(|V|) to store openSet and closedSet.',
    realWorldApplications: [
      'Video game AI pathfinding (StarCraft, RPG navigation meshes).',
      'Robotics spatial trajectory planning.',
      'Google Maps travel time estimation.',
    ],
    advantages: [
      'Explores far fewer nodes than Dijkstra on spatial networks.',
      'Flexible: balancing g and h allows tuning between speed and optimality.',
    ],
    limitations: [
      'Requires a valid domain heuristic (e.g. Euclidean or Manhattan distance).',
      'High memory usage (stores entire search tree in memory).',
    ],
    vivaQuestions: [
      {
        question: 'What is an admissible heuristic?',
        answer: 'A heuristic h(n) is admissible if it never overestimates the true cost to reach the goal: h(n) ≤ h*(n) for all n.',
      },
      {
        question: 'What happens if h(n) = 0 for all nodes?',
        answer: 'A* becomes identical to Dijkstra algorithm, exploring nodes uniformly in all directions.',
      },
      {
        question: 'What is heuristic consistency (monotonicity)?',
        answer: 'Consistency requires h(u) ≤ w(u, v) + h(v) for every edge (u, v). If consistent, once a node is expanded its optimal path is guaranteed.',
      },
    ],
  },
  {
    id: 'bfs',
    title: 'Breadth First Search (BFS)',
    inventor: 'Konrad Zuse (1945) / E. F. Moore (1959)',
    year: '1959',
    paradigm: 'Level-Order Graph Traversal',
    tagline: 'Systematically discovers vertices level-by-level, minimizing hop counts.',
    introduction: `Formulated by Edward F. Moore in 1959. BFS explores the graph layer by layer, guaranteeing the minimum-hop path on unweighted graphs.`,
    workingPrinciple: `Uses a FIFO queue. Vertices are colored White (undiscovered), Gray (in queue), and Black (explored).`,
    invariant: `Queue Invariant: At all times, the queue contains vertices from at most two consecutive hop levels {k, k, ..., k+1}.`,
    pseudocode: [
      'BFS(G, s):',
      '  for each u ∈ G.V - {s}: color[u]=WHITE, d[u]=∞',
      '  color[s] = GRAY, d[s] = 0, Q = EMPTY_QUEUE()',
      '  ENQUEUE(Q, s)',
      '  while Q ≠ ∅:',
      '    u = DEQUEUE(Q)',
      '    for each v ∈ G.Adj[u]:',
      '      if color[v] == WHITE:',
      '        color[v] = GRAY; d[v] = d[u] + 1; π[v] = u',
      '        ENQUEUE(Q, v)',
      '    color[u] = BLACK',
    ],
    stepExplanation: [
      'Enqueue source s, set d[s]=0, color Gray.',
      'Dequeue front vertex u.',
      'For each undiscovered neighbor v: set d[v]=d[u]+1, π[v]=u, and enqueue.',
      'Repeat until queue is empty.',
    ],
    timeComplexityBreakdown: {
      best: 'O(1)',
      avg: 'O(|V| + |E|)',
      worst: 'O(|V| + |E|)',
      explanation: `Every vertex is enqueued once (O(|V|)) and its adjacency list scanned once (O(|E|)). Total time is strictly linear O(|V| + |E|).`,
    },
    spaceComplexity: 'O(|V|) for the FIFO queue and visited status.',
    realWorldApplications: [
      'BitTorrent neighbor peer discovery.',
      'Social network degrees of separation (LinkedIn 1st, 2nd connections).',
      'Bipartite graph 2-coloring verification.',
    ],
    advantages: [
      'Guaranteed minimal hop count.',
      'Optimal linear time O(|V| + |E|).',
    ],
    limitations: [
      'Ignores edge weights; unsuitable for road transit with varying travel times.',
    ],
    vivaQuestions: [
      {
        question: 'Why does BFS guarantee shortest paths only on unweighted graphs?',
        answer: 'BFS increments distance by 1 hop per level. It assumes all edges have equal cost, ignoring varying edge weights.',
      },
      {
        question: 'What is the maximum number of items in a BFS queue?',
        answer: 'At most the maximum width (maximum number of nodes at any single depth level) of the graph.',
      },
    ],
  },
  {
    id: 'dfs',
    title: 'Depth First Search (DFS)',
    inventor: 'Charles Pierre Trémaux',
    year: '1882',
    paradigm: 'Backtracking',
    tagline: 'Plunges as deep as possible along each branch before backtracking.',
    introduction: `Formalized by Robert Tarjan in 1972. DFS is the foundation for topological sorting, cycle detection, and strongly connected components.`,
    workingPrinciple: `Uses a LIFO recursion stack. When a dead-end is reached, it backtracks to explore remaining branches.`,
    invariant: `Parenthesis Theorem: Discovery and finish intervals [d[u], f[u]] are either completely disjoint or completely nested.`,
    pseudocode: [
      'DFS(G):',
      '  for each u ∈ G.V: color[u] = WHITE',
      '  DFS-VISIT(u):',
      '    color[u] = GRAY; d[u] = ++time',
      '    for each v ∈ G.Adj[u]:',
      '      if color[v] == WHITE: π[v] = u; DFS-VISIT(v)',
      '    color[u] = BLACK; f[u] = ++time',
    ],
    stepExplanation: [
      'Discover unvisited node, stamp discovery time.',
      'Recursively visit first unvisited neighbor.',
      'Backtrack when no unvisited neighbors remain, stamping finish time.',
    ],
    timeComplexityBreakdown: {
      best: 'O(1)',
      avg: 'O(|V| + |E|)',
      worst: 'O(|V| + |E|)',
      explanation: `Each vertex visited once, each edge examined once. Total time O(|V| + |E|).`,
    },
    spaceComplexity: 'O(|V|) for recursion stack depth.',
    realWorldApplications: [
      'Topological sort for build task scheduling (Makefiles).',
      'Cycle detection in operating system deadlock prevention.',
      'Tarjan strongly connected components algorithm.',
    ],
    advantages: [
      'Linear time, low memory proportional to tree depth.',
    ],
    limitations: [
      'Does not produce shortest paths.',
    ],
    vivaQuestions: [
      {
        question: 'How does DFS detect cycles in a directed graph?',
        answer: 'By checking for back edges: if an edge points to an ancestor vertex currently marked Gray (on the recursion stack), a cycle exists.',
      },
    ],
  },
  {
    id: 'prim',
    title: "Prim's Minimum Spanning Tree",
    inventor: 'Vojtěch Jarník / Robert C. Prim',
    year: '1957',
    paradigm: 'Greedy (Cut Property)',
    tagline: 'Grows a single spanning tree from a seed vertex by picking minimum crossing edges.',
    introduction: `Developed in 1930 by Vojtěch Jarník and rediscovered in 1957 by Robert C. Prim.`,
    workingPrinciple: `Maintains a single growing tree S. At each step, it chooses the minimum-weight edge crossing cut (S, V \\ S).`,
    invariant: `Cut Property: The lightest edge crossing any cut respecting MST subset A is safe for A.`,
    pseudocode: [
      'MST-PRIM(G, w, r):',
      '  for each u ∈ G.V: key[u] = ∞, π[u] = NIL',
      '  key[r] = 0, Q = G.V',
      '  while Q ≠ ∅:',
      '    u = EXTRACT-MIN(Q)',
      '    for each v ∈ G.Adj[u]:',
      '      if v ∈ Q and w(u, v) < key[v]: key[v] = w(u, v); π[v] = u',
    ],
    stepExplanation: [
      'Start at root r with key[r]=0.',
      'Extract min-key vertex u.',
      'Update adjacent keys across the cut.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|E| log |V|)',
      avg: 'O(|E| log |V|)',
      worst: 'O(|E| log |V|) [Fibonacci Heap: O(|E| + |V| log |V|)]',
      explanation: `O(|V| log |V|) for extractions, O(|E| log |V|) for key updates. Total O(|E| log |V|).`,
    },
    spaceComplexity: 'O(|V| + |E|)',
    realWorldApplications: [
      'Optical fiber and power grid cabling layout.',
      'Spanning Tree Protocol (STP) in Ethernet bridges.',
    ],
    advantages: [
      'Remains connected at every step; superior on dense graphs.',
    ],
    limitations: [
      'Requires priority queue overhead; slower than Kruskal on sparse graphs.',
    ],
    vivaQuestions: [
      {
        question: 'What is the Cut Property in MST?',
        answer: 'For any cut of a graph, the minimum-weight edge crossing the cut must belong to the Minimum Spanning Tree.',
      },
    ],
  },
  {
    id: 'kruskal',
    title: "Kruskal's Minimum Spanning Tree",
    inventor: 'Joseph Kruskal',
    year: '1956',
    paradigm: 'Greedy (Cycle Avoidance)',
    tagline: 'Sorts edges globally and merges disjoint trees using Disjoint Set Union (DSU).',
    introduction: `Published by Joseph Kruskal in 1956. Uses Disjoint Set Union (Union-Find) with path compression.`,
    workingPrinciple: `Sorts all edges. Iterates through sorted edges; if endpoints belong to different sets, adds edge and merges sets.`,
    invariant: `Acyclic Invariant: Selected edge set A contains no cycles at any step.`,
    pseudocode: [
      'MST-KRUSKAL(G, w):',
      '  A = ∅',
      '  for each v ∈ G.V: MAKE-SET(v)',
      '  sort edges G.E in ascending order of weight',
      '  for each edge (u, v) ∈ sorted edges:',
      '    if FIND-SET(u) ≠ FIND-SET(v): A = A ∪ {(u, v)}; UNION(u, v)',
      '  return A',
    ],
    stepExplanation: [
      'Initialize singleton sets for each vertex.',
      'Sort all edges in ascending order.',
      'For each edge: if roots differ, add to MST and union sets; else reject.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|E| log |E|)',
      avg: 'O(|E| log |E|) = O(|E| log |V|)',
      worst: 'O(|E| log |E|)',
      explanation: `Sorting edges dominates: O(|E| log |E|). DSU operations take O(|E| · α(|V|)). Total time is O(|E| log |E|).`,
    },
    spaceComplexity: 'O(|V| + |E|)',
    realWorldApplications: [
      'Telecommunications pipeline networks.',
      'Christofides TSP approximation algorithm.',
    ],
    advantages: [
      'Fast on sparse graphs; naturally produces Minimum Spanning Forest.',
    ],
    limitations: [
      'Sorting can be slow for very dense graphs.',
    ],
    vivaQuestions: [
      {
        question: 'What is the role of Path Compression in Union-Find?',
        answer: 'Path compression flattens the tree structure during find operations, pointing all visited nodes directly to the root, reducing amortized operation time to nearly O(1).',
      },
    ],
  },
  {
    id: 'floyd-warshall',
    title: 'Floyd-Warshall All-Pairs Shortest Path',
    inventor: 'Robert Floyd & Stephen Warshall',
    year: '1962',
    paradigm: 'Dynamic Programming',
    tagline: 'All-Pairs Shortest Path via triply-nested matrix recurrence.',
    introduction: `Published in 1962. It computes shortest paths between all pairs of vertices in O(|V|³) time.`,
    workingPrinciple: `Computes distance matrices D^(k)[i][j] = min(D^(k-1)[i][j], D^(k-1)[i][k] + D^(k-1)[k][j]) testing intermediate pivot vertex k.`,
    invariant: `DP Invariant: D^(k)[i][j] is the shortest path from i to j using only intermediate vertices from {1, ..., k}.`,
    pseudocode: [
      'FLOYD-WARSHALL(W):',
      '  n = W.rows; D^(0) = W',
      '  for k = 1 to n:',
      '    for i = 1 to n:',
      '      for j = 1 to n:',
      '        d^(k)[i][j] = min(d^(k-1)[i][j], d^(k-1)[i][k] + d^(k-1)[k][j])',
      '  return D^(n)',
    ],
    stepExplanation: [
      'Initialize base matrix D^(0) with direct edge weights and 0 on diagonal.',
      'Iterate intermediate pivot k from 1 to |V|.',
      'Update every pair (i, j) by testing through k.',
    ],
    timeComplexityBreakdown: {
      best: 'O(|V|³)',
      avg: 'O(|V|³)',
      worst: 'O(|V|³)',
      explanation: `Three nested loops from 1 to |V| each running in constant time: O(|V|³).`,
    },
    spaceComplexity: 'O(|V|²) for the distance matrix.',
    realWorldApplications: [
      'Transitive closure of graphs (Warshall algorithm).',
      'All-pairs network latency matrix computation.',
    ],
    advantages: [
      'Exceptionally simple 5-line implementation.',
      'Solves all pairs simultaneously and detects negative cycles on diagonal.',
    ],
    limitations: [
      'O(|V|³) cubic complexity is prohibitive for graphs with > 1000 vertices.',
    ],
    vivaQuestions: [
      {
        question: 'How does Floyd-Warshall detect negative cycles?',
        answer: 'If any diagonal entry D[i][i] becomes negative (< 0) during execution, a negative-weight cycle containing vertex i exists.',
      },
    ],
  },
];

export const LearningCenter: React.FC = () => {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>('dijkstra');
  const [expandedViva, setExpandedViva] = useState<number | null>(0);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);

  const guide = STUDY_GUIDES.find(g => g.id === activeAlgo) || STUDY_GUIDES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            DAA Academic Learning Center & Exam Preparation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full textbook curriculum: CLRS pseudocode, asymptotic proofs, and university viva exam questions.
          </p>
        </div>

        <button
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-semibold border border-blue-200 transition-colors"
        >
          <TableIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>{showCheatSheet ? 'Hide Cheat Sheet' : 'Algorithm Comparison Cheat Sheet'}</span>
        </button>
      </div>

      {/* Algorithm Cheat Sheet Modal / Expandable View */}
      {showCheatSheet && (
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm animate-in fade-in duration-150 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Comprehensive Algorithm Comparison Cheat Sheet
            </h3>
            <button
              onClick={() => setShowCheatSheet(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2 text-left">Algorithm</th>
                  <th className="px-3 py-2 text-left">Problem Solved</th>
                  <th className="px-3 py-2 text-left">Paradigm</th>
                  <th className="px-3 py-2 text-center font-mono">Time Complexity</th>
                  <th className="px-3 py-2 text-center font-mono">Space</th>
                  <th className="px-3 py-2 text-center">Negative Edges?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">Dijkstra</td>
                  <td className="px-3 py-2 text-slate-600">Single-Source Shortest Path</td>
                  <td className="px-3 py-2 font-medium text-emerald-700">Greedy</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O((V+E) log V)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V + E)</td>
                  <td className="px-3 py-2 text-center font-bold text-red-600">No (Rejects)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">Bellman-Ford</td>
                  <td className="px-3 py-2 text-slate-600">Single-Source (Negative Safe)</td>
                  <td className="px-3 py-2 font-medium text-purple-700">Dynamic Programming</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(V · E)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V)</td>
                  <td className="px-3 py-2 text-center font-bold text-emerald-600">Yes (Detects Cycles)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">A* Search</td>
                  <td className="px-3 py-2 text-slate-600">Heuristic Target Shortest Path</td>
                  <td className="px-3 py-2 font-medium text-blue-700">Informed Heuristic</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O((V+E) log V)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V)</td>
                  <td className="px-3 py-2 text-center font-bold text-red-600">No</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">BFS</td>
                  <td className="px-3 py-2 text-slate-600">Unweighted Min Hops</td>
                  <td className="px-3 py-2 font-medium text-sky-700">Level Traversal</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(V + E)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V)</td>
                  <td className="px-3 py-2 text-center text-slate-400">Ignores Weights</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">DFS</td>
                  <td className="px-3 py-2 text-slate-600">Depth / Cycles / Topological</td>
                  <td className="px-3 py-2 font-medium text-indigo-700">Backtracking</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(V + E)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V)</td>
                  <td className="px-3 py-2 text-center text-slate-400">Ignores Weights</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">Prim</td>
                  <td className="px-3 py-2 text-slate-600">Minimum Spanning Tree</td>
                  <td className="px-3 py-2 font-medium text-emerald-700">Greedy (Cut)</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(E log V)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V + E)</td>
                  <td className="px-3 py-2 text-center text-emerald-600">Yes</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">Kruskal</td>
                  <td className="px-3 py-2 text-slate-600">Minimum Spanning Tree</td>
                  <td className="px-3 py-2 font-medium text-emerald-700">Greedy (Cycle Check)</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(E log E)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V + E)</td>
                  <td className="px-3 py-2 text-center text-emerald-600">Yes</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-900">Floyd-Warshall</td>
                  <td className="px-3 py-2 text-slate-600">All-Pairs Shortest Path</td>
                  <td className="px-3 py-2 font-medium text-purple-700">Dynamic Programming</td>
                  <td className="px-3 py-2 text-center font-mono text-blue-700">O(V³)</td>
                  <td className="px-3 py-2 text-center font-mono">O(V²)</td>
                  <td className="px-3 py-2 text-center text-emerald-600">Yes (Diagonal Check)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Algorithm Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 border border-slate-200 rounded-lg shadow-2xs">
        {STUDY_GUIDES.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveAlgo(item.id); setExpandedViva(0); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeAlgo === item.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Main Guide Content */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
        {/* Header Block */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {guide.paradigm}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Originated by <strong>{guide.inventor}</strong> ({guide.year})
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{guide.title}</h3>
          <p className="text-xs text-slate-600 mt-1 italic">{guide.tagline}</p>
        </div>

        {/* 2-Column: Introduction & Working Principle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              1. Historical Context & Introduction
            </h4>
            <p className="leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200">
              {guide.introduction}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              2. Core Working Principle & Invariant
            </h4>
            <div className="leading-relaxed bg-emerald-50/40 p-3 rounded-md border border-emerald-200 space-y-2">
              <p>{guide.workingPrinciple}</p>
              <div className="p-2 bg-white rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">
                <strong>Invariant:</strong> {guide.invariant}
              </div>
            </div>
          </div>
        </div>

        {/* Pseudocode Block */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-700" />
            3. Formal Textbook Pseudocode (CLRS Standard)
          </h4>
          <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
            {guide.pseudocode.map((line, idx) => (
              <div key={idx} className="hover:bg-slate-800/80 px-2 py-0.5 rounded">
                <span className="text-slate-500 select-none mr-3 inline-block w-5 text-right">{idx + 1}</span>
                <span className={line.includes('//') ? 'text-slate-400 italic' : line.includes('while') || line.includes('for') || line.includes('if') ? 'text-blue-300 font-semibold' : 'text-slate-200'}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Asymptotic Complexity */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            4. Asymptotic Time & Space Complexity Analysis
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Best Case</span>
              <span className="font-mono font-bold text-emerald-700">{guide.timeComplexityBreakdown.best}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Average Case</span>
              <span className="font-mono font-bold text-blue-700">{guide.timeComplexityBreakdown.avg}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Worst Case</span>
              <span className="font-mono font-bold text-rose-700">{guide.timeComplexityBreakdown.worst}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Auxiliary Space</span>
              <span className="font-mono font-bold text-purple-700">{guide.spaceComplexity}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong>Proof Sketch:</strong> {guide.timeComplexityBreakdown.explanation}
          </p>
        </div>

        {/* Real-World Applications */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            5. Real-World Engineering Applications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {guide.realWorldApplications.map((app, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded bg-blue-50/40 border border-blue-100 text-slate-800">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* University Viva Questions Accordion */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            6. University DAA Viva Voce Questions & Answers
          </h4>
          <div className="space-y-2">
            {guide.vivaQuestions.map((viva, idx) => {
              const isOpen = expandedViva === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-md overflow-hidden text-xs">
                  <button
                    onClick={() => setExpandedViva(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>Q{idx + 1}: {viva.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-700 leading-relaxed font-sans">
                      <strong className="text-purple-700 block mb-0.5">Answer:</strong>
                      {viva.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
