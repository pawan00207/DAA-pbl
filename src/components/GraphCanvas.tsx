/**
 * @file /src/components/GraphCanvas.tsx
 * @description High-performance interactive SVG graph canvas supporting node dragging,
 * edge creation, weight editing, source/target selection, directed arrow boundary trimming,
 * floating mini-toolbar, collapsible legend, and SVG/PNG image export.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState, useRef, useId } from 'react';
import { GraphData, GraphNode, GraphEdge } from '../types/graph';
import {
  Move,
  Plus,
  ArrowRight,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  Image,
  Layers,
  ChevronDown,
  ChevronUp,
  Edit3,
} from 'lucide-react';

export type CanvasMode = 'select' | 'add-node' | 'add-edge' | 'set-source' | 'set-target' | 'delete';

interface GraphCanvasProps {
  graph: GraphData;
  onUpdateGraph: (updated: GraphData) => void;
  sourceNodeId?: string;
  targetNodeId?: string;
  onSelectSource?: (id: string) => void;
  onSelectTarget?: (id: string) => void;

  // Visualizer Highlights
  currentNodeId?: string | null;
  visitedNodeIds?: string[];
  frontierNodeIds?: string[];
  pathNodeIds?: string[];
  selectedEdgeIds?: string[];
  currentEdgeId?: string | null;
  rejectedEdgeIds?: string[];

  height?: number | string;
  readOnly?: boolean;
}

const NODE_RADIUS = 20;

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  onUpdateGraph,
  sourceNodeId,
  targetNodeId,
  onSelectSource,
  onSelectTarget,
  currentNodeId,
  visitedNodeIds = [],
  frontierNodeIds = [],
  pathNodeIds = [],
  selectedEdgeIds = [],
  currentEdgeId,
  rejectedEdgeIds = [],
  height = 560,
  readOnly = false,
}) => {
  const markerIdPrefix = useId().replace(/:/g, '');
  const [mode, setMode] = useState<CanvasMode>('select');
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState<string | null>(null);
  const [editingEdge, setEditingEdge] = useState<{ id: string; weight: number } | null>(null);
  const [edgeWeightInput, setEdgeWeightInput] = useState<string>('5');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Convert SVG coordinates
  const getSvgCoordinates = (e: { clientX: number; clientY: number }) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return {
      x: Math.max(NODE_RADIUS + 10, Math.min(880 - NODE_RADIUS, x)),
      y: Math.max(NODE_RADIUS + 10, Math.min(530 - NODE_RADIUS, y)),
    };
  };

  // Canvas Click (Add Node)
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly) return;
    if (mode === 'add-node') {
      const { x, y } = getSvgCoordinates(e);
      const nextIndex = graph.nodes.length;
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const label = nextIndex < 26 ? letters[nextIndex] : `V${nextIndex + 1}`;
      const id = label;

      const newNode: GraphNode = {
        id,
        label,
        x: Math.round(x),
        y: Math.round(y),
      };

      onUpdateGraph({
        ...graph,
        nodes: [...graph.nodes, newNode],
      });
    }
  };

  // Node Click handler
  const handleNodeClick = (node: GraphNode, e: React.MouseEvent) => {
    e.stopPropagation();

    if (readOnly) {
      if (onSelectSource && !sourceNodeId) {
        onSelectSource(node.id);
      } else if (onSelectTarget && sourceNodeId && sourceNodeId !== node.id) {
        onSelectTarget(node.id);
      }
      return;
    }

    if (mode === 'set-source' && onSelectSource) {
      onSelectSource(node.id);
      setMode('select');
      return;
    }

    if (mode === 'set-target' && onSelectTarget) {
      onSelectTarget(node.id);
      setMode('select');
      return;
    }

    if (mode === 'delete') {
      const newNodes = graph.nodes.filter(n => n.id !== node.id);
      const newEdges = graph.edges.filter(
        edge => edge.source !== node.id && edge.target !== node.id
      );
      onUpdateGraph({
        ...graph,
        nodes: newNodes,
        edges: newEdges,
      });
      return;
    }

    if (mode === 'add-edge') {
      if (!selectedNodeForEdge) {
        setSelectedNodeForEdge(node.id);
      } else if (selectedNodeForEdge === node.id) {
        // Disallow self-loops
        setSelectedNodeForEdge(null);
      } else {
        // Connect selectedNodeForEdge -> node.id
        const existing = graph.edges.find(
          edge =>
            (edge.source === selectedNodeForEdge && edge.target === node.id) ||
            (!graph.isDirected && edge.source === node.id && edge.target === selectedNodeForEdge)
        );

        if (!existing) {
          const newEdge: GraphEdge = {
            id: `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            source: selectedNodeForEdge,
            target: node.id,
            weight: 5,
            directed: graph.isDirected,
          };
          onUpdateGraph({
            ...graph,
            edges: [...graph.edges, newEdge],
          });
        }
        setSelectedNodeForEdge(null);
      }
      return;
    }
  };

  // Node Drag
  const handleMouseDown = (node: GraphNode, e: React.MouseEvent) => {
    if (readOnly || mode !== 'select') return;
    e.stopPropagation();
    setDraggedNode(node.id);
    const { x, y } = getSvgCoordinates(e);
    setDragOffset({ x: node.x - x, y: node.y - y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNode) return;
    const { x, y } = getSvgCoordinates(e);
    const newX = Math.round(x + dragOffset.x);
    const newY = Math.round(y + dragOffset.y);

    onUpdateGraph({
      ...graph,
      nodes: graph.nodes.map(n =>
        n.id === draggedNode
          ? {
              ...n,
              x: Math.max(NODE_RADIUS + 5, Math.min(885 - NODE_RADIUS, newX)),
              y: Math.max(NODE_RADIUS + 5, Math.min(525 - NODE_RADIUS, newY)),
            }
          : n
      ),
    });
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Edge Click
  const handleEdgeClick = (edge: GraphEdge, e: React.MouseEvent) => {
    e.stopPropagation();
    if (readOnly) return;

    if (mode === 'delete') {
      onUpdateGraph({
        ...graph,
        edges: graph.edges.filter(e => e.id !== edge.id),
      });
      return;
    }

    setEditingEdge({ id: edge.id, weight: Number(edge.weight) });
    setEdgeWeightInput(String(edge.weight));
  };

  const handleSaveEdgeWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdge) return;
    const parsed = parseFloat(edgeWeightInput);
    if (isNaN(parsed)) return;

    onUpdateGraph({
      ...graph,
      edges: graph.edges.map(ed => (ed.id === editingEdge.id ? { ...ed, weight: parsed } : ed)),
    });
    setEditingEdge(null);
  };

  // Export SVG directly
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${graph.name.toLowerCase().replace(/\s+/g, '_')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export PNG via Canvas
  const handleExportPNG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const img = new window.Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1800; // high DPI (2x)
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${graph.name.toLowerCase().replace(/\s+/g, '_')}.png`;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="relative flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs select-none">
      {/* Floating Mini-Toolbar */}
      {!readOnly && (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 border border-slate-200 rounded-lg shadow-sm">
          <button
            onClick={() => { setMode('select'); setSelectedNodeForEdge(null); }}
            title="Move & Reposition Nodes"
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'select' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Select and move nodes"
          >
            <Move className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setMode('add-node'); setSelectedNodeForEdge(null); }}
            title="Add Node: Click canvas to place"
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'add-node' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Add Node"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setMode('add-edge'); setSelectedNodeForEdge(null); }}
            title="Add Edge: Click Node 1 then Node 2"
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'add-edge' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Add Edge"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setMode('set-source'); setSelectedNodeForEdge(null); }}
            title="Set Source: Click vertex to mark as S"
            className={`px-2 py-1.5 rounded-md text-xs font-bold transition-colors ${
              mode === 'set-source' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
            aria-label="Set Source"
          >
            S
          </button>

          <button
            onClick={() => { setMode('set-target'); setSelectedNodeForEdge(null); }}
            title="Set Destination: Click vertex to mark as D"
            className={`px-2 py-1.5 rounded-md text-xs font-bold transition-colors ${
              mode === 'set-target' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
            aria-label="Set Destination"
          >
            D
          </button>

          <div className="w-px h-4 bg-slate-200 mx-0.5"></div>

          <button
            onClick={() => { setMode('delete'); setSelectedNodeForEdge(null); }}
            title="Delete: Click vertex or edge to remove"
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'delete' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
            }`}
            aria-label="Delete element"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Zoom & Export Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 border border-slate-200 rounded-lg shadow-sm text-xs">
        <button
          onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="px-1.5 font-mono text-[11px] text-slate-600">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
          title="Fit & Reset View"
          aria-label="Reset View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200 mx-0.5"></div>

        <button
          onClick={handleExportPNG}
          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
          title="Export Canvas as PNG Image"
          aria-label="Export PNG"
        >
          <Image className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleExportSVG}
          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
          title="Export Canvas as Vector SVG"
          aria-label="Export SVG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Collapsible Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-30 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg shadow-sm text-[11px] overflow-hidden max-w-xs transition-all">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-100"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Canvas Legend
          </span>
          {showLegend ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {showLegend && (
          <div className="p-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Source (S)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Destination (D)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Current Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span>Frontier / Queue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>Final Path / MST</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t-2 border-dashed border-red-500"></span>
              <span>Cycle Rejected</span>
            </div>
          </div>
        )}
      </div>

      {/* Main SVG Graphic Canvas */}
      <div className="relative w-full overflow-hidden bg-white" style={{ minHeight: height, height }}>
        <svg
          ref={svgRef}
          viewBox="0 0 900 540"
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: 'top left' }}
        >
          {/* Subtle Dot Grid */}
          <defs>
            <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.45" />
            </pattern>
            {/* Arrowhead Markers for Directed Graphs */}
            <marker
              id={`${markerIdPrefix}-arrow-default`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
            </marker>
            <marker
              id={`${markerIdPrefix}-arrow-active`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
            <marker
              id={`${markerIdPrefix}-arrow-path`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5" />
            </marker>
            <marker
              id={`${markerIdPrefix}-arrow-mst`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
            </marker>
            <marker
              id={`${markerIdPrefix}-arrow-rejected`}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Grid Background */}
          <rect width="900" height="540" fill="url(#dot-grid)" />

          {/* Edges Layer */}
          <g className="edges-layer">
            {graph.edges.map(edge => {
              const sourceNode = graph.nodes.find(n => n.id === edge.source);
              const targetNode = graph.nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isCurrent = currentEdgeId === edge.id;
              const isSelected = selectedEdgeIds.includes(edge.id);
              const isRejected = rejectedEdgeIds.includes(edge.id);

              const x1 = sourceNode.x;
              const y1 = sourceNode.y;
              const x2 = targetNode.x;
              const y2 = targetNode.y;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist === 0) return null; // Avoid self-loop division by zero

              // Check if there is an opposite parallel edge in directed graph
              const hasOppositeEdge =
                graph.isDirected &&
                graph.edges.some(e => e.source === edge.target && e.target === edge.source);

              // Calculate offset for parallel edge separation
              const offsetDist = hasOppositeEdge ? 12 : 0;
              const normX = -dy / dist;
              const normY = dx / dist;

              // Compute trimmed line coordinates at node borders (NODE_RADIUS = 20)
              const trimRadius = NODE_RADIUS + (graph.isDirected ? 6 : 2);
              const startX = x1 + (dx / dist) * NODE_RADIUS + normX * offsetDist;
              const startY = y1 + (dy / dist) * NODE_RADIUS + normY * offsetDist;
              const endX = x2 - (dx / dist) * trimRadius + normX * offsetDist;
              const endY = y2 - (dy / dist) * trimRadius + normY * offsetDist;

              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;

              let strokeColor = '#94a3b8';
              let strokeWidth = 2;
              let strokeDasharray = 'none';
              let markerEnd = graph.isDirected ? `url(#${markerIdPrefix}-arrow-default)` : undefined;

              if (isRejected) {
                strokeColor = '#ef4444';
                strokeWidth = 2.5;
                strokeDasharray = '5,4';
                markerEnd = graph.isDirected ? `url(#${markerIdPrefix}-arrow-rejected)` : undefined;
              } else if (isCurrent) {
                strokeColor = '#0284c7';
                strokeWidth = 3.5;
                markerEnd = graph.isDirected ? `url(#${markerIdPrefix}-arrow-active)` : undefined;
              } else if (isSelected) {
                strokeColor = '#4f46e5'; // Indigo for path
                strokeWidth = 3.5;
                markerEnd = graph.isDirected ? `url(#${markerIdPrefix}-arrow-path)` : undefined;
              }

              return (
                <g key={edge.id} className="cursor-pointer">
                  {/* Invisible hit-area */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="transparent"
                    strokeWidth="16"
                    onClick={e => handleEdgeClick(edge, e)}
                  />

                  {/* Visible Edge Line terminating at node border */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    markerEnd={markerEnd}
                    className="transition-colors duration-150"
                    onClick={e => handleEdgeClick(edge, e)}
                  />

                  {/* Edge Weight Pill Badge */}
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    onClick={e => handleEdgeClick(edge, e)}
                    className="hover:scale-110 transition-transform"
                  >
                    <rect
                      x="-14"
                      y="-10"
                      width="28"
                      height="20"
                      rx="6"
                      fill={
                        isSelected
                          ? '#eef2ff'
                          : isCurrent
                          ? '#f0f9ff'
                          : isRejected
                          ? '#fef2f2'
                          : '#ffffff'
                      }
                      stroke={
                        isSelected
                          ? '#4f46e5'
                          : isCurrent
                          ? '#0284c7'
                          : isRejected
                          ? '#ef4444'
                          : '#cbd5e1'
                      }
                      strokeWidth="1.5"
                      className="shadow-xs"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      className="text-[11px] font-mono font-semibold"
                      fill={
                        isSelected
                          ? '#3730a3'
                          : isCurrent
                          ? '#0369a1'
                          : isRejected
                          ? '#b91c1c'
                          : '#334155'
                      }
                    >
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Nodes Layer */}
          <g className="nodes-layer">
            {graph.nodes.map(node => {
              const isSource = sourceNodeId === node.id;
              const isTarget = targetNodeId === node.id;
              const isCurrent = currentNodeId === node.id;
              const isVisited = visitedNodeIds.includes(node.id);
              const isFrontier = frontierNodeIds.includes(node.id);
              const isPath = pathNodeIds.includes(node.id);
              const isConnecting = selectedNodeForEdge === node.id;

              let circleFill = '#ffffff';
              let circleStroke = '#64748b';
              let textColor = '#0f172a';

              if (isConnecting) {
                circleFill = '#eff6ff';
                circleStroke = '#2563eb';
              } else if (isCurrent) {
                circleFill = '#fef3c7'; // Amber
                circleStroke = '#d97706';
                textColor = '#78350f';
              } else if (isPath) {
                circleFill = '#eef2ff'; // Indigo
                circleStroke = '#4f46e5';
                textColor = '#312e81';
              } else if (isFrontier) {
                circleFill = '#e0f2fe'; // Sky
                circleStroke = '#0284c7';
                textColor = '#0369a1';
              } else if (isVisited) {
                circleFill = '#eff6ff'; // Blue
                circleStroke = '#2563eb';
                textColor = '#1e40af';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={e => handleNodeClick(node, e)}
                  onMouseDown={e => handleMouseDown(node, e)}
                  className="cursor-pointer group"
                >
                  {/* Current Active Pulse */}
                  {isCurrent && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}

                  {/* Terminal Ring */}
                  {isSource && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />
                  )}
                  {isTarget && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={NODE_RADIUS}
                    fill={circleFill}
                    stroke={circleStroke}
                    strokeWidth={isPath || isCurrent || isConnecting ? 2.5 : 2}
                    className="transition-colors duration-150 shadow-2xs"
                  />

                  {/* Node Centered Label */}
                  <text
                    y="4"
                    textAnchor="middle"
                    className="font-bold text-[12px] font-mono pointer-events-none select-none"
                    fill={textColor}
                  >
                    {node.label}
                  </text>

                  {/* Source Badge (S) */}
                  {isSource && (
                    <g transform="translate(13, -13)">
                      <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        y="3"
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-white pointer-events-none"
                      >
                        S
                      </text>
                    </g>
                  )}

                  {/* Destination Badge (D) */}
                  {isTarget && (
                    <g transform="translate(13, 13)">
                      <circle r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        y="3"
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-white pointer-events-none"
                      >
                        D
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Edge Weight Edit Modal */}
      {editingEdge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 w-full max-w-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Edit Edge Weight
              </h3>
              <button
                onClick={() => setEditingEdge(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdgeWeight} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Weight (Cost / Distance / Latency):
                </label>
                <input
                  type="number"
                  step="any"
                  value={edgeWeightInput}
                  onChange={e => setEdgeWeightInput(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Positive values recommended for Dijkstra / A*. Negative values supported in Bellman-Ford.
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEdge(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs"
                >
                  Save Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
