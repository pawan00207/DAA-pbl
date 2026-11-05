/**
 * @file /src/components/Dashboard.tsx
 * @description Pixel-perfect implementation of the Smart Route Optimization System dashboard,
 * matching the user's reference mockup:
 * 1. Hero Banner with "Find the Optimal Route with Smart Algorithms", glowing 3D network graphic & "Smarter Paths. A Better Tomorrow." pill.
 * 2. 4 KPI Metric Cards with icons, values, trends, and smooth SVG sparklines.
 * 3. Live Graph Preview with interactive node layout, start/dest aura, edge weights, legend, and "Edit Graph ↗".
 * 4. Algorithm Comparison double-bar chart (Time ms vs Path Cost) with values over bars and "View Details →".
 * 5. Benchmark Graph Models & Topologies showcase with thumbnails, active model badge, and specs.
 * 6. Recent Simulations tabular audit trail with status pills and timestamps.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA - CS301)
 */

import React, { useState } from 'react';
import { GraphData, SimulationRecord } from '../types/graph';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts';
import {
  PlayCircle,
  Network,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Compass,
  FileCheck2,
  FolderOpen,
  GitCompare,
  Zap,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ExternalLink,
  MapPin,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';

interface DashboardProps {
  currentGraph: GraphData;
  onLoadGraph: (graph: GraphData) => void;
  onNavigateToVisualizer: () => void;
  onNavigateToEditor: () => void;
  onNavigateToComparison: () => void;
  onNavigateToComplexity: () => void;
  onNavigateToHistory?: () => void;
  simulations: SimulationRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentGraph,
  onLoadGraph,
  onNavigateToVisualizer,
  onNavigateToEditor,
  onNavigateToComparison,
  onNavigateToComplexity,
  onNavigateToHistory,
  simulations,
}) => {
  const [previewAlgo, setPreviewAlgo] = useState<'Dijkstra' | 'A*' | 'BFS' | 'Bellman-Ford'>('Dijkstra');

  const nodeCount = currentGraph.nodes.length;
  const edgeCount = currentGraph.edges.length;

  // Comparison benchmark data matching reference mockup
  const comparisonData = [
    { name: 'Dijkstra', time: 0.27, cost: 5 },
    { name: 'A*', time: 0.18, cost: 5 },
    { name: 'Bellman-Ford', time: 0.42, cost: 7 },
    { name: 'MST', time: 0.15, cost: 6 },
  ];

  // Default recent simulations if empty or from history
  const recentLogs = simulations.length > 0 ? simulations.slice(0, 3) : [
    {
      id: 'log-1',
      timestamp: Date.now() - 3600000,
      algorithm: 'dijkstra',
      executionTimeMs: 0.27,
      totalCost: 5,
      success: true,
      dateStr: 'Nov 5, 2025 • 09:42',
    },
    {
      id: 'log-2',
      timestamp: Date.now() - 7200000,
      algorithm: 'astar',
      executionTimeMs: 0.18,
      totalCost: 5,
      success: true,
      dateStr: 'Nov 5, 2025 • 09:40',
    },
    {
      id: 'log-3',
      timestamp: Date.now() - 10800000,
      algorithm: 'bellman-ford',
      executionTimeMs: 0.42,
      totalCost: 7,
      success: true,
      dateStr: 'Nov 5, 2025 • 09:38',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: "Find the Optimal Route with Smart Algorithms" */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[290px]">
          {/* Left 7 Columns: Prose & CTAs */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4 z-10">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                Find the Optimal Route
                <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  with Smart Algorithms
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed font-medium">
                Explore graph algorithms, compare paths and optimize routes in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToVisualizer}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 fill-current/20" />
                <span>Launch Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNavigateToComparison}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <span>Explore Features</span>
              </button>
            </div>
          </div>

          {/* Right 5 Columns: Glowing Nocturnal 3D Network Visualization from reference */}
          <div className="lg:col-span-5 relative overflow-hidden min-h-[220px] lg:min-h-full">
            <img
              src="/assets/hero_network.png"
              alt="Optimal Route Network"
              className="w-full h-full object-cover object-left block"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 2. FOUR KPI METRIC CARDS WITH SPARKLINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Algorithm Engines */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Algorithm Engines</span>
            </div>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">8</span>
              <span className="text-sm font-semibold text-slate-700">Engines</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>↑ +12%</span>
            </div>
          </div>

          {/* Smooth Blue Wave Sparkline SVG */}
          <div className="w-24 h-12 text-blue-400 shrink-0">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,28 Q 15,10 30,22 T 60,14 T 85,26 T 100,8"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Graph Topology */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Active Graph Topology</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1 font-mono">
              <span className="text-xl font-bold text-slate-900">|V| = {nodeCount}</span>
              <span className="text-xl font-bold text-slate-900">|E| = {edgeCount}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>↑ +0%</span>
            </div>
          </div>

          {/* Smooth Purple Wave Sparkline SVG */}
          <div className="w-24 h-12 text-purple-400 shrink-0">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,30 Q 20,28 40,15 T 70,22 T 100,6"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Avg Execution Time */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Avg Execution Time</span>
            </div>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">0.27</span>
              <span className="text-sm font-semibold text-slate-600 font-sans">ms</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>↓ -8%</span>
            </div>
          </div>

          {/* Smooth Emerald Wave Sparkline SVG */}
          <div className="w-24 h-12 text-emerald-400 shrink-0">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,10 Q 25,25 50,12 T 75,28 T 100,18"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Simulation Runs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <PlayCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Simulation Runs</span>
            </div>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {Math.max(5, simulations.length)}
              </span>
              <span className="text-sm font-semibold text-purple-700">logged</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <span>↑ +1</span>
            </div>
          </div>

          {/* Smooth Purple Wave Sparkline SVG */}
          <div className="w-24 h-12 text-purple-400 shrink-0">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,25 Q 20,8 45,20 T 75,10 T 100,24"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: LIVE GRAPH PREVIEW (LEFT) & ALGORITHM COMPARISON (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Live Graph Preview matching reference mockup */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Live Graph Preview</h2>
            </div>

            {/* Dropdown: Dijkstra ▾ */}
            <div className="relative">
              <select
                value={previewAlgo}
                onChange={e => setPreviewAlgo(e.target.value as any)}
                className="appearance-none pl-3 pr-7 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="Dijkstra">Dijkstra</option>
                <option value="A*">A*</option>
                <option value="BFS">BFS</option>
                <option value="Bellman-Ford">Bellman-Ford</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Interactive Graph Canvas representation */}
          <div className="relative py-4 flex items-center justify-center min-h-[220px]">
            <svg viewBox="0 0 420 180" className="w-full h-48 select-none">
              {/* Edges */}
              <line x1="80" y1="90" x2="180" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="80" y1="90" x2="160" y2="150" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="180" y1="40" x2="290" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="160" y1="150" x2="270" y2="155" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="290" y1="60" x2="270" y2="155" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Edge Weight Badges */}
              {/* Edge 1-2: weight 5 */}
              <rect x="122" y="55" width="16" height="16" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="130" y="67" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">5</text>

              {/* Edge 1-4: weight 2 */}
              <rect x="112" y="115" width="16" height="16" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="120" y="127" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">2</text>

              {/* Edge 2-3: weight 3 */}
              <rect x="232" y="42" width="16" height="16" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="240" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">3</text>

              {/* Edge 3-5: weight 4 */}
              <rect x="277" y="100" width="16" height="16" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="285" y="112" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">4</text>

              {/* Edge 4-5: weight 1 */}
              <rect x="210" y="145" width="16" height="16" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="218" y="157" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">1</text>

              {/* Node 1: Start Node (Glowing Green) */}
              <circle cx="80" cy="90" r="22" fill="#10b981" opacity="0.2" />
              <circle cx="80" cy="90" r="14" fill="#059669" />
              <text x="80" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">1</text>

              {/* Node 2: Blue Node */}
              <circle cx="180" cy="40" r="13" fill="#2563eb" />
              <text x="180" y="44" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">2</text>

              {/* Node 3: Blue Node */}
              <circle cx="290" cy="60" r="13" fill="#2563eb" />
              <text x="290" y="64" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">3</text>

              {/* Node 4: Blue Node */}
              <circle cx="160" cy="150" r="13" fill="#2563eb" />
              <text x="160" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">4</text>

              {/* Node 5: Destination (Glowing Purple) */}
              <circle cx="270" cy="155" r="22" fill="#a855f7" opacity="0.25" />
              <circle cx="270" cy="155" r="14" fill="#7c3aed" />
              <text x="270" y="159" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">5</text>
            </svg>

            {/* Floating Legend on the right */}
            <div className="absolute right-3 top-4 space-y-1.5 text-[11px] font-medium text-slate-600 bg-white/90 p-2 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Start Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                <span>Destination</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400 inline-block" />
                <span>Edge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 font-mono">—</span>
                <span>Weight</span>
              </div>
            </div>
          </div>

          {/* Footer Action: Edit Graph ↗ */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onNavigateToEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Graph</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Algorithm Comparison Chart matching reference mockup */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Algorithm Comparison</h2>
            </div>

            <button
              onClick={onNavigateToComparison}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Chart Header Legend: Time (ms) & Path Cost */}
          <div className="flex items-center justify-center gap-6 pt-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Time (ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
              <span>Path Cost</span>
            </div>
          </div>

          {/* Recharts Double Bar Chart with Values on Top */}
          <div className="w-full h-52 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 30]}
                  ticks={[0, 10, 20, 30]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="time" name="Time (ms)" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="time" position="top" fill="#1e293b" fontSize={10} fontWeight="bold" />
                </Bar>
                <Bar dataKey="cost" name="Path Cost" fill="#a855f7" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="cost" position="top" fill="#1e293b" fontSize={10} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: BENCHMARK GRAPH MODELS & TOPOLOGIES (LEFT) & RECENT SIMULATIONS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Benchmark Graph Models & Topologies matching reference mockup */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Benchmark Graph Models &amp; Topologies
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              6 Models
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Delhi NCR Transit Network */}
            <div
              onClick={() => onLoadGraph(SAMPLE_GRAPHS[0])}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                currentGraph.id === SAMPLE_GRAPHS[0]?.id
                  ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* City Skyline Thumbnail from reference */}
              <img
                src="/assets/delhi_transit_thumb.png"
                alt="Delhi NCR Transit Network"
                className="w-18 h-18 rounded-xl object-cover shrink-0 shadow-xs"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-xs text-slate-900 truncate">Delhi NCR Transit Network</h3>
                    {currentGraph.id === SAMPLE_GRAPHS[0]?.id && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-semibold">
                        Active Model
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    Realistic urban road/metro network with major transport hubs.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono mt-2">
                  <span className="font-semibold text-slate-800">|V|=8</span>
                  <span>|E|=12</span>
                  <span className="font-sans px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-medium">
                    Undirected
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: CLRS Textbook Graph */}
            <div
              onClick={() => onLoadGraph(SAMPLE_GRAPHS[1] || SAMPLE_GRAPHS[0])}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                currentGraph.id === SAMPLE_GRAPHS[1]?.id
                  ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* High-speed Train / Metro Thumbnail from reference */}
              <img
                src="/assets/clrs_train_thumb.png"
                alt="CLRS Textbook Graph"
                className="w-18 h-18 rounded-xl object-cover shrink-0 shadow-xs"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-xs text-slate-900 truncate">CLRS Textbook Graph</h3>
                    {currentGraph.id === SAMPLE_GRAPHS[1]?.id && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-semibold">
                        Active Model
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    Standard introduction graph for verifying algorithms.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono mt-2">
                  <span className="font-semibold text-slate-800">|V|=5</span>
                  <span>|E|=10</span>
                  <span className="font-sans px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-medium">
                    Directed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Recent Simulations Table matching reference mockup */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recent Simulations</h2>
            </div>

            <button
              onClick={onNavigateToHistory || onNavigateToVisualizer}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-2.5 font-semibold">#</th>
                  <th className="pb-2.5 font-semibold">Algorithm</th>
                  <th className="pb-2.5 font-semibold">Execution Time</th>
                  <th className="pb-2.5 font-semibold">Path Cost</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {recentLogs.map((log: any, idx: number) => {
                  const algoName =
                    log.algorithm === 'dijkstra'
                      ? 'Dijkstra'
                      : log.algorithm === 'astar'
                      ? 'A*'
                      : log.algorithm === 'bellman-ford'
                      ? 'Bellman-Ford'
                      : log.algorithm.toUpperCase();

                  const dotColor =
                    idx === 0
                      ? 'bg-purple-600'
                      : idx === 1
                      ? 'bg-blue-600'
                      : 'bg-indigo-600';

                  const dateDisplay =
                    log.dateStr ||
                    new Date(log.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 text-slate-900 font-bold flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotColor} inline-block`} />
                        <span>{algoName}</span>
                      </td>
                      <td className="py-3 font-mono text-slate-600 text-[11px]">
                        {log.executionTimeMs} ms
                      </td>
                      <td className="py-3 font-mono text-slate-900 font-bold text-xs">
                        {log.totalCost ?? 5}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Success
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {dateDisplay}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
