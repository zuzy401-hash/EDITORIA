
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { LayoutPreview } from './components/LayoutPreview';
import { PublishView } from './components/PublishView';
import { LibraryView } from './components/LibraryView';
import { BrainstormModal } from './components/BrainstormModal';
import { AuthView } from './components/AuthView';
import { ViewMode, Book, Chapter, User, LayoutPreference, Revision } from './types';
import { BookOpen, Edit3, Layout, Send, Save, Plus, LogOut, Clock, User as UserIcon, Share2, CheckCircle2 } from 'lucide-react';

const INITIAL_BOOK: Book = {
  id: '1',
  metadata: {
    title: 'Nuevo Proyecto de Libro',
    author: 'Autor Desconocido',
    publisher: 'Lumina Press',
    isbn: 'Pendiente',
    genre: 'Ficción',
    language: 'Español',
    description: 'Una nueva aventura esperando ser escrita...',
    tags: ['borrador'],
    copyrightHolder: '',
    copyrightYear: new Date().getFullYear().toString(),
    license: 'Todos los derechos reservados',
    legalNotice: '',
    coverStyle: { typography: 'serif', filter: 'none', overlayOpacity: 0.4 },
    layoutPreference: {
      paperSize: 'Papel A5 (148 x 210 mm)',
      fontScale: 1,
      margins: '12%',
      columns: 1,
      lineHeight: 1.6,
      styleName: 'Estándar',
      fontFamily: 'serif'
    }
  },
  chapters: [
    { id: 'c1', title: 'Capítulo 1: El Comienzo', content: '', revisions: [] }
  ]
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Write);
  const [book, setBook] = useState<Book>(INITIAL_BOOK);
  const [activeChapterId, setActiveChapterId] = useState<string>(INITIAL_BOOK.chapters[0].id);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load User and Book from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedBook = localStorage.getItem('lumina_active_book');
    if (savedBook) {
      try {
        const parsed = JSON.parse(savedBook);
        setBook(parsed);
        if (parsed.chapters?.length > 0) setActiveChapterId(parsed.chapters[0].id);
      } catch (e) {
        console.error("Error loading book", e);
      }
    }
  }, []);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      localStorage.setItem('lumina_active_book', JSON.stringify({
        ...book,
        lastSaved: new Date().toISOString()
      }));
      setTimeout(() => setIsSaving(false), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [book]);

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem('lumina_user', JSON.stringify(userData));
    setBook(prev => ({
      ...prev,
      metadata: { ...prev.metadata, author: userData.name, copyrightHolder: userData.name }
    }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
  };

  const activeChapter = book.chapters.find(c => c.id === activeChapterId) || book.chapters[0];

  const createRevision = (chapterId: string, label: string) => {
    const target = book.chapters.find(c => c.id === chapterId);
    if (!target) return;
    
    const newRevision: Revision = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      content: target.content,
      label
    };

    setBook(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => 
        c.id === chapterId 
          ? { ...c, revisions: [newRevision, ...c.revisions].slice(0, 15) } 
          : c
      )
    }));
  };

  const restoreRevision = (chapterId: string, revisionId: string) => {
    setBook(prev => {
      const chapter = prev.chapters.find(c => c.id === chapterId);
      const revision = chapter?.revisions.find(r => r.id === revisionId);
      if (!revision) return prev;
      
      return {
        ...prev,
        chapters: prev.chapters.map(c => 
          c.id === chapterId ? { ...c, content: revision.content } : c
        )
      };
    });
  };

  const updateMetadata = useCallback((updates: any) => {
    setBook(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates }
    }));
  }, []);

  const updateChapterContent = useCallback((id: string, content: string) => {
    setBook(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => c.id === id ? { ...c, content } : c)
    }));
  }, []);

  const addChapter = () => {
    const newId = `c${Date.now()}`;
    const newChapter: Chapter = { id: newId, title: `Capítulo ${book.chapters.length + 1}`, content: '', revisions: [] };
    setBook(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
    setActiveChapterId(newId);
  };

  const handleApplyAIStructure = (data: any) => {
    const newChapters = data.chapters.map((ch: any, idx: number) => ({
      id: `ai-c${idx}-${Date.now()}`,
      title: ch.title,
      content: `[Objetivo: ${ch.objective}]\n\n`,
      revisions: []
    }));

    setBook({
      id: String(Date.now()),
      metadata: {
        ...book.metadata,
        title: data.title,
        description: data.plotSummary,
      },
      chapters: newChapters,
      lastSaved: new Date().toISOString()
    });
    setActiveChapterId(newChapters[0].id);
    setShowBrainstorm(false);
    setCurrentView(ViewMode.Write);
  };

  if (!user) return <AuthView onAuth={handleAuth} />;

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.Write:
        return (
          <Editor 
            chapter={activeChapter} 
            onUpdate={(content) => updateChapterContent(activeChapter.id, content)}
            onTitleUpdate={(title) => {
              setBook(prev => ({
                ...prev,
                chapters: prev.chapters.map(c => c.id === activeChapter.id ? { ...c, title } : c)
              }));
            }}
            onCreateRevision={(label) => createRevision(activeChapter.id, label)}
            onRestoreRevision={(revId) => restoreRevision(activeChapter.id, revId)}
          />
        );
      case ViewMode.Layout:
        return <LayoutPreview book={book} onUpdateLayout={(l) => updateMetadata({ layoutPreference: l })} />;
      case ViewMode.Publish:
        return <PublishView book={book} onUpdateMetadata={updateMetadata} />;
      case ViewMode.Library:
        return <LibraryView book={book} onTriggerAI={() => setShowBrainstorm(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-16 flex flex-col items-center py-6 border-r border-slate-800 bg-slate-900 z-50">
        <div className="mb-8 p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-600/20">
          <BookOpen size={24} />
        </div>
        <nav className="flex flex-col space-y-4 flex-1">
          <NavButton active={currentView === ViewMode.Write} onClick={() => setCurrentView(ViewMode.Write)} icon={<Edit3 size={20} />} label="Escribir" />
          <NavButton active={currentView === ViewMode.Layout} onClick={() => setCurrentView(ViewMode.Layout)} icon={<Layout size={20} />} label="Maquetar" />
          <NavButton active={currentView === ViewMode.Publish} onClick={() => setCurrentView(ViewMode.Publish)} icon={<Send size={20} />} label="Publicar" />
          <div className="h-px bg-slate-800 mx-2" />
          <NavButton active={currentView === ViewMode.Library} onClick={() => setCurrentView(ViewMode.Library)} icon={<Save size={20} />} label="Biblioteca" />
        </nav>
        <div className="mt-auto flex flex-col items-center space-y-4">
          <button onClick={handleLogout} title="Cerrar sesión" className="p-3 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"><LogOut size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800" title={user.name}>{user.name.charAt(0).toUpperCase()}</div>
        </div>
      </aside>

      {currentView === ViewMode.Write && <Sidebar chapters={book.chapters} activeId={activeChapterId} onSelect={setActiveChapterId} onAdd={addChapter} />}

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-semibold text-slate-300 uppercase tracking-widest truncate max-w-xs">{book.metadata.title}</h1>
            <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 font-medium">
              {user.plan.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {isSaving ? (
                <>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} className="text-green-500" />
                  <span>Sincronizado</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md transition text-slate-300 border border-slate-700">
                <Share2 size={14} />
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto relative">{renderContent()}</div>
      </main>

      {showBrainstorm && <BrainstormModal onClose={() => setShowBrainstorm(false)} onApply={handleApplyAIStructure} />}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} title={label} className={`p-3 rounded-xl transition-all duration-200 group relative ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-slate-800'}`}>
    {icon}
    {active && <div className="absolute left-[-1rem] top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
  </button>
);

export default App;
