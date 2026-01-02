
import React from 'react';
import { Chapter } from '../types';
import { Plus, List, Search } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chapters, activeId, onSelect, onAdd }) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manuscrito</h2>
          <button 
            onClick={onAdd}
            className="p-1 hover:bg-slate-800 rounded transition text-indigo-400"
            title="Nuevo Capítulo"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-600" size={14} />
          <input 
            type="text" 
            placeholder="Buscar escena..." 
            className="w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapters.map((chapter, idx) => (
          <button
            key={chapter.id}
            onClick={() => onSelect(chapter.id)}
            className={`w-full text-left p-3 rounded-lg group transition ${
              activeId === chapter.id 
                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                : 'hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className={`text-[10px] font-mono mt-0.5 ${activeId === chapter.id ? 'text-indigo-500' : 'text-slate-600'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{chapter.title || 'Capítulo sin título'}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {chapter.content.length > 0 ? `${Math.ceil(chapter.content.split(' ').length)} palabras` : 'Vacío'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Progreso del Proyecto</span>
          <span>4%</span>
        </div>
        <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
          <div className="bg-indigo-500 h-full w-[4%]" />
        </div>
      </div>
    </aside>
  );
};
