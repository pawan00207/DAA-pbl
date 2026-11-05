/**
 * @file /src/components/ReportModal.tsx
 * @description Academic Laboratory Project Simulation Report Modal with print-friendly layout.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React from 'react';
import { GraphData, AlgorithmResult } from '../types/graph';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  graph: GraphData;
  algorithmResult: AlgorithmResult | null;
  sourceNodeId?: string;
  targetNodeId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  graph,
  algorithmResult,
  sourceNodeId,
  targetNodeId,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 w-full max-w-3xl my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Academic Laboratory Run Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="mt-6 space-y-6 text-slate-800 text-xs">
          {/* Institution & Course Banner */}
          <div className="border-b border-slate-300 pb-4 text-center space-y-1">
            <h1 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              SMART ROUTE OPTIMIZATION SYSTEM
            </h1>
            <p className="text-xs text-slate-600">
              Department of Computer Science & Engineering • Semester V
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              Course: Design and Analysis of Algorithms (DAA - CS301) | Date: {currentDate}
            </p>
          </div>

          {/* Graph Model Telemetry */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Graph Topology</span>
              <span className="font-bold text-slate-900 text-sm">{graph.name}</span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                |V| = {graph.nodes.length} Vertices, |E| = {graph.edges.length} Edges ({graph.isDirected ? 'Directed' : 'Undirected'})
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Simulated Algorithm</span>
              <span className="font-bold text-blue-700 text-sm capitalize">
                {algorithmResult?.algorithm || 'None'}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Terminals: {sourceNodeId || 'N/A'} → {targetNodeId || 'N/A'}
              </p>
            </div>
          </div>

          {/* Execution Metrics & Operation Counts */}
          {algorithmResult && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wide">
                1. Empirical Verification & Operation Telemetry
              </h4>
              <div className="grid grid-cols-4 gap-3 text-center font-mono">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-sans block">Execution Time</span>
                  <span className="font-bold text-slate-900 text-sm">{algorithmResult.executionTimeMs} ms</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-sans block">Total Cost / Weight</span>
                  <span className="font-bold text-emerald-700 text-sm">{algorithmResult.totalCost ?? 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-sans block">Relaxations</span>
                  <span className="font-bold text-blue-700 text-sm">{algorithmResult.operations.relaxations}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-sans block">Comparisons</span>
                  <span className="font-bold text-purple-700 text-sm">{algorithmResult.operations.comparisons}</span>
                </div>
              </div>

              {algorithmResult.path && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]">
                  <strong>Computed Optimal Path:</strong> {algorithmResult.path.join(' → ')} ({algorithmResult.hopCount} hops)
                </div>
              )}
            </div>
          )}

          {/* Adjacency Matrix Snapshot */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wide">
              2. Graph Adjacency List Structure
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] max-h-48 overflow-y-auto">
              {graph.nodes.map(node => {
                const neighbors = graph.edges.filter(e =>
                  graph.isDirected
                    ? e.source === node.id
                    : e.source === node.id || e.target === node.id
                );
                return (
                  <div key={node.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <strong className="text-blue-700">{node.label}:</strong>{' '}
                    {neighbors.map(e => (e.source === node.id ? e.target : e.source) + `(${e.weight})`).join(', ') || 'None'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Signature Block */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500 font-mono">
            <div>
              <p>Verified by DAA Laboratory Evaluator</p>
              <div className="w-44 border-b border-slate-400 mt-8"></div>
              <p className="mt-1">Faculty Signature & Date</p>
            </div>
            <div className="text-right">
              <p>Student Roll No. / Signature</p>
              <div className="w-44 border-b border-slate-400 mt-8 ml-auto"></div>
              <p className="mt-1">CSE Semester V</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
