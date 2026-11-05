/**
 * @file /src/components/TopHeader.tsx
 * @description Top header bar matching the user's reference mockup:
 * Row 1: Breadcrumb (Home > Tab) on left, Status + Dropdown + Shortcuts + Lab Report + Visualizer on right.
 * Row 2: Large Title ("Smart Route Optimization System") + Subtitle ("Visualize • Analyze • Optimize • Compare").
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA - CS301)
 */

import React from 'react';
import { ActiveTab } from './Sidebar';
import {
  Menu,
  HelpCircle,
  FileText,
  Play,
  Home,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { GraphData } from '../types/graph';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs';

interface TopHeaderProps {
  activeTab: ActiveTab;
  graphName: string;
  nodeCount: number;
  edgeCount: number;
  isDirected: boolean;
  onOpenMobileSidebar: () => void;
  onOpenShortcuts: () => void;
  onOpenReport: () => void;
  onNavigateToVisualizer: () => void;
  onLoadGraph?: (graph: GraphData) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  graphName,
  onOpenMobileSidebar,
  onOpenShortcuts,
  onOpenReport,
  onNavigateToVisualizer,
  onLoadGraph,
}) => {
  const tabTitles: Record<ActiveTab, { title: string; subtitle: string; label: string }> = {
    dashboard: {
      label: 'Dashboard',
      title: 'Smart Route Optimization System',
      subtitle: 'Visualize • Analyze • Optimize • Compare',
    },
    editor: {
      label: 'Graph Editor',
      title: 'Interactive Graph Editor',
      subtitle: 'Construct • Modify • Edit Weights • Inspect Adjacency',
    },
    visualizer: {
      label: 'Algorithm Visualizer',
      title: 'Algorithm Visualizer',
      subtitle: 'Step Playback • Priority Queue • Distance Relaxation',
    },
    comparison: {
      label: 'Route Comparison',
      title: 'Route & MST Comparison',
      subtitle: 'Dijkstra vs BFS vs DFS • Prim vs Kruskal MST',
    },
    complexity: {
      label: 'Complexity Analyzer',
      title: 'Complexity Analyzer',
      subtitle: 'Asymptotic Bounds • Machine Operations • CPU Benchmarks',
    },
    learning: {
      label: 'Learning Center',
      title: 'DAA Learning Center',
      subtitle: 'CLRS Pseudocode • Invariants • Viva Voce Q&A',
    },
    history: {
      label: 'Simulation History',
      title: 'Simulation History',
      subtitle: 'Audit Logs • Session Telemetry • Execution Replay',
    },
    about: {
      label: 'About Project',
      title: 'About & Project Documentation',
      subtitle: 'Academic Specifications • Test Suites • Developer Profile',
    },
  };

  const currentMeta = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <div className="px-4 sm:px-8 pt-5 pb-2 space-y-2">
      {/* Row 1: Breadcrumbs on Left, Telemetry & Action Buttons on Right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Home className="w-3.5 h-3.5 text-blue-600" />
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-700 font-medium">{currentMeta.label}</span>
          </div>
        </div>

        {/* Right Controls matching screenshot */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* System Online Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Online</span>
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <select
              value={graphName}
              onChange={e => {
                const selected = SAMPLE_GRAPHS.find(g => g.name === e.target.value);
                if (selected && onLoadGraph) onLoadGraph(selected);
              }}
              className="appearance-none pl-3.5 pr-8 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-medium text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              {SAMPLE_GRAPHS.map(g => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Shortcuts Icon Button (?) */}
          <button
            onClick={onOpenShortcuts}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center text-xs shadow-2xs transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Lab Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200/90 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Generate Academic Lab Evaluation Report"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Lab Report</span>
          </button>

          {/* Visualizer ▶ Button */}
          <button
            onClick={onNavigateToVisualizer}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Visualizer</span>
          </button>
        </div>
      </div>

      {/* Row 2: Title and Subtitle matching reference screenshot */}
      <div className="pt-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {currentMeta.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {currentMeta.subtitle}
        </p>
      </div>
    </div>
  );
};
