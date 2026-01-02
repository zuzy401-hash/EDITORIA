
import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, ListTree, ArrowRight, Zap } from 'lucide-react';
import { generateStoryPlot } from '../services/geminiService';

interface BrainstormModalProps {
  onClose: () => void;
  onApply: (data: { title: string; plotSummary: string; chapters: { title: string; objective: string }[] }) => void;
}

export const BrainstormModal: React.FC<BrainstormModalProps> = ({ onClose, onApply }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await generateStoryPlot(prompt);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('El brainstorming falló. Las musas están en silencio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-indigo-600/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Arquitecto de Historias IA</h3>
              <p className="text-xs text-slate-500">Transforma la chispa de una idea en una estructura de manuscrito completa.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!result ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">La Chispa</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe tu idea de libro... Ej. 'Una historia de detectives ambientada en un mundo donde los recuerdos se pueden intercambiar como moneda'."
                  className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Consejo Pro</h4>
                  <p className="text-[11px] text-slate-500">Menciona el género, el tono y los temas clave para obtener mejores sugerencias estructurales.</p>
                </div>
                <button
                  disabled={loading || !prompt}
                  onClick={handleGenerate}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  <span>{loading ? 'Consultando a las musas...' : 'Generar Plano'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold text-slate-100 serif-font italic">"{result.title}"</h2>
                <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full" />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                  <BookOpen size={14} />
                  <span>La Trama</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                  {result.plotSummary}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                  <ListTree size={14} />
                  <span>Esquema de Capítulos</span>
                </h4>
                <div className="space-y-3">
                  {result.chapters.map((ch: any, i: number) => (
                    <div key={i} className="flex space-x-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-slate-700 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        {i < result.chapters.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-2 mb-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <h5 className="text-sm font-bold text-slate-200">{ch.title}</h5>
                        <p className="text-xs text-slate-500 mt-1">{ch.objective}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="p-6 bg-slate-800/50 border-t border-slate-800 flex justify-between items-center">
            <button 
              onClick={() => setResult(null)}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Empezar de nuevo
            </button>
            <button 
              onClick={() => onApply(result)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center space-x-2 shadow-xl shadow-indigo-600/20 transition group"
            >
              <span>Construir Manuscrito</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
