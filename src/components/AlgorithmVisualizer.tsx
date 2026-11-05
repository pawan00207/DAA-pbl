/**
 * @file /src/components/AlgorithmVisualizer.tsx
 * @description State-of-the-art Algorithm Visualizer featuring step playback,
 * prominent telemetry stats strip, live pseudocode line highlighting,
 * distance relaxation tables (with f=g+h for A*), and live data structure inspectors.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState, useEffect, useRef } from 'react';
import { GraphData, AlgorithmType, AlgorithmResult, SimulationRecord } from '../types/graph';
import { GraphCanvas } from './GraphCanvas';
import { runDijkstra } from '../algorithms/dijkstra';
import { runBFS } from '../algorithms/bfs';
import { runDFS } from '../algorithms/dfs';
import { runPrim } from '../algorithms/prim';
import { runKruskal } from '../algorithms/kruskal';
import { runBellmanFord } from '../algorithms/bellmanFord';
import { runAStar } from '../algorithms/aStar';
import { runFloydWarshall } from '../algorithms/floydWarshall';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Code,
  Layers,
  Table as TableIcon,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Cpu,
  CornerDownRight,
} from 'lucide-react';

interface AlgorithmVisualizerProps {
  graph: GraphData;
  onUpdateGraph: (updated: GraphData) => void;
  sourceNodeId: string;
  targetNodeId: string;
  onSelectSource: (id: string) => void;
  onSelectTarget: (id: string) => void;
  onRecordSimulation: (record: SimulationRecord) => void;
}

export const PSEUDOCODE_MAPPINGS: Record<AlgorithmType, string[]> = {
  dijkstra: [
    'DIJKSTRA(G, w, s):',
    '  INITIALIZE-SINGLE-SOURCE(G, s)',
    '  S = ∅  // Set of finalized vertices',
    '  Q = G.V  // Min-Priority Queue keyed on d[v]',
    '  while Q is not empty:',
    '    u = EXTRACT-MIN(Q)',
    '    S = S ∪ {u}',
    '    for each vertex v in G.Adj[u]:',
    '      if d[v] > d[u] + w(u, v):',
    '        d[v] = d[u] + w(u, v);  π[v] = u',
    '  return d, π',
  ],
  'bellman-ford': [
    'BELLMAN-FORD(G, w, s):',
    '  INITIALIZE-SINGLE-SOURCE(G, s)',
    '  for i = 1 to |G.V| - 1:',
    '    for each edge (u, v) in G.E:',
    '      RELAX(u, v, w)',
    '  for each edge (u, v) in G.E:',
    '    if d[v] > d[u] + w(u, v): return FALSE // Negative Cycle!',
    '  return TRUE, d, π',
  ],
  astar: [
    'A-STAR-SEARCH(G, s, target, h):',
    '  openSet = {s}; gScore[s] = 0; fScore[s] = h(s)',
    '  while openSet is not empty:',
    '    current = node in openSet with lowest fScore',
    '    if current == target: return reconstruct_path()',
    '    for each neighbor v of current:',
    '      tentative_g = gScore[current] + weight(current, v)',
    '      if tentative_g < gScore[v]: g[v] = tentative_g; f[v] = g[v] + h(v)',
  ],
  bfs: [
    'BFS(G, s):',
    '  for each u in G.V - {s}: color[u] = WHITE, d[u] = ∞',
    '  color[s] = GRAY, d[s] = 0, Q = EMPTY_QUEUE()',
    '  ENQUEUE(Q, s)',
    '  while Q is not empty:',
    '    u = DEQUEUE(Q)',
    '    for each v in G.Adj[u]:',
    '      if color[v] == WHITE: color=GRAY, d[v]=d[u]+1, ENQUEUE(Q, v)',
    '  return d, π',
  ],
  dfs: [
    'DFS(G):',
    '  for each u in G.V: color[u] = WHITE',
    '  DFS-VISIT(G, u):',
    '    color[u] = GRAY; time = time + 1',
    '    for each v in G.Adj[u]:',
    '      if color[v] == WHITE: DFS-VISIT(G, v)',
    '    color[u] = BLACK; f[u] = time + 1',
  ],
  prim: [
    'MST-PRIM(G, w, r):',
    '  for each u in G.V: key[u] = ∞, π[u] = NIL',
    '  key[r] = 0, Q = G.V',
    '  while Q is not empty:',
    '    u = EXTRACT-MIN(Q)',
    '    for each v in G.Adj[u]:',
    '      if v ∈ Q and w(u, v) < key[v]: key[v] = w(u, v), π[v] = u',
    '  return π',
  ],
  kruskal: [
    'MST-KRUSKAL(G, w):',
    '  A = ∅',
    '  for each vertex v in G.V: MAKE-SET(v)',
    '  sort edges G.E in non-decreasing order of weight',
    '  for each edge (u, v) in sorted G.E:',
    '    if FIND-SET(u) ≠ FIND-SET(v): A = A ∪ {(u, v)}; UNION(u, v)',
    '  return A',
  ],
  'floyd-warshall': [
    'FLOYD-WARSHALL(W):',
    '  D^(0) = W',
    '  for k = 1 to n:',
    '    for i = 1 to n:',
    '      for j = 1 to n:',
    '        d^(k)[i][j] = min(d^(k-1)[i][j], d^(k-1)[i][k] + d^(k-1)[k][j])',
    '  return D^(n)',
  ],
};

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  graph,
  onUpdateGraph,
  sourceNodeId,
  targetNodeId,
  onSelectSource,
  onSelectTarget,
  onRecordSimulation,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('dijkstra');
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'narrative' | 'datastructure' | 'table' | 'pseudocode'>('narrative');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Execute algorithm
  const executeAlgorithm = (algo: AlgorithmType = selectedAlgo) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let res: AlgorithmResult;

    if (algo === 'dijkstra') {
      res = runDijkstra(graph, sourceNodeId, targetNodeId);
    } else if (algo === 'bellman-ford') {
      res = runBellmanFord(graph, sourceNodeId, targetNodeId);
    } else if (algo === 'astar') {
      res = runAStar(graph, sourceNodeId, targetNodeId);
    } else if (algo === 'bfs') {
      res = runBFS(graph, sourceNodeId, targetNodeId);
    } else if (algo === 'dfs') {
      res = runDFS(graph, sourceNodeId, targetNodeId);
    } else if (algo === 'prim') {
      res = runPrim(graph, sourceNodeId);
    } else if (algo === 'kruskal') {
      res = runKruskal(graph);
    } else {
      res = runFloydWarshall(graph);
    }

    setResult(res);
    setCurrentStepIndex(0);

    if (res.steps.length > 0) {
      onRecordSimulation({
        id: `sim_${Date.now()}`,
        timestamp: Date.now(),
        algorithm: algo,
        graphName: graph.name,
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        isDirected: graph.isDirected,
        sourceNode: algo === 'prim' || algo === 'kruskal' || algo === 'floyd-warshall' ? undefined : sourceNodeId,
        targetNode: algo === 'prim' || algo === 'kruskal' || algo === 'floyd-warshall' ? undefined : targetNodeId,
        success: res.success,
        totalCost: res.totalCost,
        hopCount: res.hopCount,
        executionTimeMs: res.executionTimeMs,
        message: res.message,
        operations: res.operations,
      });
    }
  };

  useEffect(() => {
    executeAlgorithm(selectedAlgo);
  }, [graph, sourceNodeId, targetNodeId, selectedAlgo]);

  // Playback timer
  useEffect(() => {
    if (isPlaying && result && result.steps.length > 0) {
      const intervalMs = Math.max(120, Math.round(850 / playbackSpeed));
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < result.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, result, playbackSpeed]);

  // Global Keyboard listener for visualizer controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result]);

  const handleNextStep = () => {
    if (!result) return;
    setIsPlaying(false);
    if (currentStepIndex < result.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleJumpToEnd = () => {
    if (!result) return;
    setIsPlaying(false);
    setCurrentStepIndex(result.steps.length - 1);
  };

  const currentStep = result?.steps[currentStepIndex];
  const isFinalStep = result && currentStepIndex === result.steps.length - 1;
  const isPathfinding = selectedAlgo === 'dijkstra' || selectedAlgo === 'bellman-ford' || selectedAlgo === 'astar' || selectedAlgo === 'bfs' || selectedAlgo === 'dfs';

  const algorithmsList = [
    { id: 'dijkstra', label: "Dijkstra's Path", tag: 'Greedy' },
    { id: 'bellman-ford', label: 'Bellman-Ford', tag: 'Neg-Weights' },
    { id: 'astar', label: 'A* Search', tag: 'Heuristic' },
    { id: 'bfs', label: 'Breadth First (BFS)', tag: 'Min-Hops' },
    { id: 'dfs', label: 'Depth First (DFS)', tag: 'Stack' },
    { id: 'prim', label: "Prim's MST", tag: 'Cut' },
    { id: 'kruskal', label: "Kruskal's MST", tag: 'DSU' },
    { id: 'floyd-warshall', label: 'Floyd-Warshall', tag: 'All-Pairs' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Algorithm Selection Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {algorithmsList.map(algo => {
              const isSelected = selectedAlgo === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgo(algo.id as AlgorithmType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{algo.label}</span>
                  <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                    {algo.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Source / Target selectors for pathfinding */}
          {isPathfinding && (
            <div className="flex items-center gap-2 text-xs bg-slate-50 p-1.5 rounded-md border border-slate-200">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">From:</span>
                <select
                  value={sourceNodeId}
                  onChange={e => onSelectSource(e.target.value)}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-800"
                >
                  {graph.nodes.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-slate-400">→</span>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 font-medium">To:</span>
                <select
                  value={targetNodeId}
                  onChange={e => onSelectTarget(e.target.value)}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-800"
                >
                  {graph.nodes.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Stats Strip Above Canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Node</span>
          <span className="font-mono font-bold text-amber-600 text-sm">
            {currentStep?.currentNode || 'None / Global'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Visited Count</span>
          <span className="font-mono font-bold text-blue-700 text-sm">
            {currentStep?.visitedNodes.length || 0} / {graph.nodes.length}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {isPathfinding ? 'Path Cost' : selectedAlgo === 'floyd-warshall' ? 'Matrix Updates' : 'MST Weight'}
          </span>
          <span className="font-mono font-bold text-emerald-700 text-sm">
            {currentStep?.currentTotalCost !== undefined ? currentStep.currentTotalCost : '—'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Relaxations</span>
          <span className="font-mono font-bold text-slate-800 text-sm">
            {currentStep?.operationsSoFar?.relaxations ?? result?.operations.relaxations ?? 0}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Comparisons</span>
          <span className="font-mono font-bold text-purple-700 text-sm">
            {currentStep?.operationsSoFar?.comparisons ?? result?.operations.comparisons ?? 0}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Step Execution</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {currentStepIndex + 1} / {result?.steps.length || 1}
          </span>
        </div>
      </div>

      {/* Negative Weight Rejection Banner with One-Click Switch to Bellman-Ford */}
      {result && !result.success && selectedAlgo === 'dijkstra' && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 max-w-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-red-800">Dijkstra Precondition Failure: Negative Weights Detected</strong>
              <p className="mt-0.5 leading-snug">{result.message}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAlgo('bellman-ford')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Run Bellman-Ford Instead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Visualizer Canvas & Right Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Canvas & Playback Control Bar */}
        <div className="lg:col-span-8 space-y-3">
          <GraphCanvas
            graph={graph}
            onUpdateGraph={onUpdateGraph}
            sourceNodeId={sourceNodeId}
            targetNodeId={targetNodeId}
            onSelectSource={onSelectSource}
            onSelectTarget={onSelectTarget}
            currentNodeId={currentStep?.currentNode}
            visitedNodeIds={currentStep?.visitedNodes}
            frontierNodeIds={currentStep?.frontierNodes}
            pathNodeIds={isFinalStep && result?.path ? result.path : currentStep?.visitedNodes || []}
            selectedEdgeIds={isFinalStep && result?.pathEdges ? result.pathEdges : currentStep?.selectedEdges || []}
            currentEdgeId={currentStep?.currentEdge}
            rejectedEdgeIds={currentStep?.rejectedEdges || []}
            height={560}
          />

          {/* Pinned Playback Toolbar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Transport Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleRestart}
                  title="Restart (R)"
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  title="Previous Step (←)"
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous Step"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Pause (Space)' : 'Play Step-by-Step (Space)'}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors"
                  aria-label="Play or Pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!result || currentStepIndex >= result.steps.length - 1}
                  title="Next Step (→)"
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next Step"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleJumpToEnd}
                  title="Jump to Final Output"
                  className="text-xs text-slate-600 hover:text-blue-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
                >
                  Finish
                </button>
              </div>

              {/* Scrubber Slider */}
              <div className="flex-1 max-w-xs flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                  {currentStepIndex + 1}/{result?.steps.length || 1}
                </span>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, (result?.steps.length || 1) - 1)}
                  value={currentStepIndex}
                  onChange={e => {
                    setIsPlaying(false);
                    setCurrentStepIndex(Number(e.target.value));
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                  aria-label="Step scrubber slider"
                />
              </div>

              {/* Speed Segmented Control */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                {[0.5, 1, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                      playbackSpeed === speed ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: 4-Tab Inspection Panel (Narrative | Data Structure | Distance Table | Pseudocode) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs flex flex-col min-h-[620px]">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
            <button
              onClick={() => setActiveTab('narrative')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                activeTab === 'narrative'
                  ? 'border-blue-600 text-blue-700 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Narrative
            </button>
            <button
              onClick={() => setActiveTab('datastructure')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                activeTab === 'datastructure'
                  ? 'border-blue-600 text-blue-700 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Structure
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                activeTab === 'table'
                  ? 'border-blue-600 text-blue-700 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Distance Table
            </button>
            <button
              onClick={() => setActiveTab('pseudocode')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                activeTab === 'pseudocode'
                  ? 'border-blue-600 text-blue-700 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Pseudocode
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Tab 1: Narrative */}
            {activeTab === 'narrative' && currentStep && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      STEP {currentStep.stepNumber}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{currentStep.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200 font-sans">
                    {currentStep.description}
                  </p>
                </div>

                {/* State Snapshot */}
                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Invariant State
                  </h5>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Active Pivot/Vertex:</span>
                      <span className="font-bold text-amber-600">
                        {currentStep.currentNode || 'None / Global'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Active Edge:</span>
                      <span className="font-bold text-blue-600">
                        {currentStep.currentEdge || 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px]">
                    <span className="text-slate-400 block text-[10px] font-sans">Finalized / Visited Set S:</span>
                    <span className="font-mono text-slate-700">
                      {'{'} {currentStep.visitedNodes.join(', ') || '∅'} {'}'}
                    </span>
                  </div>
                </div>

                {/* Completion summary */}
                {isFinalStep && result && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Execution Finished
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">{result.message}</p>
                    <div className="font-mono text-[10px] text-emerald-700 pt-1">
                      Time: {result.executionTimeMs} ms | Visited: {result.nodesVisitedCount}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Data Structure */}
            {activeTab === 'datastructure' && currentStep && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Structure: <strong className="text-blue-600 font-mono">{currentStep.dataStructureType}</strong>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentStep.dataStructureItems.length} items
                  </span>
                </div>

                {/* Floyd-Warshall 2D Matrix display */}
                {selectedAlgo === 'floyd-warshall' && currentStep.matrixSnapshot ? (
                  <div className="space-y-2 overflow-x-auto">
                    <div className="text-[11px] text-slate-500 font-sans">
                      Pivot k: <strong className="text-blue-600">{currentStep.matrixKVertex || 'Base D^(0)'}</strong>
                    </div>
                    <table className="min-w-full border border-slate-200 text-[10px] font-mono text-center">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-1 border border-slate-200 text-slate-500">i\j</th>
                          {graph.nodes.map(n => (
                            <th key={n.id} className="p-1 border border-slate-200 text-slate-700">
                              {n.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentStep.matrixSnapshot.map((row, rIdx) => (
                          <tr key={rIdx}>
                            <td className="p-1 font-bold bg-slate-50 border border-slate-200 text-slate-700">
                              {graph.nodes[rIdx]?.label || rIdx}
                            </td>
                            {row.map((cell, cIdx) => {
                              const isChanged = currentStep.matrixChangedCells?.some(
                                c => c.row === rIdx && c.col === cIdx
                              );
                              return (
                                <td
                                  key={cIdx}
                                  className={`p-1 border border-slate-200 ${
                                    isChanged ? 'bg-amber-100 text-amber-900 font-bold' : cell !== null ? 'text-slate-800' : 'text-slate-300'
                                  }`}
                                >
                                  {cell !== null ? cell : '∞'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {currentStep.dataStructureItems.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Structure is currently empty.
                      </div>
                    ) : (
                      currentStep.dataStructureItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs font-mono"
                        >
                          <span className="font-bold text-slate-800">{item.label}</span>
                          <span className="text-blue-700 font-semibold">{item.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* DSU Sets for Kruskal */}
                {selectedAlgo === 'kruskal' && currentStep.dsuSets && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <h5 className="font-semibold text-slate-800 text-[11px]">
                      DSU Disjoint Sets (Root Representatives)
                    </h5>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {Object.entries(currentStep.dsuSets).map(([node, root]) => (
                        <div
                          key={node}
                          className={`p-1.5 rounded border text-[11px] ${
                            node === root ? 'bg-blue-50 border-blue-200 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{node}</span>
                          <span className="text-slate-400"> → </span>
                          <span className="text-blue-700">{root}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Distance Table */}
            {activeTab === 'table' && currentStep && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 font-sans">
                  Dynamic distance estimates $d[v]$ and predecessor pointers $\pi[v]$.
                </div>
                <table className="min-w-full divide-y divide-slate-200 border border-slate-200 text-xs font-mono text-center">
                  <thead className="bg-slate-50 text-[11px]">
                    <tr>
                      <th className="px-2 py-1.5 text-slate-600">Vertex</th>
                      <th className="px-2 py-1.5 text-slate-600">d[v]</th>
                      {selectedAlgo === 'astar' && (
                        <>
                          <th className="px-2 py-1.5 text-slate-600">h(v)</th>
                          <th className="px-2 py-1.5 text-slate-600">f = g+h</th>
                        </>
                      )}
                      <th className="px-2 py-1.5 text-slate-600">π[v]</th>
                      <th className="px-2 py-1.5 text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {graph.nodes.map(node => {
                      const d = currentStep.distances[node.id];
                      const p = currentStep.parents[node.id];
                      const isVis = currentStep.visitedNodes.includes(node.id);
                      const isCur = currentStep.currentNode === node.id;
                      const aStarMetric = currentStep.aStarMetrics?.[node.id];

                      return (
                        <tr
                          key={node.id}
                          className={isCur ? 'bg-amber-50 font-bold' : isVis ? 'bg-slate-50 text-slate-700' : 'text-slate-400'}
                        >
                          <td className="px-2 py-1.5 font-bold text-slate-800">{node.label}</td>
                          <td className="px-2 py-1.5">{d === undefined ? '—' : d === Infinity ? '∞' : d}</td>
                          {selectedAlgo === 'astar' && (
                            <>
                              <td className="px-2 py-1.5 text-slate-500">{aStarMetric?.h ?? '—'}</td>
                              <td className="px-2 py-1.5 text-blue-700 font-semibold">{aStarMetric?.f === Infinity ? '∞' : aStarMetric?.f ?? '—'}</td>
                            </>
                          )}
                          <td className="px-2 py-1.5">{p || 'NIL'}</td>
                          <td className="px-2 py-1.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-medium ${
                                isCur
                                  ? 'bg-amber-100 text-amber-800'
                                  : isVis
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isCur ? 'Active' : isVis ? 'Final' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 4: Live Pseudocode Line Highlighting */}
            {activeTab === 'pseudocode' && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500 font-sans pb-1 flex items-center justify-between">
                  <span>CLRS Standard Algorithm Logic</span>
                  <span className="text-[10px] font-mono text-blue-600">Active line highlighted</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  {(PSEUDOCODE_MAPPINGS[selectedAlgo] || []).map((line, idx) => {
                    const isCurrentLine = currentStep?.pseudocodeLine === idx + 1;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                          isCurrentLine ? 'bg-blue-600/30 text-blue-200 font-semibold border-l-2 border-blue-400 pl-1.5' : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="text-slate-500 select-none mr-3 w-5 text-right shrink-0">
                          {idx + 1}
                        </span>
                        <span className={line.includes('//') ? 'text-slate-400 italic' : ''}>{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
