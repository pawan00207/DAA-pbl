/**
 * @file /src/components/RouteComparison.tsx
 * @description Route Comparison module comparing Dijkstra vs BFS vs DFS, plus Prim vs Kruskal MST comparison,
 * operation metrics, best result badges, and visual topology overlays.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState } from 'react';
import { GraphData, AlgorithmResult } from '../types/graph';
import { runDijkstra } from '../algorithms/dijkstra';
import { runBFS } from '../algorithms/bfs';
import { runDFS } from '../algorithms/dfs';
import { runAStar } from '../algorithms/aStar';
import { runBellmanFord } from '../algorithms/bellmanFord';
import { runPrim } from '../algorithms/prim';
import { runKruskal } from '../algorithms/kruskal';
import { GraphCanvas } from './GraphCanvas';
import {
  GitCompare,
  ArrowRight,
  Info,
  CheckCircle,
  Network,
  Sparkles,
  Layers,
  TrendingDown,
} from 'lucide-react';

interface RouteComparisonProps {
  graph: GraphData;
  sourceNodeId: string;
  targetNodeId: string;
  onSelectSource: (id: string) => void;
  onSelectTarget: (id: string) => void;
  onUpdateGraph: (updated: GraphData) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  graph,
  sourceNodeId,
  targetNodeId,
  onSelectSource,
  onSelectTarget,
  onUpdateGraph,
}) => {
  const [comparisonMode, setComparisonMode] = useState<'pathfinding' | 'mst'>('pathfinding');
  const [activeHighlightAlgo, setActiveHighlightAlgo] = useState<'all' | 'dijkstra' | 'bfs' | 'dfs' | 'astar' | 'bellman-ford'>('all');

  // Run pathfinding algorithms
  const dijkstraRes = runDijkstra(graph, sourceNodeId, targetNodeId);
  const bfsRes = runBFS(graph, sourceNodeId, targetNodeId);
  const dfsRes = runDFS(graph, sourceNodeId, targetNodeId);
  const aStarRes = runAStar(graph, sourceNodeId, targetNodeId);
  const bellmanFordRes = runBellmanFord(graph, sourceNodeId, targetNodeId);

  // Run MST algorithms
  const primRes = runPrim(graph, sourceNodeId);
  const kruskalRes = runKruskal(graph);

  // Selected edges for pathfinding overlay
  let highlightedEdges: string[] = [];
  if (comparisonMode === 'pathfinding') {
    if (activeHighlightAlgo === 'dijkstra') highlightedEdges = dijkstraRes.pathEdges || [];
    else if (activeHighlightAlgo === 'bfs') highlightedEdges = bfsRes.pathEdges || [];
    else if (activeHighlightAlgo === 'dfs') highlightedEdges = dfsRes.pathEdges || [];
    else if (activeHighlightAlgo === 'astar') highlightedEdges = aStarRes.pathEdges || [];
    else if (activeHighlightAlgo === 'bellman-ford') highlightedEdges = bellmanFordRes.pathEdges || [];
    else {
      highlightedEdges = Array.from(
        new Set([
          ...(dijkstraRes.pathEdges || []),
          ...(bfsRes.pathEdges || []),
          ...(dfsRes.pathEdges || []),
        ])
      );
    }
  } else {
    // MST mode edges
    highlightedEdges = primRes.pathEdges || kruskalRes.pathEdges || [];
  }

  const dijkstraPathStr = dijkstraRes.path ? dijkstraRes.path.join(' → ') : 'None';
  const bfsPathStr = bfsRes.path ? bfsRes.path.join(' → ') : 'None';
  const dfsPathStr = dfsRes.path ? dfsRes.path.join(' → ') : 'None';
  const aStarPathStr = aStarRes.path ? aStarRes.path.join(' → ') : 'None';
  const bfPathStr = bellmanFordRes.path ? bellmanFordRes.path.join(' → ') : 'None';

  const pathsDiffer = dijkstraRes.success && bfsRes.success && dijkstraPathStr !== bfsPathStr;

  return (
    <div className="space-y-6">
      {/* Mode Switcher Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-600" />
            Algorithm Comparison Suite
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare pathfinding optimizations and Minimum Spanning Tree strategies on the identical graph instance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setComparisonMode('pathfinding')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                comparisonMode === 'pathfinding'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shortest Path Comparison
            </button>
            <button
              onClick={() => setComparisonMode('mst')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                comparisonMode === 'mst'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prim vs Kruskal (MST)
            </button>
          </div>
        </div>
      </div>

      {/* Pathfinding Mode */}
      {comparisonMode === 'pathfinding' && (
        <div className="space-y-4">
          {/* Terminals selector */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-700">Source:</span>
              <select
                value={sourceNodeId}
                onChange={e => onSelectSource(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900"
              >
                {graph.nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="font-semibold text-slate-700">Destination:</span>
              <select
                value={targetNodeId}
                onChange={e => onSelectTarget(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-900"
              >
                {graph.nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DAA Mathematical Insight Box */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 text-xs text-slate-800 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <h4 className="font-bold text-xs text-blue-900">
                DAA Core Principle: Why Weighted Shortest Path Differs from Unweighted Hop Traversal
              </h4>
            </div>
            <div className="leading-relaxed space-y-1.5 text-slate-700">
              <p>
                <strong>BFS</strong> assumes uniform unit edge costs and minimizes total edge hops ($k$). In contrast,{' '}
                <strong>Dijkstra</strong> minimizes the arithmetic sum of weights $\sum w(e)$. When edge weights vary, a path with <em>more hops</em> can have a substantially <em>lower total weight</em> than a path with fewer hops!
              </p>
              {pathsDiffer && (
                <div className="p-2.5 bg-white rounded border border-blue-200 text-blue-950 font-medium">
                  Observed divergence: BFS chose <strong className="text-blue-700">{bfsRes.hopCount} hops</strong> with cost{' '}
                  <strong className="text-blue-700">{bfsRes.totalCost}</strong>, while Dijkstra found{' '}
                  <strong className="text-emerald-700">{dijkstraRes.hopCount} hops</strong> with lower cost{' '}
                  <strong className="text-emerald-700">{dijkstraRes.totalCost}</strong>!
                </div>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Pathfinding Performance Matrix</h3>
              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'dijkstra', 'bfs', 'dfs', 'astar', 'bellman-ford'] as const).map(algo => (
                  <button
                    key={algo}
                    onClick={() => setActiveHighlightAlgo(algo)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition-colors ${
                      activeHighlightAlgo === algo
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Algorithm</th>
                    <th className="px-3 py-2.5 text-left">Data Structure</th>
                    <th className="px-3 py-2.5 text-center">Path Found</th>
                    <th className="px-3 py-2.5 text-right font-mono">Weighted Cost</th>
                    <th className="px-3 py-2.5 text-right font-mono">Hops</th>
                    <th className="px-3 py-2.5 text-right font-mono">Visited</th>
                    <th className="px-3 py-2.5 text-right font-mono">Operations</th>
                    <th className="px-3 py-2.5 text-right font-mono">Time (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Dijkstra */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      Dijkstra
                      {dijkstraRes.success && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          Optimal Cost
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">Min-Priority Queue</td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-700">{dijkstraPathStr}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-emerald-700">
                      {dijkstraRes.totalCost ?? 'N/A'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right">{dijkstraRes.hopCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right">{dijkstraRes.nodesVisitedCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">
                      {dijkstraRes.operations.relaxations + dijkstraRes.operations.comparisons}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">{dijkstraRes.executionTimeMs}</td>
                  </tr>

                  {/* A* Search */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      A* Search
                      {aStarRes.success && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                          Heuristic Guided
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">Priority Queue (f=g+h)</td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-700">{aStarPathStr}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-blue-700">
                      {aStarRes.totalCost ?? 'N/A'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right">{aStarRes.hopCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-semibold text-blue-700">
                      {aStarRes.nodesVisitedCount}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">
                      {aStarRes.operations.relaxations + aStarRes.operations.comparisons}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">{aStarRes.executionTimeMs}</td>
                  </tr>

                  {/* BFS */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      BFS
                      {bfsRes.success && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-semibold">
                          Min Hops
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">FIFO Queue</td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-700">{bfsPathStr}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-slate-800">
                      {bfsRes.totalCost ?? 'N/A'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-sky-700">{bfsRes.hopCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right">{bfsRes.nodesVisitedCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">
                      {bfsRes.operations.relaxations + bfsRes.operations.comparisons}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">{bfsRes.executionTimeMs}</td>
                  </tr>

                  {/* Bellman-Ford */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      Bellman-Ford
                      <span className="ml-1.5 px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold">
                        Negative Safe
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">Edge List Passes</td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-700">{bfPathStr}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-slate-800">
                      {bellmanFordRes.totalCost ?? 'N/A'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right">{bellmanFordRes.hopCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right">{bellmanFordRes.nodesVisitedCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">
                      {bellmanFordRes.operations.relaxations + bellmanFordRes.operations.comparisons}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">{bellmanFordRes.executionTimeMs}</td>
                  </tr>

                  {/* DFS */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">DFS</td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">LIFO Stack</td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-700">{dfsPathStr}</td>
                    <td className="px-3 py-2.5 font-mono text-right font-bold text-slate-800">
                      {dfsRes.totalCost ?? 'N/A'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right">{dfsRes.hopCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right">{dfsRes.nodesVisitedCount}</td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">
                      {dfsRes.operations.relaxations + dfsRes.operations.comparisons}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-600">{dfsRes.executionTimeMs}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Prim vs Kruskal Mode */}
      {comparisonMode === 'mst' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 text-xs text-slate-800 space-y-2 shadow-2xs">
            <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              DAA Minimum Spanning Tree Strategy: Prim vs. Kruskal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-slate-700 leading-relaxed">
              <div className="bg-white p-3 rounded border border-emerald-200">
                <strong className="text-emerald-900 block mb-1">Prim's Algorithm (Cut Property)</strong>
                Grows a single contiguous tree from a seed vertex. Best for <strong>dense graphs</strong> ($|E| \approx |V|^2$) because edge relaxation with a priority queue or matrix takes $O(|V|^2)$ or $O(|E| \log |V|)$.
              </div>
              <div className="bg-white p-3 rounded border border-emerald-200">
                <strong className="text-emerald-900 block mb-1">Kruskal's Algorithm (Cycle Avoidance)</strong>
                Sorts edges globally and merges disjoint tree components using Disjoint Set Union (DSU). Best for <strong>sparse graphs</strong> ($|E| \approx |V|$) with runtime $O(|E| \log |E|)$.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Prim Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Prim's MST</h3>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  Cut-Greedy
                </span>
              </div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Total MST Cost:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">{primRes.totalCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Edges in Tree / Forest:</span>
                  <span className="font-semibold">{primRes.pathEdges?.length} edges</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Execution Steps:</span>
                  <span>{primRes.steps.length} steps</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Queue Operations:</span>
                  <span>{primRes.operations.queueOps}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Comparisons:</span>
                  <span>{primRes.operations.comparisons}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Measured Runtime:</span>
                  <span>{primRes.executionTimeMs} ms</span>
                </div>
              </div>
            </div>

            {/* Kruskal Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Kruskal's MST</h3>
                <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                  DSU-Greedy
                </span>
              </div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Total MST Cost:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">{kruskalRes.totalCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Edges in Tree / Forest:</span>
                  <span className="font-semibold">{kruskalRes.pathEdges?.length} edges</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Execution Steps:</span>
                  <span>{kruskalRes.steps.length} steps</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">DSU Find/Union Calls:</span>
                  <span>{kruskalRes.operations.dsuOps}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Comparisons (Sorting+Cycles):</span>
                  <span>{kruskalRes.operations.comparisons}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 font-sans">
                  <span className="text-slate-500">Measured Runtime:</span>
                  <span>{kruskalRes.executionTimeMs} ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Canvas Overlay */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Topology Route Overlay ({comparisonMode === 'pathfinding' ? activeHighlightAlgo.toUpperCase() : 'MST'} Highlight)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Highlighted: {highlightedEdges.length} edges
          </span>
        </div>
        <GraphCanvas
          graph={graph}
          onUpdateGraph={onUpdateGraph}
          sourceNodeId={sourceNodeId}
          targetNodeId={targetNodeId}
          selectedEdgeIds={highlightedEdges}
          readOnly={true}
          height={380}
        />
      </div>
    </div>
  );
};
