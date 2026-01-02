
import React, { useState } from 'react';
import { BookOpen, Check, Shield, Zap, Sparkles, ArrowRight, Star } from 'lucide-react';
import { User, PlanType } from '../types';

interface AuthViewProps {
  onAuth: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email || 'usuario@ejemplo.com',
      name: name || 'Nombre del Autor',
      plan: selectedPlan,
      trialEndsAt: selectedPlan === 'free' ? undefined : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isLoggedIn: true
    };
    onAuth(mockUser);
  };

  const plans = [
    {
      id: 'free' as PlanType,
      name: 'Gratis',
      price: '$0',
      description: 'Ideal para comenzar con tu primer manuscrito.',
      features: ['1 Proyecto', 'Asistencia IA Básica', 'Diseños Estándar', 'Exportar como PDF'],
      color: 'slate'
    },
    {
      id: 'pro' as PlanType,
      name: 'Autor Pro',
      price: '$249',
      period: '/mes',
      description: 'El conjunto completo de herramientas para escritores serios.',
      features: ['Proyectos Ilimitados', 'Refinación IA Avanzada', 'Generación de Portadas IA', 'Exportación EPUB y Kindle', 'Sincronización Prioritaria'],
      popular: true,
      color: 'indigo'
    },
    {
      id: 'studio' as PlanType,
      name: 'Studio',
      price: '$599',
      period: '/mes',
      description: 'Para editoriales y equipos colaborativos.',
      features: ['Colaboración en Equipo', 'Gestión de ISBN por Lotes', 'Plantillas Legales Personalizadas', 'Soporte Premium', 'Acceso a la API'],
      color: 'violet'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-y-auto font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Lumina Author Studio</span>
        </div>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-medium text-slate-400 hover:text-white transition"
        >
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Suite de Publicación con IA</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight serif-font">
            Escribe, Diseña, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Publica Inteligente.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
            Un editor de manuscritos profesional, diseñador de maquetación y gestor de bibliotecas en un estudio unificado. Infundido con Gemini IA para ayudarte a terminar tu obra maestra.
          </p>
          <div className="flex items-center space-x-8 text-slate-500">
            <div className="flex items-center space-x-2">
              <Shield size={18} className="text-indigo-500/50" />
              <span className="text-sm">Copyright Protegido</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap size={18} className="text-yellow-500/50" />
              <span className="text-sm">Exportación Instantánea</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen size={120} />
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta de estudio'}</h2>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre de pluma / Nombre completo</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                  placeholder="Gabriel García"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correo electrónico</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                placeholder="autor@lumina.studio"
              />
            </div>
            
            {!isLogin && (
              <div className="pt-4 space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Elige tu plan (MXN)</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition uppercase tracking-tighter ${
                        selectedPlan === p.id 
                        ? 'bg-indigo-600 border-indigo-400 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-6 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Entrar al Estudio' : 'Comienza tu prueba de 14 días'}</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
              Al continuar, aceptas los <span className="underline cursor-pointer">Términos de Servicio</span> y la <span className="underline cursor-pointer">Política de Copyright</span> de Lumina.
            </p>
          </form>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold serif-font">Diseñado para autores de todos los niveles.</h2>
          <p className="text-slate-400">Precios transparentes en Pesos Mexicanos (MXN).</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div 
              key={p.id}
              className={`p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${
                p.popular 
                ? 'bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/5 scale-105 z-10' 
                : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              {p.popular && (
                <div className="mb-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                  <Star size={10} />
                  <span>Más popular</span>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-slate-500 text-sm font-medium">{p.period || ''}</span>
                <span className="text-slate-600 text-[10px] ml-1">MXN</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">{p.description}</p>
              
              <div className="flex-1 space-y-4 mb-8">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm">
                    <Check size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setSelectedPlan(p.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                  p.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Elegir {p.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="p-12 text-center text-slate-600 border-t border-slate-900">
        <p className="text-xs uppercase tracking-[0.2em] font-bold">Lumina Studio &copy; 2024 - Crear con Visión</p>
      </footer>
    </div>
  );
};
