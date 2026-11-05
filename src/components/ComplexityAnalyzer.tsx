/**
 * @file /src/components/ComplexityAnalyzer.tsx
 * @description Complexity Analyzer distinguishing Theoretical Asymptotic Complexity,
 * Counted Fundamental Operations, and Measured Wall-Clock Time, with Recharts performance curves.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState } from 'react';
import { THEORETICAL_COMPLEXITIES, runEmpiricalBenchmarks, BenchmarkDataPoint } from '../algorithms/benchmarks';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Cpu,
  RotateCcw,
  Play,
  Info,
  TrendingUp,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const ComplexityAnalyzer: React.FC = () => {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkDataPoint[]>([
    { vertexCount: 10, edgeCount: 18, dijkstraTime: 0.12, bfsTime: 0.05, dfsTime: 0.04, primTime: 0.15, kruskalTime: 0.18, bellmanFordTime: 0.22, aStarTime: 0.10, dijkstraOps: 34, bfsOps: 28, primOps: 42, kruskalOps: 48 },
    { vertexCount: 25, edgeCount: 52, dijkstraTime: 0.28, bfsTime: 0.11, dfsTime: 0.09, primTime: 0.36, kruskalTime: 0.42, bellmanFordTime: 0.75, aStarTime: 0.22, dijkstraOps: 98, bfsOps: 76, primOps: 120, kruskalOps: 156 },
    { vertexCount: 50, edgeCount: 125, dijkstraTime: 0.65, bfsTime: 0.22, dfsTime: 0.18, primTime: 0.82, kruskalTime: 0.95, bellmanFordTime: 2.10, aStarTime: 0.48, dijkstraOps: 245, bfsOps: 175, primOps: 310, kruskalOps: 410 },
    { vertexCount: 100, edgeCount: 290, dijkstraTime: 1.55, bfsTime: 0.48, dfsTime: 0.41, primTime: 2.10, kruskalTime: 2.35, bellmanFordTime: 6.80, aStarTime: 1.15, dijkstraOps: 620, bfsOps: 390, primOps: 780, kruskalOps: 1040 },
    { vertexCount: 150, edgeCount: 460, dijkstraTime: 2.80, bfsTime: 0.82, dfsTime: 0.73, primTime: 3.90, kruskalTime: 4.20, bellmanFordTime: 14.50, aStarTime: 2.10, dijkstraOps: 1050, bfsOps: 610, primOps: 1320, kruskalOps: 1780 },
    { vertexCount: 200, edgeCount: 680, dijkstraTime: 4.40, bfsTime: 1.25, dfsTime: 1.10, primTime: 6.20, kruskalTime: 6.55, bellmanFordTime: 26.00, aStarTime: 3.40, dijkstraOps: 1580, bfsOps: 880, primOps: 1980, kruskalOps: 2650 },
  ]);

  const [isRunningBenchmarks, setIsRunningBenchmarks] = useState<boolean>(false);

  const handleRunLiveBenchmarks = () => {
    setIsRunningBenchmarks(true);
    setTimeout(() => {
      try {
        const fresh = runEmpiricalBenchmarks([10, 25, 50, 100, 150, 200]);
        setBenchmarkData(fresh);
      } catch (err) {
        console.error(err);
      } finally {
        setIsRunningBenchmarks(false);
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Complexity Analyzer: Tripartite Algorithmic Metrics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          A rigorous comparative study delineating <strong>(1) Asymptotic Big-O Upper Bounds</strong>,{' '}
          <strong>(2) Exact Counted Machine Operations</strong>, and <strong>(3) Empirical Processor Wall-Clock Time (ms)</strong>.
        </p>
      </div>

      {/* Tripartite Distinction Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            1. Theoretical Big-O
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hardware-agnostic asymptotic limits as $|V|, |E| \to \infty$. Discards machine constants ($c$) and low-order terms.
          </p>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            2. Operation Counters
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exact integer counts of primitive operations: edge relaxations, key comparisons, heap adjustments, and DSU Find/Union calls.
          </p>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            3. Wall-Clock Time (ms)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Elapsed processor time measured via high-precision timers (`performance.now()`), incorporating CPU cache hits and V8 JIT behavior.
          </p>
        </div>
      </div>

      {/* Theoretical Complexity Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">
              Theoretical Asymptotic Bounds (CLRS & DAA Curriculum)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            |V| = Vertices, |E| = Edges
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="px-3.5 py-2.5 text-left">Algorithm</th>
                <th className="px-3.5 py-2.5 text-left">Paradigm</th>
                <th className="px-3.5 py-2.5 text-center font-mono">Best Case</th>
                <th className="px-3.5 py-2.5 text-center font-mono">Average Case</th>
                <th className="px-3.5 py-2.5 text-center font-mono">Worst Case</th>
                <th className="px-3.5 py-2.5 text-center font-mono">Auxiliary Space</th>
                <th className="px-3.5 py-2.5 text-left">Data Structure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {THEORETICAL_COMPLEXITIES.map(item => (
                <tr key={item.algorithm} className="hover:bg-slate-50">
                  <td className="px-3.5 py-2.5">
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.inventor}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-blue-700 font-medium">{item.paradigm}</td>
                  <td className="px-3.5 py-2.5 font-mono text-center text-emerald-700 bg-emerald-50/20">{item.timeBest}</td>
                  <td className="px-3.5 py-2.5 font-mono text-center text-blue-700 bg-blue-50/20 font-bold">{item.timeAvg}</td>
                  <td className="px-3.5 py-2.5 font-mono text-center text-rose-700 bg-rose-50/20">{item.timeWorst}</td>
                  <td className="px-3.5 py-2.5 font-mono text-center text-purple-700 font-bold">{item.spaceComplexity}</td>
                  <td className="px-3.5 py-2.5 text-slate-600 text-[11px] font-mono">{item.dataStructures}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empirical Benchmark Suite with Live Recharts */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Empirical Performance Curves (Input Size n vs. Wall-Clock Runtime)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Measured execution time in milliseconds across synthetic graphs (|V| = 10 to 200).
            </p>
          </div>

          <button
            onClick={handleRunLiveBenchmarks}
            disabled={isRunningBenchmarks}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs disabled:opacity-50 transition-colors"
          >
            {isRunningBenchmarks ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Benchmark Trials...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Live Benchmark Suite</span>
              </>
            )}
          </button>
        </div>

        {/* Recharts Performance Line Chart */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="vertexCount"
                label={{ value: 'Graph Order (|V|)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                label={{ value: 'Runtime (ms)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 11, fill: '#64748b' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.375rem',
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              <Line
                type="monotone"
                dataKey="dijkstraTime"
                name="Dijkstra (O((V+E)logV))"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="aStarTime"
                name="A* Search (Heuristic)"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="bfsTime"
                name="BFS (O(V+E))"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="dfsTime"
                name="DFS (O(V+E))"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="primTime"
                name="Prim MST (O(E log V))"
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="kruskalTime"
                name="Kruskal MST (O(E log E))"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Telemetry Table with Operation Counts */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Empirical Telemetry & Operation Counts</h4>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs font-mono text-center">
              <thead className="bg-slate-50 text-slate-700 font-sans font-semibold">
                <tr>
                  <th className="px-3 py-2">|V|</th>
                  <th className="px-3 py-2">|E|</th>
                  <th className="px-3 py-2 text-emerald-700">Dijkstra (ms / Ops)</th>
                  <th className="px-3 py-2 text-blue-700">A* (ms)</th>
                  <th className="px-3 py-2 text-sky-700">BFS (ms / Ops)</th>
                  <th className="px-3 py-2 text-amber-700">Prim (ms / Ops)</th>
                  <th className="px-3 py-2 text-rose-700">Kruskal (ms / Ops)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {benchmarkData.map(row => (
                  <tr key={row.vertexCount} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-bold text-slate-900">{row.vertexCount}</td>
                    <td className="px-3 py-2 text-slate-500">{row.edgeCount}</td>
                    <td className="px-3 py-2 text-emerald-700 font-semibold">
                      {row.dijkstraTime} ms <span className="text-slate-400 font-normal">({row.dijkstraOps || '—'} ops)</span>
                    </td>
                    <td className="px-3 py-2 text-blue-700 font-semibold">{row.aStarTime} ms</td>
                    <td className="px-3 py-2 text-sky-700 font-semibold">
                      {row.bfsTime} ms <span className="text-slate-400 font-normal">({row.bfsOps || '—'} ops)</span>
                    </td>
                    <td className="px-3 py-2 text-amber-700 font-semibold">
                      {row.primTime} ms <span className="text-slate-400 font-normal">({row.primOps || '—'} ops)</span>
                    </td>
                    <td className="px-3 py-2 text-rose-700 font-semibold">
                      {row.kruskalTime} ms <span className="text-slate-400 font-normal">({row.kruskalOps || '—'} ops)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
