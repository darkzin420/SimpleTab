
import React, { useState } from 'react';
import { RiffData } from '../types';

interface TabDisplayProps {
  data: RiffData;
}

const TabDisplay: React.FC<TabDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyTab = () => {
    const text = data.tab.map(l => `${l.string}|${l.notes}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">{data.songTitle}</h2>
            <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase">{data.artist}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-tighter italic">
                  <i className="fas fa-check-circle mr-1"></i> {data.difficultyLabel}
                </span>
             </div>
             <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Afinação</div>
                <div className="text-xs font-bold text-slate-300">{data.tuning}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="p-8 group relative">
        <button 
          onClick={copyTab}
          className="absolute top-6 right-6 z-10 p-3 bg-slate-800 hover:bg-white hover:text-black rounded-xl text-slate-400 transition-all shadow-xl"
          title="Copiar Tablatura"
        >
          {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
        </button>

        <div className="bg-black/60 p-8 md:p-12 rounded-3xl overflow-x-auto border border-white/5 ring-1 ring-inset ring-white/5">
          <div className="mono text-2xl md:text-3xl space-y-3 whitespace-nowrap text-white/80">
            {data.tab.map((line, idx) => (
              <div key={idx} className="flex items-center group/line">
                <span className="w-10 font-black text-indigo-500/60 select-none group-hover/line:text-indigo-400 transition-colors">{line.string}</span>
                <span className="text-slate-700 mx-2">|</span>
                <span className="tracking-[0.15em] font-medium text-indigo-100">{line.notes}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex items-start gap-5 p-6 bg-white/5 rounded-3xl border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
            <i className="fas fa-lightbulb text-white text-xl"></i>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-2">Dica para Facilitar</h4>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              {data.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabDisplay;
