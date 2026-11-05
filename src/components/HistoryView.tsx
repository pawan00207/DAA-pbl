/**
 * @file /src/components/HistoryView.tsx
 * @description Simulation History module displaying saved algorithm executions from LocalStorage,
 * with replay triggers, deletion, clear-all, and JSON telemetry export.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React from 'react';
import { SimulationRecord } from '../types/graph';
import {
  History,
  Trash2,
  PlayCircle,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  FolderOpen,
} from 'lucide-react';

interface HistoryViewProps {
  simulations: SimulationRecord[];
  onDeleteSimulation: (id: string) => void;
  onClearAllSimulations: () => void;
  onReplaySimulation: (record: SimulationRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  simulations,
  onDeleteSimulation,
  onClearAllSimulations,
  onReplaySimulation,
}) => {
  const handleExportHistory = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(simulations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `simulation_history_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Simulation Run History & Telemetry Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recorded executions persisted in browser LocalStorage. Reopen any run to inspect step traces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {simulations.length > 0 && (
            <>
              <button
                onClick={handleExportHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export JSON Log
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all saved simulation history?')) {
                    onClearAllSimulations();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 text-xs font-semibold rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Logs
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Simulation Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        {simulations.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No Simulations Recorded Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Whenever you execute an algorithm in the Algorithm Visualizer or Route Comparison module,
              it will automatically be logged here with its results and runtime performance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3.5 py-3 text-left">Timestamp</th>
                  <th className="px-3.5 py-3 text-left">Algorithm</th>
                  <th className="px-3.5 py-3 text-left">Graph Context</th>
                  <th className="px-3.5 py-3 text-center">Endpoints</th>
                  <th className="px-3.5 py-3 text-center">Status</th>
                  <th className="px-3.5 py-3 text-right font-mono">Cost / Weight</th>
                  <th className="px-3.5 py-3 text-right font-mono">Hops</th>
                  <th className="px-3.5 py-3 text-right font-mono">Runtime</th>
                  <th className="px-3.5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {simulations.map(sim => {
                  const dateStr = new Date(sim.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr key={sim.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 text-slate-500 font-mono whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 capitalize">
                          {sim.algorithm}
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5">
                        <div className="font-medium text-slate-800 truncate max-w-[150px]" title={sim.graphName}>
                          {sim.graphName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          |V|={sim.nodeCount}, |E|={sim.edgeCount} ({sim.isDirected ? 'Digraph' : 'Undirected'})
                        </div>
                      </td>

                      <td className="px-3.5 py-2.5 font-mono text-center text-slate-700 whitespace-nowrap">
                        {sim.sourceNode ? (
                          <span>
                            {sim.sourceNode} → {sim.targetNode || '*'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Global Tree</span>
                        )}
                      </td>

                      <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                        {sim.success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-semibold">
                            <XCircle className="w-3 h-3 text-red-600" />
                            Unreachable
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-2.5 font-mono text-right font-bold text-slate-800">
                        {sim.totalCost !== undefined ? sim.totalCost : '—'}
                      </td>

                      <td className="px-3.5 py-2.5 font-mono text-right text-slate-600">
                        {sim.hopCount !== undefined ? sim.hopCount : '—'}
                      </td>

                      <td className="px-3.5 py-2.5 font-mono text-right text-slate-600 whitespace-nowrap">
                        {sim.executionTimeMs} ms
                      </td>

                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onReplaySimulation(sim)}
                            title="Replay in Visualizer"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSimulation(sim.id)}
                            title="Delete this record"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
