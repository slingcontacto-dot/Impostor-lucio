import React, { useState } from 'react';
import { Player } from '../types';

interface DiscussionProps {
  impostorCount: number;
  players: Player[];
  onNewGame: () => void;
  onReplay: () => void;
}

const Discussion: React.FC<DiscussionProps> = ({ impostorCount, players, onNewGame, onReplay }) => {
  const [showResults, setShowResults] = useState(false);

  const impostors = players.filter(p => p.isImpostor);
  const secretWord = players.find(p => !p.isImpostor)?.word || "Error";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 card-enter">
      <div className="text-center w-full max-w-lg glass-panel p-8 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        {!showResults ? (
            <>
                <div className="mb-8">
                     <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter drop-shadow-md">¡A DEBATIR!</h1>
                <p className="text-slate-300 mb-8 text-lg font-bold tracking-wide">
                    Encuentren a los <span className="text-orange-500 text-2xl mx-1">{impostorCount}</span> impostores.
                </p>
                
                <div className="p-6 bg-black/40 rounded-xl border-l-4 border-yellow-500 mb-8 text-left">
                    <p className="text-xs text-yellow-500 uppercase font-black tracking-widest mb-3">Protocolo</p>
                    <ul className="text-slate-300 space-y-3 text-sm font-semibold">
                        <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>El más joven inicia las preguntas.</li>
                        <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Solo respuestas cortas (1 palabra).</li>
                        <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Voten para eliminar.</li>
                    </ul>
                </div>

                <button
                    onClick={() => setShowResults(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all uppercase tracking-widest text-lg border border-red-400/30"
                >
                    REVELAR VERDAD
                </button>
            </>
        ) : (
            <div className="card-enter">
                <h2 className="text-4xl font-black text-white mb-8 uppercase italic tracking-tight">INFORME FINAL</h2>
                
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                    <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-2">La Palabra Secreta</p>
                    <p className="text-4xl font-black text-white uppercase drop-shadow-md">{secretWord}</p>
                </div>

                <div className="bg-red-950/40 p-6 rounded-2xl border border-red-600/50 mb-8 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                    <p className="text-red-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Identidades Expuestas</p>
                    <div className="space-y-3">
                         {impostors.map(imp => (
                             <div key={imp.id} className="flex items-center justify-between bg-red-600/20 border border-red-500/50 p-3 rounded-lg">
                                 <span className="text-white font-bold uppercase tracking-wider">Jugador {imp.id + 1}</span>
                                 <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">Impostor</span>
                             </div>
                         ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onReplay}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all hover:scale-[1.02] uppercase tracking-widest border border-purple-400/30 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        REVANCHA RÁPIDA (MISMA CONFIG)
                    </button>

                    <button
                        onClick={onNewGame}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all uppercase tracking-widest border border-slate-600 hover:text-white"
                    >
                        CAMBIAR CONFIGURACIÓN
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;