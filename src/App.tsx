/**
 * @file /src/App.tsx
 * @description Main application controller for SMART ROUTE OPTIMIZATION SYSTEM.
 * Modern light-theme Linear-style engineering workbench layout with fixed left sidebar,
 * top header bar, toast notifications, error boundary, and printable report modal.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA) Laboratory Project.
 */

import React, { useState, useEffect } from 'react';
import { GraphData, SimulationRecord } from './types/graph';
import { SAMPLE_GRAPHS } from './data/sampleGraphs';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './components/Dashboard';
import { GraphEditor } from './components/GraphEditor';
import { AlgorithmVisualizer } from './components/AlgorithmVisualizer';
import { RouteComparison } from './components/RouteComparison';
import { ComplexityAnalyzer } from './components/ComplexityAnalyzer';
import { LearningCenter } from './components/LearningCenter';
import { HistoryView } from './components/HistoryView';
import { AboutProject } from './components/AboutProject';
import { ToastProvider, useToast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ReportModal } from './components/ReportModal';
import { runDijkstra } from './algorithms/dijkstra';

const STORAGE_SIMULATIONS_KEY = 'smart_route_simulations_v1';
const STORAGE_CURRENT_GRAPH_KEY = 'smart_route_current_graph_v1';

function AppContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Load initial graph from LocalStorage or default to Delhi Transit
  const [currentGraph, setCurrentGraph] = useState<GraphData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_GRAPH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved graph:', e);
    }
    return SAMPLE_GRAPHS[0];
  });

  // Source and Target nodes
  const [sourceNodeId, setSourceNodeId] = useState<string>(() => {
    return currentGraph.nodes.length > 0 ? currentGraph.nodes[0].id : 'CP';
  });

  const [targetNodeId, setTargetNodeId] = useState<string>(() => {
    return currentGraph.nodes.length > 3 ? currentGraph.nodes[3].id : 'NOI';
  });

  // Simulation History
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SIMULATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load simulations:', e);
    }
    return [
      {
        id: 'sim_init_1',
        timestamp: Date.now() - 3600000,
        algorithm: 'dijkstra',
        graphName: 'Delhi NCR Transit Network',
        nodeCount: 8,
        edgeCount: 12,
        isDirected: false,
        sourceNode: 'KG',
        targetNode: 'NOI',
        success: true,
        totalCost: 21,
        hopCount: 2,
        executionTimeMs: 0.15,
        message: 'Optimal shortest path found: KG → ANV → NOI with total weighted cost = 21.',
      },
      {
        id: 'sim_init_2',
        timestamp: Date.now() - 1800000,
        algorithm: 'bfs',
        graphName: 'Delhi NCR Transit Network',
        nodeCount: 8,
        edgeCount: 12,
        isDirected: false,
        sourceNode: 'KG',
        targetNode: 'NOI',
        success: true,
        totalCost: 21,
        hopCount: 2,
        executionTimeMs: 0.08,
        message: 'BFS found minimum-hop path: KG → ANV → NOI (2 hops, total weighted cost = 21).',
      },
    ];
  });

  // Keyboard shortcut listener for '?'
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Save graph changes to LocalStorage
  const handleUpdateGraph = (updated: GraphData) => {
    setCurrentGraph(updated);
    try {
      localStorage.setItem(STORAGE_CURRENT_GRAPH_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save graph:', e);
    }

    if (updated.nodes.length > 0 && !updated.nodes.some(n => n.id === sourceNodeId)) {
      setSourceNodeId(updated.nodes[0].id);
    }
    if (updated.nodes.length > 1 && !updated.nodes.some(n => n.id === targetNodeId)) {
      setTargetNodeId(updated.nodes[updated.nodes.length - 1].id);
    }
  };

  const handleRecordSimulation = (record: SimulationRecord) => {
    setSimulations(prev => {
      const updated = [record, ...prev.filter(r => r.id !== record.id)].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_SIMULATIONS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save simulations:', e);
      }
      return updated;
    });
  };

  const handleDeleteSimulation = (id: string) => {
    setSimulations(prev => {
      const updated = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem(STORAGE_SIMULATIONS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update simulations:', e);
      }
      return updated;
    });
    showToast('Simulation record deleted', 'info');
  };

  const handleClearAllSimulations = () => {
    setSimulations([]);
    try {
      localStorage.removeItem(STORAGE_SIMULATIONS_KEY);
    } catch (e) {
      console.error('Failed to clear simulations:', e);
    }
    showToast('Simulation history cleared', 'info');
  };

  const handleReplaySimulation = (record: SimulationRecord) => {
    if (record.sourceNode) setSourceNodeId(record.sourceNode);
    if (record.targetNode) setTargetNodeId(record.targetNode);
    setActiveTab('visualizer');
    showToast(`Replaying ${record.algorithm.toUpperCase()} simulation`, 'info');
  };

  const handleLoadPresetGraph = (preset: GraphData) => {
    handleUpdateGraph(preset);
    if (preset.nodes.length > 0) setSourceNodeId(preset.nodes[0].id);
    if (preset.nodes.length > 1) setTargetNodeId(preset.nodes[preset.nodes.length - 1].id);
    showToast(`Loaded topology: ${preset.name}`, 'success');
  };

  // Pre-generate current algorithm result for report modal
  const activeReportResult = runDijkstra(currentGraph, sourceNodeId, targetNodeId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Fixed Left Sidebar on Desktop */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Slim Top Header */}
        <TopHeader
          activeTab={activeTab}
          graphName={currentGraph.name}
          nodeCount={currentGraph.nodes.length}
          edgeCount={currentGraph.edges.length}
          isDirected={currentGraph.isDirected}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          onNavigateToVisualizer={() => setActiveTab('visualizer')}
          onLoadGraph={handleLoadPresetGraph}
        />

        {/* Dynamic Module Outlet with ErrorBoundary */}
        <main className="flex-1 px-4 sm:px-8 pb-8 pt-2 w-full">
          <ErrorBoundary>
            {activeTab === 'dashboard' && (
              <Dashboard
                currentGraph={currentGraph}
                onLoadGraph={handleLoadPresetGraph}
                onNavigateToVisualizer={() => setActiveTab('visualizer')}
                onNavigateToEditor={() => setActiveTab('editor')}
                onNavigateToComparison={() => setActiveTab('comparison')}
                onNavigateToComplexity={() => setActiveTab('complexity')}
                onNavigateToHistory={() => setActiveTab('history')}
                simulations={simulations}
              />
            )}

            {activeTab === 'editor' && (
              <GraphEditor
                graph={currentGraph}
                onUpdateGraph={handleUpdateGraph}
                sourceNodeId={sourceNodeId}
                targetNodeId={targetNodeId}
                onSelectSource={setSourceNodeId}
                onSelectTarget={setTargetNodeId}
              />
            )}

            {activeTab === 'visualizer' && (
              <AlgorithmVisualizer
                graph={currentGraph}
                onUpdateGraph={handleUpdateGraph}
                sourceNodeId={sourceNodeId}
                targetNodeId={targetNodeId}
                onSelectSource={setSourceNodeId}
                onSelectTarget={setTargetNodeId}
                onRecordSimulation={handleRecordSimulation}
              />
            )}

            {activeTab === 'comparison' && (
              <RouteComparison
                graph={currentGraph}
                sourceNodeId={sourceNodeId}
                targetNodeId={targetNodeId}
                onSelectSource={setSourceNodeId}
                onSelectTarget={setTargetNodeId}
                onUpdateGraph={handleUpdateGraph}
              />
            )}

            {activeTab === 'complexity' && <ComplexityAnalyzer />}

            {activeTab === 'learning' && <LearningCenter />}

            {activeTab === 'history' && (
              <HistoryView
                simulations={simulations}
                onDeleteSimulation={handleDeleteSimulation}
                onClearAllSimulations={handleClearAllSimulations}
                onReplaySimulation={handleReplaySimulation}
              />
            )}

            {activeTab === 'about' && <AboutProject />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Modals */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        graph={currentGraph}
        algorithmResult={activeReportResult}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
