
import React, { useState } from 'react';
import { Book, BookMetadata, CoverStyle } from '../types';
import { Tag, Book as BookIcon, User, Globe, Hash, Info, Upload, Sparkles, Loader2, Image as ImageIcon, ShieldCheck, Scale, Calendar, Share2, Type, Sliders, Eye, Sun, Download, FileText, Smartphone, Layers } from 'lucide-react';
import { generateBookCover, suggestCoverStyle } from '../services/geminiService';

interface PublishViewProps {
  book: Book;
  onUpdateMetadata: (metadata: Partial<BookMetadata>) => void;
}

export const PublishView: React.FC<PublishViewProps> = ({ book, onUpdateMetadata }) => {
  const [generatingCover, setGeneratingCover] = useState(false);
  const [isSuggestingStyle, setIsSuggestingStyle] = useState(false);
  const [style, setStyle] = useState('minimalist oil painting');
  const [showShareModal, setShowShareModal] = useState(false);

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToScribus = () => {
    const slaMock = `<?xml version="1.0" encoding="UTF-8"?>\n<SCRIBUSUTF8NEW Version="1.5.0">\n<DOCUMENT Title="${book.metadata.title}" Author="${book.metadata.author}">\n<!-- Lumina Author Studio Export -->\n</DOCUMENT>\n</SCRIBUSUTF8NEW>`;
    downloadFile(`${book.metadata.title.replace(/\s+/g, '_')}.sla`, slaMock, 'application/x-scribus');
  };

  const exportToEpub = () => {
    const epubMock = `Mimetype: application/epub+zip\nTitle: ${book.metadata.title}\nCreator: ${book.metadata.author}\nIdentifier: ${book.metadata.isbn}\nPublisher: ${book.metadata.publisher}\n\n[Chapters: ${book.chapters.length}]`;
    downloadFile(`${book.metadata.title.replace(/\s+/g, '_')}.epub`, epubMock, 'application/epub+zip');
  };

  const handleGenerateCover = async () => {
    setGeneratingCover(true);
    try {
      const url = await generateBookCover(book.metadata.title, book.metadata.author, style);
      onUpdateMetadata({ coverUrl: url });
    } catch (error) {
      alert('La generación de portada falló.');
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleSuggestStyle = async () => {
    setIsSuggestingStyle(true);
    try {
      const suggestion = await suggestCoverStyle(book.metadata.title, book.metadata.genre, book.metadata.description);
      onUpdateMetadata({ 
        coverStyle: {
          typography: suggestion.typography,
          filter: suggestion.filter,
          overlayOpacity: suggestion.overlayOpacity
        }
      });
      setStyle(suggestion.visualPrompt);
    } catch (error) {
      alert('Error al sugerir estilo con IA.');
    } finally {
      setIsSuggestingStyle(false);
    }
  };

  const updateCoverStyle = (updates: Partial<CoverStyle>) => {
    onUpdateMetadata({ coverStyle: { ...book.metadata.coverStyle!, ...updates } });
  };

  const getFilterClass = () => {
    const s = book.metadata.coverStyle;
    if (!s) return '';
    switch (s.filter) {
      case 'sepia': return 'sepia-[0.6]';
      case 'vintage': return 'contrast-[1.1] brightness-[0.9] saturate-[0.7]';
      case 'noir': return 'grayscale contrast-[1.3]';
      case 'warm': return 'sepia-[0.3] saturate-[1.4] brightness-[1.05]';
      case 'cold': return 'hue-rotate-[180deg] saturate-[0.8] contrast-[1.1]';
      case 'high-contrast': return 'contrast-[1.6] brightness-[1.1]';
      case 'dreamy': return 'blur-[0.5px] brightness-[1.1] saturate-[1.2]';
      default: return '';
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto h-full flex flex-col space-y-12 overflow-y-auto custom-scrollbar pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-slate-100 mb-3 serif-font">Estudio de Lanzamiento</h2>
          <p className="text-slate-500 text-lg">Exportación profesional y catalogación avanzada Calibre.</p>
        </div>
        <button 
          onClick={() => setShowShareModal(true)}
          className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center space-x-3 hover:bg-indigo-400 hover:text-white transition-all shadow-xl">
          <Share2 size={18} />
          <span>Ficha de Preventa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Export Cards */}
          <section className="space-y-8 bg-slate-900/40 p-8 rounded-[32px] border border-slate-800">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center space-x-3">
              <Download size={16} />
              <span>Opciones de Exportación Profesional</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <ExportCard 
                    title="Paquete Scribus (.sla)" 
                    description="Exportación de maquetación vectorial DTP lista para prensa." 
                    icon={<FileText className="text-orange-500" />}
                    onClick={exportToScribus}
                />
                <ExportCard 
                    title="Calibre EPUB 3.0" 
                    description="Standard para eBooks con metadatos de serie inyectados." 
                    icon={<Smartphone className="text-blue-500" />}
                    onClick={exportToEpub}
                />
                <ExportCard 
                    title="PDF/X-1a Ready" 
                    description="Pre-prensa optimizada con marcas de corte y sangrado." 
                    icon={<BookIcon className="text-red-500" />}
                    onClick={() => alert('Generando PDF de pre-prensa...')}
                />
                <ExportCard 
                    title="Metadata XML Calibre" 
                    description="Fichero para importar catalogación en bases de datos externas." 
                    icon={<Layers className="text-violet-500" />}
                    onClick={() => downloadFile('metadata.xml', `<calibre>${JSON.stringify(book.metadata)}</calibre>`, 'text/xml')}
                />
            </div>
          </section>

          {/* Calibre Metadata Section */}
          <section className="space-y-8 bg-slate-900/40 p-8 rounded-[32px] border border-slate-800">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center space-x-3">
              <Sliders size={16} />
              <span>Catalogación Calibre (Metadatos)</span>
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <MetaInput label="Título Comercial" value={book.metadata.title} icon={<BookIcon size={14} />} onChange={t => onUpdateMetadata({title: t})} />
              <MetaInput label="Autor" value={book.metadata.author} icon={<User size={14} />} onChange={a => onUpdateMetadata({author: a})} />
              <MetaInput label="Serie / Colección" value={book.metadata.series || ''} icon={<Layers size={14} />} onChange={s => onUpdateMetadata({series: s})} />
              <MetaInput label="Índice de Serie" value={String(book.metadata.seriesIndex || 1)} icon={<Hash size={14} />} onChange={i => onUpdateMetadata({seriesIndex: parseInt(i) || 1})} />
              <MetaInput label="ISBN" value={book.metadata.isbn} icon={<Hash size={14} />} onChange={i => onUpdateMetadata({isbn: i})} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                  <Tag size={12} />
                  <span>Género</span>
                </label>
                <select value={book.metadata.genre} onChange={(e) => onUpdateMetadata({ genre: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition appearance-none">
                  <option>Ficción</option><option>Poesía</option><option>Thriller</option><option>Ensayo</option>
                  <option>Fantasía</option><option>Ciencia Ficción</option><option>Biografía</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Cover Inspector */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-8 space-y-8">
            <div className="relative group">
               <div className="absolute -inset-4 bg-indigo-500/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
               <div className="relative aspect-[3/4] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-800">
                 {book.metadata.coverUrl ? (
                    <img src={book.metadata.coverUrl} className={`w-full h-full object-cover transition-all duration-700 ${getFilterClass()}`} />
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                      <ImageIcon size={64} className="mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Esperando Arte</p>
                    </div>
                 )}
                 <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none text-center transition-all duration-500" style={{ backgroundColor: `rgba(0,0,0,${book.metadata.coverStyle?.overlayOpacity ?? 0.4})` }}>
                    <div className={`text-white font-bold drop-shadow-2xl transition-all duration-500 ${book.metadata.coverStyle?.typography === 'serif' ? 'serif-font text-4xl' : book.metadata.coverStyle?.typography === 'script' ? 'italic text-5xl' : 'font-black text-3xl uppercase tracking-tighter'}`}>
                      {book.metadata.title}
                    </div>
                    <div className="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] drop-shadow-md">
                      {book.metadata.author}
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center space-x-2">
                  <Type size={14} />
                  <span>Estética del Libro</span>
                </h4>
                <button onClick={handleSuggestStyle} disabled={isSuggestingStyle} className="text-[9px] font-bold text-indigo-400 flex items-center space-x-1 hover:text-indigo-300 transition">
                  {isSuggestingStyle ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  <span>Sugerir Estilo IA</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-600 uppercase">Tipografía</label>
                  <select value={book.metadata.coverStyle?.typography} onChange={(e) => updateCoverStyle({typography: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300">
                    <option value="serif">Elegante Serif</option>
                    <option value="sans">Moderna Sans</option>
                    <option value="script">Manuscrita</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-600 uppercase">Filtro</label>
                  <select value={book.metadata.coverStyle?.filter} onChange={(e) => updateCoverStyle({filter: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300">
                    <option value="none">Normal</option>
                    <option value="sepia">Sepia</option>
                    <option value="vintage">Vintage</option>
                    <option value="noir">Noir</option>
                    <option value="warm">Cálido</option>
                    <option value="cold">Frío</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-600 uppercase">Superposición de Color</label>
                  <span className="text-[10px] font-mono text-indigo-400">{Math.round((book.metadata.coverStyle?.overlayOpacity ?? 0.4) * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={book.metadata.coverStyle?.overlayOpacity ?? 0.4} onChange={(e) => updateCoverStyle({overlayOpacity: parseFloat(e.target.value)})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>

              <button onClick={handleGenerateCover} disabled={generatingCover} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 transition-all shadow-xl shadow-indigo-600/20">
                {generatingCover ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{generatingCover ? 'Renderizando...' : 'Generar Portada'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaInput: React.FC<{label: string, value: string, icon: React.ReactNode, onChange: (v: string) => void}> = ({label, value, icon, onChange}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </label>
    <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition" />
  </div>
);

const ExportCard: React.FC<{title: string, description: string, icon: React.ReactNode, onClick: () => void}> = ({title, description, icon, onClick}) => (
    <button onClick={onClick} className="text-left bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
        <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="text-[11px] font-black text-slate-100 uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">{description}</p>
    </button>
);
