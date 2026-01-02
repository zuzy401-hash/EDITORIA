
import React, { useState } from 'react';
import { Book, LayoutPreference } from '../types';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, Ruler, Sparkles, Loader2, Info, Grid, Type as TypeIcon, AlignJustify, MoveHorizontal, MoveVertical } from 'lucide-react';
import { suggestLayout } from '../services/geminiService';

interface LayoutPreviewProps {
  book: Book;
  onUpdateLayout?: (layout: LayoutPreference) => void;
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ book, onUpdateLayout }) => {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  const currentLayout = book.metadata.layoutPreference || {
    paperSize: 'Papel A5 (148 x 210 mm)',
    fontScale: 1,
    margins: '12%',
    columns: 1,
    lineHeight: 1.6,
    styleName: 'Estándar',
    fontFamily: 'serif'
  };

  const handleSuggestLayout = async () => {
    setIsSuggesting(true);
    try {
      const suggestion = await suggestLayout(book.metadata.genre, book.metadata.description);
      if (onUpdateLayout) onUpdateLayout(suggestion);
    } catch (error) {
      alert('Error al sugerir maquetación con IA.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const updatePreference = (key: keyof LayoutPreference, value: any) => {
    if (onUpdateLayout) {
      onUpdateLayout({ ...currentLayout, [key]: value });
    }
  };

  const allContent = book.chapters.map(c => `<h1 class="text-2xl font-bold mb-6 border-b border-slate-100 pb-2">${c.title}</h1><p class="mb-4 text-justify">${c.content.replace(/\n/g, '</p><p class="mb-4 text-justify">')}</p>`).join('');
  const simulatedPages = allContent.match(/.{1,1400}/gs) || ['Sin contenido aún...'];

  return (
    <div className="flex h-full bg-slate-900/10 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Scribus-style Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-600 rounded text-white shadow-lg shadow-orange-600/20">
                <Ruler size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-tighter text-slate-500 leading-none">Powered by</span>
                <span className="text-[11px] font-bold text-slate-200">Scribus Layout Engine</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-800" />

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowBaseline(!showBaseline)}
                className={`p-2 rounded transition ${showBaseline ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                title="Mostrar Rejilla Base"
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setShowInspector(!showInspector)}
                className={`p-2 rounded transition ${showInspector ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`} 
                title="Inspector de Maquetación"
              >
                <AlignJustify size={16} />
              </button>
            </div>

            <button 
              onClick={handleSuggestLayout}
              disabled={isSuggesting}
              className="flex items-center space-x-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition disabled:opacity-50"
            >
              {isSuggesting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span>Maquetación IA</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition"> <Minimize2 size={14} /> </button>
              <span className="text-[10px] font-mono px-3 text-slate-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition"> <Maximize2 size={14} /> </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-12 flex flex-col items-center custom-scrollbar bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="flex space-x-8">
            {[currentPage, currentPage + 1].map((pIdx) => (
              pIdx < simulatedPages.length && (
                <div 
                  key={pIdx}
                  style={{ 
                    width: `${480 * zoom}px`, 
                    height: `${680 * zoom}px`,
                    fontSize: `${13 * zoom * currentLayout.fontScale}px`,
                    padding: currentLayout.margins,
                    lineHeight: currentLayout.lineHeight,
                    fontFamily: currentLayout.fontFamily === 'serif' ? '"Lora", serif' : '"Inter", sans-serif',
                    backgroundImage: showBaseline ? 'linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px)' : 'none',
                    backgroundSize: `100% ${1.6 * 13 * zoom * currentLayout.fontScale}px`
                  }}
                  className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative flex flex-col text-slate-900 origin-top transition-all duration-300 overflow-hidden ring-1 ring-slate-200"
                >
                  {/* Trim Marks */}
                  <div className="absolute top-0 left-0 w-4 h-px bg-red-400/30" />
                  <div className="absolute top-0 left-0 w-px h-4 bg-red-400/30" />
                  <div className="absolute top-0 right-0 w-4 h-px bg-red-400/30" />
                  <div className="absolute top-0 right-0 w-px h-4 bg-red-400/30" />
                  
                  <div 
                    style={{ columnCount: currentLayout.columns, columnGap: '2rem' }}
                    className="flex-1 overflow-hidden prose prose-slate max-w-none text-justify"
                    dangerouslySetInnerHTML={{ __html: simulatedPages[pIdx] }}
                  />
                  
                  <div className="mt-8 flex justify-between items-center text-[0.6em] text-slate-400 border-t border-slate-100 pt-4 uppercase tracking-widest font-bold">
                    <span>{book.metadata.title}</span>
                    <span>Pág. {pIdx + 1}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-8 shadow-2xl z-10">
          <div className="flex items-center space-x-3 text-[10px] text-slate-500">
            <Info size={14} className="text-indigo-500" />
            <span>Perfil: <strong>{currentLayout.styleName}</strong></span>
          </div>
          <div className="flex items-center space-x-8">
            <button disabled={currentPage === 0} onClick={() => setCurrentPage(Math.max(0, currentPage - 2))} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white disabled:opacity-30 transition border border-slate-700">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
              PLIEGO {Math.floor(currentPage / 2) + 1} / {Math.ceil(simulatedPages.length / 2)}
            </span>
            <button disabled={currentPage >= simulatedPages.length - 2} onClick={() => setCurrentPage(Math.min(simulatedPages.length - 1, currentPage + 2))} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white disabled:opacity-30 transition border border-slate-700">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-[9px] font-bold text-green-500 uppercase flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>SLA v1.5 compatible</span>
          </div>
        </div>
      </div>

      {/* Manual Inspector Side Panel */}
      {showInspector && (
        <aside className="w-80 bg-slate-900 border-l border-slate-800 p-6 space-y-8 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Inspector DTP</h3>
            <button onClick={() => setShowInspector(false)} className="text-slate-600 hover:text-white">&times;</button>
          </div>

          <section className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <TypeIcon size={12} />
              <span>Cuerpo de Texto</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => updatePreference('fontFamily', 'serif')}
                className={`py-2 text-[10px] font-bold rounded-lg border transition uppercase ${currentLayout.fontFamily === 'serif' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
              >Serif</button>
              <button 
                onClick={() => updatePreference('fontFamily', 'sans')}
                className={`py-2 text-[10px] font-bold rounded-lg border transition uppercase ${currentLayout.fontFamily === 'sans' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
              >Sans</button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escala Fuente</label>
              <span className="text-[10px] font-mono text-indigo-400">{currentLayout.fontScale.toFixed(2)}x</span>
            </div>
            <input type="range" min="0.8" max="1.5" step="0.01" value={currentLayout.fontScale} onChange={(e) => updatePreference('fontScale', parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 appearance-none rounded-full accent-indigo-500" />
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Márgenes</label>
              <span className="text-[10px] font-mono text-indigo-400">{currentLayout.margins}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['8%', '12%', '15%'].map(m => (
                <button 
                  key={m}
                  onClick={() => updatePreference('margins', m)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition ${currentLayout.margins === m ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                >{m}</button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Columnas</label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map(c => (
                <button 
                  key={c}
                  onClick={() => updatePreference('columns', c)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition ${currentLayout.columns === c ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                >{c}</button>
              ))}
            </div>
          </section>

          <div className="pt-6 border-t border-slate-800">
             <div className="p-4 bg-orange-600/5 border border-orange-500/20 rounded-xl text-[10px] text-orange-400 leading-relaxed font-bold italic">
               Nota: Los cambios manuales anulan las sugerencias de la IA hasta que se reinicie el optimizador.
             </div>
          </div>
        </aside>
      )}
    </div>
  );
};
