
import React from 'react';
import { Book } from '../types';
import { Grid, List, Search, Filter, BookText, Download, Trash2, Clock, Sparkles, Database, RefreshCw, Share2 } from 'lucide-react';

interface LibraryViewProps {
  book: Book;
  onTriggerAI: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ book, onTriggerAI }) => {
  return (
    <div className="p-10 h-full flex flex-col space-y-8 bg-slate-950/40 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-900/20 text-white">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-100 serif-font">Repositorio Calibre</h2>
            <p className="text-slate-500 text-sm mt-1">Gestión avanzada de metadatos y sincronización de bibliotecas.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition border border-slate-700 shadow-xl">
            <RefreshCw size={14} />
            <span>Sincronizar Calibre</span>
          </button>
          <button onClick={onTriggerAI} className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-500/20 transition-all shadow-lg shadow-indigo-500/5">
            <Sparkles size={16} />
            <span>Asistente de Catalogación</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-3 text-slate-600" />
          <input 
            type="text" 
            placeholder="Filtrar por ISBN, Serie o Autor (Estándar Calibre)..."
            className="w-full bg-transparent border-none py-2.5 pl-12 text-sm focus:outline-none text-slate-300 placeholder:text-slate-700"
          />
        </div>
        <button className="px-6 py-2 flex items-center space-x-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition">
          <Filter size={14} />
          <span>Filtros OPDS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Active Book Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden hover:border-indigo-500/40 transition-all group flex flex-col h-[560px] shadow-2xl hover:shadow-indigo-500/5">
          <div className="relative h-64 bg-slate-800 overflow-hidden">
            {book.metadata.coverUrl ? (
              <img src={book.metadata.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950">
                <BookText size={64} className="text-slate-800 opacity-50" />
              </div>
            )}
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 text-white text-[9px] font-black rounded-lg shadow-lg uppercase tracking-widest">Base Calibre v2</div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full shadow-lg uppercase tracking-tighter">Manuscrito</div>
          </div>
          
          <div className="p-8 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-100 mb-1 truncate serif-font text-2xl group-hover:text-indigo-300 transition-colors">{book.metadata.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
                <span className="font-bold text-indigo-400">{book.metadata.author}</span>
                <span className="opacity-30">|</span>
                <span>ISBN: {book.metadata.isbn}</span>
            </div>
            
            <div className="flex-1">
               <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed italic opacity-80">
                 {book.metadata.description}
               </p>
               <div className="flex flex-wrap gap-2 mb-6">
                   {book.metadata.tags.map((tag, i) => (
                       <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700 uppercase font-bold tracking-tighter">#{tag}</span>
                   ))}
               </div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-6 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
              <div className="flex items-center space-x-2">
                <Clock size={12} className="text-indigo-400" />
                <span>Última mod: Hoy</span>
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 px-2 rounded">{book.chapters.length} Entradas</span>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 border border-indigo-400/20">Abrir Editor</button>
              <button className="p-3 bg-slate-800 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-xl transition border border-slate-700 group/btn" title="Exportar Metadatos Calibre (XML)">
                <Share2 size={18} />
              </button>
              <button className="p-3 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition border border-slate-700 group/btn" title="Eliminar de DB">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* New Book via AI */}
        <button 
          onClick={onTriggerAI}
          className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[32px] h-[560px] flex flex-col items-center justify-center space-y-6 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-slate-700 hover:text-indigo-400 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-8 bg-slate-800 rounded-[32px] group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all shadow-xl group-hover:shadow-indigo-500/5">
            <Sparkles size={48} />
          </div>
          <div className="text-center z-10 px-8">
            <span className="block text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">Nuevo Proyecto IA</span>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3 opacity-50 group-hover:opacity-100 transition-opacity leading-relaxed max-w-[200px] mx-auto">
                Generación automática de estructura y metadatos bibliográficos
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
