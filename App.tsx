
import React, { useState } from 'react';
import { generateRiffTab } from './services/geminiService';
import { RiffData, SimplificationLevel } from './types';
import TabDisplay from './components/TabDisplay';

const App: React.FC = () => {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [level, setLevel] = useState<SimplificationLevel>('Melody');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiffData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const levels: {id: SimplificationLevel, label: string, icon: string}[] = [
    { id: 'Melody', label: 'Melodia (1 nota)', icon: 'fa-music' },
    { id: 'PowerChord', label: 'Tônicas/PowerChords', icon: 'fa-guitar' },
    { id: 'OneFinger', label: 'Dedo Único', icon: 'fa-hand-pointer' }
  ];
  
  const suggestions = [
    { name: 'Seven Nation Army', artist: 'White Stripes' },
    { name: 'Smoke on the Water', artist: 'Deep Purple' },
    { name: 'Sweet Child O Mine', artist: 'Guns N Roses' },
    { name: 'Another One Bites the Dust', artist: 'Queen' }
  ];

  const handleSuggestion = (s: {name: string, artist: string}) => {
    setSong(s.name);
    setArtist(s.artist);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateRiffTab({
        song,
        artist,
        level
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Não conseguimos simplificar este riff no momento. Tente uma música mais popular ou verifique o nome.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="relative z-10 pt-20 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          AI Riff Simplifier v2
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white italic">
          SIMPLI<span className="text-indigo-500 not-italic">TAB</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          Toque qualquer música hoje. Nossa IA cria a versão <span className="text-white border-b-2 border-indigo-500">mais fácil possível</span> para o seu nível.
        </p>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-32">
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-3xl mb-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Qual música você quer tocar?</label>
                <input
                  type="text"
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  placeholder="Ex: Californication"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white text-lg placeholder:text-slate-700"
                  required
                />
              </div>
              <div className="group space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Artista (opcional)</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Ex: Red Hot Chili Peppers"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white text-lg placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Nível de Simplificação</label>
                <div className="h-px w-full bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLevel(l.id)}
                    className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all font-bold text-sm ${
                      level === l.id 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <i className={`fas ${l.icon}`}></i>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-4 group relative overflow-hidden ${
                  loading ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'bg-white text-black hover:bg-indigo-50 hover:scale-[1.01] active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-compact-disc animate-spin"></i>
                    <span>SIMPLIFICANDO...</span>
                  </>
                ) : (
                  <>
                    <span>CRIAR RIFF FÁCIL</span>
                    <i className="fas fa-magic text-indigo-600 group-hover:rotate-12 transition-transform"></i>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-center pt-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-3">Tente estes:</span>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="px-4 py-2 bg-white/5 hover:bg-indigo-500/10 border border-white/5 rounded-xl text-xs text-slate-400 hover:text-indigo-300 transition-all"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* Results Area */}
        <div className="min-h-[300px]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-[2rem] flex items-center gap-5 animate-in fade-in slide-in-from-top-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="text-sm font-bold uppercase tracking-tight">{error}</div>
            </div>
          )}

          {result && <TabDisplay data={result} />}

          {!result && !loading && !error && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <i className="fas fa-guitar text-5xl mb-6 opacity-10"></i>
              <p className="text-xs font-black uppercase tracking-[0.4em] opacity-30">Escolha uma música para começar</p>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-16 text-center">
        <div className="flex justify-center gap-8 mb-6 opacity-30 grayscale hover:grayscale-0 transition-all">
           <i className="fab fa-spotify text-2xl"></i>
           <i className="fab fa-youtube text-2xl"></i>
           <i className="fab fa-apple text-2xl"></i>
        </div>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
          SimpliTab &bull; A Guitarra para Todos
        </p>
      </footer>
    </div>
  );
};

export default App;
