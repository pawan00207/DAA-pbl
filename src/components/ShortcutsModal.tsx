/**
 * @file /src/components/ShortcutsModal.tsx
 * @description Dialog showing workbench keyboard shortcuts (Space, Arrows, R, Z, Y, ?).
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause algorithm execution in Visualizer' },
    { key: '→ (Right Arrow)', desc: 'Next step forward' },
    { key: '← (Left Arrow)', desc: 'Previous step backward' },
    { key: 'R', desc: 'Restart visualizer to Step 0' },
    { key: 'Ctrl + Z (⌘Z)', desc: 'Undo graph change in Editor (up to 25 steps)' },
    { key: 'Ctrl + Y (⌘⇧Z)', desc: 'Redo graph change in Editor' },
    { key: '?', desc: 'Toggle keyboard shortcuts dialog' },
    { key: 'Esc', desc: 'Close dialogs or cancel active edge creation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Workbench Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">{item.desc}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-800 shadow-2xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
