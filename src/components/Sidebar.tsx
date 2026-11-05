/**
 * @file /src/components/Sidebar.tsx
 * @description Sidebar matching the reference screenshot:
 * - Brand lockup with compass logo
 * - CSE Semester V • DAA Lab pill
 * - ALGORITHMS & TOOLS nav items with blue dot on active item
 * - Rocket Promo card ("Explore Algorithms - Build Smarter Routes - Learn More ->")
 * - Pawan Singh developer profile card
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA - CS301)
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
  X,
  Compass,
  ChevronRight,
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

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor' as ActiveTab, label: 'Graph Editor', icon: Network },
    { id: 'visualizer' as ActiveTab, label: 'Algorithm Visualizer', icon: PlayCircle },
    { id: 'comparison' as ActiveTab, label: 'Route & MST Compare', icon: GitCompare },
    { id: 'complexity' as ActiveTab, label: 'Complexity Analyzer', icon: Activity },
    { id: 'learning' as ActiveTab, label: 'Learning Center', icon: BookOpen },
    { id: 'history' as ActiveTab, label: 'Simulation History', icon: History },
    { id: 'about' as ActiveTab, label: 'About & Documentation', icon: FileCode2 },
  ];

  const handleSelect = (id: ActiveTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/25 shrink-0">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-[14px] text-slate-900 tracking-tight block">
                  SMART ROUTE
                </span>
                <span className="text-[10px] font-medium text-slate-400 block">
                  Optimization System
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Academic Context Badge */}
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-2 text-xs text-slate-600">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-[11px] font-semibold text-slate-700 truncate">
              CSE Semester V <span className="text-slate-300">•</span> DAA Lab
            </div>
          </div>

          {/* ALGORITHMS & TOOLS Navigation Group */}
          <div className="pt-1">
            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ALGORITHMS &amp; TOOLS
            </div>

            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left group cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/90 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {/* Glowing Blue Dot on active item */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Rocket Promo Card */}
          <div className="pt-2">
            <div
              onClick={() => handleSelect('learning')}
              className="rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow transition-shadow border border-blue-900/30"
            >
              <img
                src="/assets/rocket_promo.png"
                alt="Explore Algorithms - Build Smarter Routes"
                className="w-full h-auto object-cover block"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Profile Card: Pawan Singh */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <button
            onClick={() => handleSelect('about')}
            className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-left flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                PS
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Pawan Singh
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  B.Tech CSE • Developer
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
