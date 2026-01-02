
import React, { useState, useEffect } from 'react';
import { Chapter } from '../types';
import { Sparkles, Wand2, History, Loader2, Save, RotateCcw, MessageSquare, Lightbulb } from 'lucide-react';
import { refineChapter, getMuseSuggestion } from '../services/geminiService';

interface EditorProps {
  chapter: Chapter;
  onUpdate: (content: string) => void;
  onTitleUpdate: (title: string) => void;
  onCreateRevision: (label: string) => void;
  onRestoreRevision: (revId: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ chapter, onUpdate, onTitleUpdate, onCreateRevision, onRestoreRevision }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [museActive, setMuseActive] = useState(false);
  const [museSuggestion, setMuseSuggestion] = useState<string>('Analizando tu texto...');
  const [museLoading, setMuseLoading] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (museActive && chapter.content.length > 50) {
      setMuseLoading(true);
      timeout = setTimeout(async () => {
        try {
          const suggestion = await getMuseSuggestion(chapter.content, 'Ficción');
          if (suggestion) setMuseSuggestion(suggestion);
        } catch (e) {
          console.error(e);
        } finally {
          setMuseLoading(false);
        }
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [museActive, chapter.content]);

  const handleAiRefine = async () => {
    if (!aiInstruction.trim()) return;
    onCreateRevision(`Antes de: ${aiInstruction}`);
    setAiLoading(true);
    try {
      const refined = await refineChapter(chapter.content, aiInstruction);
      if (refined) onUpdate(refined);
      setShowAiModal(false);
      setAiInstruction('');
    } catch (error) {
      alert('Error en el asistente IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const wordCount = chapter.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full px-8 py-20 min-h-full flex flex-col">
          <input
            type="text"
            value={chapter.title}
            onChange={(e) => onTitleUpdate(e.target.value)}
            placeholder="Título del Capítulo..."
            className="text-5xl font-bold bg-transparent border-none focus:outline-none text-slate-100 serif-font mb-12 w-full placeholder:text-slate-800 selection:bg-indigo-500/30"
          />
          <textarea
            value={chapter.content}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Erase una vez..."
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-300 text-xl leading-[1.8] serif-font resize-none w-full placeholder:text-slate-800 selection:bg-indigo-500/30"
          />
        </div>

        {/* Muse Suggestions Popover (Floating) */}
        {museActive && (
          <div className="fixed bottom-24 right-8 w-64 bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Lightbulb size={14} className={museLoading ? "animate-pulse" : ""} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sugerencia de la Musa</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {museLoading ? 'Las musas están pensando...' : `"${museSuggestion}"`}
            </p>
          </div>
        )}

        {/* Floating Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full shadow-2xl flex items-center space-x-6 z-40">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => { onCreateRevision('Guardado manual'); }}
              className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition" title="Guardar Versión">
              <Save size={18} />
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition ${showHistory ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:bg-slate-800'}`} title="Historial">
              <History size={18} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-800" />
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAiModal(true)}
              className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold transition shadow-lg shadow-indigo-500/20"
            >
              <Sparkles size={16} />
              <span>Asistente IA</span>
            </button>
            <button 
              onClick={() => setMuseActive(!museActive)}
              className={`p-2 rounded-full transition ${museActive ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500 hover:bg-slate-800'}`} title="Modo Musa">
              <Lightbulb size={18} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-800" />
          
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            {wordCount} PALABRAS
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <aside className="w-80 border-l border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Historial de Revisiones</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-600 hover:text-white">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chapter.revisions.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <RotateCcw size={32} className="mx-auto mb-2" />
                <p className="text-[10px] uppercase font-bold">Sin revisiones aún</p>
              </div>
            ) : (
              chapter.revisions.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-indigo-400">{rev.timestamp}</span>
                    <button 
                      onClick={() => onRestoreRevision(rev.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-tighter transition opacity-0 group-hover:opacity-100">
                      Restaurar
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{rev.label}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      {/* AI Refinement Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                <Wand2 size={24} />
              </div>
              <h3 className="font-bold text-xl text-slate-100 serif-font">Refinar Manuscrito</h3>
            </div>
            <textarea
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              placeholder="Instrucción para la IA... (ej: 'Haz el final más dramático' o 'Mejora el diálogo')"
              className="w-full h-40 bg-slate-800 border border-slate-700 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-sm resize-none"
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowAiModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-300">Cancelar</button>
              <button 
                disabled={aiLoading || !aiInstruction}
                onClick={handleAiRefine}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center space-x-2 shadow-xl shadow-indigo-600/20"
              >
                {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>{aiLoading ? 'Pulimentando...' : 'Aplicar Mejora'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
