/**
 * @file /src/components/Navbar.tsx
 * @description Academic navigation header with module tabs, project credentials, and graph status.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React from 'react';
import {
  LayoutDashboard,
  Network,
  PlayCircle,
  GitCompare,
  Activity,
  BookOpen,
  History,
  FileCode2,
  GraduationCap,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'editor'
  | 'visualizer'
  | 'comparison'
  | 'complexity'
  | 'learning'
  | 'history'
  | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  nodeCount: number;
  edgeCount: number;
  isDirected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  nodeCount,
  edgeCount,
  isDirected,
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor' as ActiveTab, label: 'Graph Editor', icon: Network },
    { id: 'visualizer' as ActiveTab, label: 'Algorithm Visualizer', icon: PlayCircle },
    { id: 'comparison' as ActiveTab, label: 'Route Comparison', icon: GitCompare },
    { id: 'complexity' as ActiveTab, label: 'Complexity Analyzer', icon: Activity },
    { id: 'learning' as ActiveTab, label: 'Learning Center', icon: BookOpen },
    { id: 'history' as ActiveTab, label: 'Simulation History', icon: History },
    { id: 'about' as ActiveTab, label: 'About & Project Specs', icon: FileCode2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Academic Banner */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="font-semibold tracking-wide text-slate-100">
            B.Tech Computer Science & Engineering
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Semester V — Design and Analysis of Algorithms (DAA)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-300 font-mono text-[11px]">
          <span>
            Graph State:{' '}
            <strong className="text-white">
              {nodeCount} Nodes, {edgeCount} Edges
            </strong>
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-sans">
            {isDirected ? 'Directed Graph (Digraph)' : 'Undirected Graph'}
          </span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold text-lg font-mono">
            SO
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              SMART ROUTE OPTIMIZATION SYSTEM
            </h1>
            <p className="text-xs text-slate-500">
              Interactive Graph Algorithms & Asymptotic Complexity Workbench
            </p>
          </div>
        </div>

        {/* Quick Nav Badges */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onSelectTab('visualizer')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Launch Visualizer
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-white border-t border-slate-100 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
