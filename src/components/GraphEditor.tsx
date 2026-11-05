/**
 * @file /src/components/GraphEditor.tsx
 * @description Graph Editor with Undo/Redo history stack (25+ steps), keyboard shortcuts,
 * self-loop & duplicate edge guards, live adjacency matrix/list inspectors, and JSON import/export.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState, useEffect, useRef } from 'react';
import { GraphData, GraphNode, GraphEdge } from '../types/graph';
import { GraphCanvas } from './GraphCanvas';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';
import { checkHasNegativeWeights, getConnectedComponents, buildAdjacencyMatrix } from '../algorithms/adjacency';
import { useToast } from './Toast';
import {
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  ArrowRightLeft,
  AlertTriangle,
  Undo2,
  Redo2,
  Table,
  ListTree,
  AlertCircle,
} from 'lucide-react';

interface GraphEditorProps {
  graph: GraphData;
  onUpdateGraph: (updated: GraphData) => void;
  sourceNodeId?: string;
  targetNodeId?: string;
  onSelectSource: (id: string) => void;
  onSelectTarget: (id: string) => void;
}

export const GraphEditor: React.FC<GraphEditorProps> = ({
  graph,
  onUpdateGraph,
  sourceNodeId,
  targetNodeId,
  onSelectSource,
  onSelectTarget,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'canvas' | 'adj-list' | 'adj-matrix'>('canvas');
  const [showRandomModal, setShowRandomModal] = useState<boolean>(false);
  const [randomNodes, setRandomNodes] = useState<number>(6);
  const [randomDensity, setRandomDensity] = useState<number>(0.35);

  // Undo / Redo Stacks (minimum 25 steps)
  const [undoStack, setUndoStack] = useState<GraphData[]>([]);
  const [redoStack, setRedoStack] = useState<GraphData[]>([]);
  const isUndoRedoAction = useRef(false);

  // Update graph with undo history tracking
  const handleGraphChangeWithHistory = (newGraph: GraphData) => {
    if (!isUndoRedoAction.current) {
      setUndoStack(prev => [...prev.slice(-25), graph]);
      setRedoStack([]); // Clear redo on fresh edit
    }
    isUndoRedoAction.current = false;
    onUpdateGraph(newGraph);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setRedoStack(prev => [...prev, graph]);
    isUndoRedoAction.current = true;
    onUpdateGraph(previous);
    showToast('Reverted last edit (Undo)', 'info');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setUndoStack(prev => [...prev, graph]);
    isUndoRedoAction.current = true;
    onUpdateGraph(next);
    showToast('Restored edit (Redo)', 'info');
  };

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, graph]);

  const { hasNegative, negativeEdges } = checkHasNegativeWeights(graph);
  const components = getConnectedComponents(graph);
  const { nodeIds, matrix } = buildAdjacencyMatrix(graph);

  // Check for duplicate edges
  const hasDuplicateEdges = graph.edges.some((e1, idx) =>
    graph.edges.slice(idx + 1).some(
      e2 =>
        (e1.source === e2.source && e1.target === e2.target) ||
        (!graph.isDirected && e1.source === e2.target && e1.target === e2.source)
    )
  );

  // Toggle Directed
  const handleToggleDirected = () => {
    handleGraphChangeWithHistory({
      ...graph,
      isDirected: !graph.isDirected,
      edges: graph.edges.map(e => ({ ...e, directed: !graph.isDirected })),
    });
    showToast(
      graph.isDirected ? 'Switched to Undirected Graph' : 'Switched to Directed Graph (Digraph)',
      'info'
    );
  };

  // Clear Graph
  const handleClearGraph = () => {
    handleGraphChangeWithHistory({
      ...graph,
      name: 'Empty Graph',
      nodes: [],
      edges: [],
    });
    showToast('Canvas cleared', 'info');
  };

  // Generate Random Graph
  const handleGenerateRandom = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const count = Math.max(3, Math.min(16, randomNodes));
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    const centerX = 450;
    const centerY = 270;
    const radius = Math.min(centerX - 80, centerY - 80);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const x = Math.round(centerX + radius * Math.cos(angle));
      const y = Math.round(centerY + radius * Math.sin(angle));
      const label = i < 26 ? letters[i] : `V${i + 1}`;
      newNodes.push({ id: label, label, x, y });
    }

    // Connect spanning backbone
    for (let i = 1; i < count; i++) {
      const p = Math.floor(Math.random() * i);
      newEdges.push({
        id: `e_${Date.now()}_${i}`,
        source: newNodes[p].id,
        target: newNodes[i].id,
        weight: Math.floor(Math.random() * 20) + 1,
        directed: graph.isDirected,
      });
    }

    // Add extra random edges
    let eCounter = count;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (Math.random() < randomDensity) {
          const already = newEdges.some(
            e =>
              (e.source === newNodes[i].id && e.target === newNodes[j].id) ||
              (!graph.isDirected && e.source === newNodes[j].id && e.target === newNodes[i].id)
          );
          if (!already) {
            newEdges.push({
              id: `e_${Date.now()}_${eCounter++}`,
              source: newNodes[i].id,
              target: newNodes[j].id,
              weight: Math.floor(Math.random() * 25) + 1,
              directed: graph.isDirected,
            });
          }
        }
      }
    }

    handleGraphChangeWithHistory({
      ...graph,
      name: `Random Graph (|V|=${count}, |E|=${newEdges.length})`,
      nodes: newNodes,
      edges: newEdges,
    });

    if (newNodes.length > 0) onSelectSource(newNodes[0].id);
    if (newNodes.length > 1) onSelectTarget(newNodes[newNodes.length - 1].id);

    setShowRandomModal(false);
    showToast(`Generated random graph with ${count} vertices and ${newEdges.length} edges`, 'success');
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${graph.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Graph exported as JSON', 'success');
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          handleGraphChangeWithHistory(parsed);
          showToast(`Imported "${parsed.name || 'Graph'}" successfully`, 'success');
        } else {
          showToast('Invalid JSON graph format: Missing nodes or edges array.', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sample Preset Dropdown */}
          <select
            value={graph.id || ''}
            onChange={e => {
              const found = SAMPLE_GRAPHS.find(g => g.id === e.target.value);
              if (found) {
                handleGraphChangeWithHistory(found);
                if (found.nodes.length > 0) onSelectSource(found.nodes[0].id);
                if (found.nodes.length > 1) onSelectTarget(found.nodes[found.nodes.length - 1].id);
                showToast(`Loaded "${found.name}"`, 'info');
              }
            }}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Load Sample Graph...
            </option>
            {SAMPLE_GRAPHS.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowRandomModal(true)}
            className="h-9 flex items-center gap-1.5 px-3 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Random Graph
          </button>

          {/* Undo / Redo Buttons */}
          <div className="flex items-center border border-slate-200 rounded-md bg-white">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="h-9 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="h-9 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToggleDirected}
            className={`h-9 flex items-center gap-1.5 px-3 border text-xs font-semibold rounded-md transition-colors ${
              graph.isDirected
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {graph.isDirected ? 'Directed (Digraph)' : 'Undirected'}
          </button>

          <button
            onClick={handleClearGraph}
            className="h-9 flex items-center gap-1.5 px-3 text-red-600 hover:bg-red-50 border border-red-200 text-xs font-semibold rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="h-9 flex items-center gap-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors"
            title="Download Graph as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export JSON
          </button>

          <label className="h-9 flex items-center gap-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Validation Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-600">Connected Components:</span>
          <span
            className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
              components.length === 1
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {components.length === 1 ? '1 (Connected)' : `${components.length} (Disconnected)`}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-600">Negative Edge Weights:</span>
          <span
            className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
              hasNegative
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {hasNegative ? `Found (${negativeEdges.length}) — Use Bellman-Ford` : 'None (w ≥ 0)'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-600">Selected Terminals:</span>
          <span className="font-mono font-semibold text-slate-800 text-[11px]">
            S: <strong className="text-emerald-600">{sourceNodeId || 'None'}</strong> → D:{' '}
            <strong className="text-rose-600">{targetNodeId || 'None'}</strong>
          </span>
        </div>
      </div>

      {/* Large Graph Warning if > 200 nodes */}
      {graph.nodes.length > 200 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Large graph detected (|V| &gt; 200). Animation steps will be dense. Consider reducing vertex count for optimal visualizer frame rates.</span>
        </div>
      )}

      {/* Inspector Tabs (Canvas vs Adjacency List vs Adjacency Matrix) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'canvas'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Canvas Editor
          </button>
          <button
            onClick={() => setActiveTab('adj-list')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'adj-list'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            Adjacency List Structure
          </button>
          <button
            onClick={() => setActiveTab('adj-matrix')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'adj-matrix'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Adjacency Matrix (|V| × |V|)
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'canvas' && (
            <GraphCanvas
              graph={graph}
              onUpdateGraph={handleGraphChangeWithHistory}
              sourceNodeId={sourceNodeId}
              targetNodeId={targetNodeId}
              onSelectSource={onSelectSource}
              onSelectTarget={onSelectTarget}
            />
          )}

          {activeTab === 'adj-list' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Adjacency lists use <strong>O(|V| + |E|)</strong> space, which is optimal for sparse graphs.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {graph.nodes.map(node => {
                  const neighbors = graph.edges.filter(e =>
                    graph.isDirected
                      ? e.source === node.id
                      : e.source === node.id || e.target === node.id
                  );

                  return (
                    <div
                      key={node.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200 mb-2">
                        <span className="font-bold text-blue-700">Vertex: {node.label} ({node.id})</span>
                        <span className="text-[11px] text-slate-500 font-sans">
                          Degree: {neighbors.length}
                        </span>
                      </div>
                      <div className="text-slate-700">
                        {neighbors.length === 0 ? (
                          <span className="text-slate-400 italic">No incident edges</span>
                        ) : (
                          <ul className="space-y-1">
                            {neighbors.map(e => {
                              const destId = e.source === node.id ? e.target : e.source;
                              const destNode = graph.nodes.find(n => n.id === destId);
                              return (
                                <li key={e.id} className="flex items-center justify-between">
                                  <span>→ {destNode?.label || destId}</span>
                                  <span className="text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    weight: {e.weight}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'adj-matrix' && (
            <div className="space-y-3 overflow-x-auto">
              <div className="text-xs text-slate-600">
                Adjacency Matrix uses <strong>O(|V|²)</strong> memory. An entry $A[i][j]$ contains the edge weight, or <span className="font-mono text-slate-400">∞</span> if no direct edge exists.
              </div>
              <table className="min-w-full divide-y divide-slate-200 border border-slate-200 text-xs font-mono text-center">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 border-r border-slate-200 text-slate-500 font-bold">
                      V_i \ V_j
                    </th>
                    {nodeIds.map(id => (
                      <th key={id} className="px-3 py-2 border-r border-slate-200 text-slate-700 font-bold">
                        {id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {nodeIds.map((rowId, rowIdx) => (
                    <tr key={rowId} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                        {rowId}
                      </td>
                      {nodeIds.map((colId, colIdx) => {
                        const val = matrix[rowIdx][colIdx];
                        return (
                          <td
                            key={colId}
                            className={`px-3 py-2 border-r border-slate-200 ${
                              val !== null ? 'font-bold text-blue-700 bg-blue-50/30' : 'text-slate-300'
                            }`}
                          >
                            {val !== null ? val : '∞'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Random Graph Modal */}
      {showRandomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Generate Random Weighted Graph
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Vertices (|V|): <strong className="text-slate-900">{randomNodes}</strong>
                </label>
                <input
                  type="range"
                  min="3"
                  max="14"
                  value={randomNodes}
                  onChange={e => setRandomNodes(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Edge Density: <strong className="text-slate-900">{Math.round(randomDensity * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={randomDensity}
                  onChange={e => setRandomDensity(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setShowRandomModal(false)}
                className="h-9 px-3 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateRandom}
                className="h-9 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs"
              >
                Generate Graph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
