import React, { useState } from 'react';
import { GamePhase, Player } from '../types';

interface GameLoopProps {
  players: Player[];
  playerIndex: number;
  impostorCount: number;
  enableHints: boolean; // New prop
  onNextPlayer: () => void;
  onFinishDistribution: () => void;
}

const GameLoop: React.FC<GameLoopProps> = ({
  players,
  playerIndex,
  impostorCount,
  enableHints,
  onNextPlayer,
  onFinishDistribution,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[playerIndex];
  const isLastPlayer = playerIndex === players.length - 1;

  const handleContinue = () => {
    setIsRevealed(false);
    if (isLastPlayer) {
      onFinishDistribution();
    } else {
      onNextPlayer();
    }
  };

  // Phase 1: Pass the phone screen
  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center card-enter">
        <div className="glass-panel p-10 rounded-[3rem] w-full max-w-md border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            {/* Animated Background Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>

            <div className="mb-10">
                <span className="inline-block bg-black/50 border border-slate-700 rounded-full px-6 py-2 text-xs font-black text-slate-300 mb-4 tracking-[0.2em] uppercase">
                    TURNO {playerIndex + 1} / {players.length}
                </span>
                <h2 className="text-6xl font-black text-white italic transform -skew-x-6 drop-shadow-lg">
                    JUGADOR <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{playerIndex + 1}</span>
                </h2>
            </div>
          
          <p className="text-slate-400 mb-10 text-sm uppercase font-bold tracking-widest leading-relaxed">
            Toma el dispositivo.<br/>Asegúrate de que nadie mire.
          </p>

          <button
            onClick={() => setIsRevealed(true)}
            className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 uppercase tracking-widest border border-blue-400/30"
          >
            REVELAR IDENTIDAD
          </button>
        </div>
      </div>
    );
  }

  // Phase 2: Reveal Role
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center card-enter transition-colors duration-500 ${currentPlayer.isImpostor ? 'bg-red-950/30' : 'bg-blue-950/30'}`}>
        
        <div className={`w-full max-w-md p-8 rounded-[2rem] border-2 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden ${
            currentPlayer.isImpostor 
            ? 'glass-panel border-orange-500/50 shadow-[0_0_60px_rgba(234,88,12,0.3)]' 
            : 'glass-panel border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.3)]'
        }`}>
            
            {/* Background Effects */}
            <div className={`absolute inset-0 opacity-20 ${currentPlayer.isImpostor ? 'bg-[radial-gradient(circle,rgba(255,0,0,0.4)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle,rgba(0,255,255,0.4)_0%,transparent_70%)]'}`}></div>

            <h3 className="relative z-10 text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-6">Identidad Confirmada</h3>
            
            <div className="mb-10 relative z-10">
                {currentPlayer.isImpostor ? (
                    <>
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse italic transform -skew-x-6 tracking-tighter">
                            IMPOSTOR
                        </h1>
                        
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-700 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-bounce">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-white drop-shadow-md">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        
                        {/* HINT SECTION - Only if enableHints is true */}
                        {enableHints && currentPlayer.impostorHint && (
                          <div className="bg-black/60 p-6 rounded-2xl border border-orange-500/50 mb-6 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <p className="text-[10px] text-orange-400 uppercase font-black tracking-widest mb-2">Tu Pista de Ayuda</p>
                            <p className="text-2xl text-white font-black italic tracking-wide drop-shadow-md">"{currentPlayer.impostorHint}"</p>
                          </div>
                        )}

                        <div className="bg-red-950/50 p-4 rounded-xl border border-red-800/50">
                            <p className="text-red-200 text-sm font-bold uppercase tracking-wide">
                                Total Impostores: <span className="text-2xl text-white ml-2">{impostorCount}</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] italic transform -skew-x-6 tracking-tighter">
                            INOCENTE
                        </h1>
                        
                        <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-white drop-shadow-md">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <p className="text-cyan-200 text-xs font-black uppercase tracking-[0.2em] mb-4">Palabra Secreta</p>
                        <div className="bg-black/60 py-6 px-8 rounded-2xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                             <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">{currentPlayer.word}</p>
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-lg font-black py-5 rounded-xl border border-slate-600 transition-all uppercase tracking-widest relative z-10"
            >
                {isLastPlayer ? 'EMPEZAR JUEGO' : 'OCULTAR Y PASAR'}
            </button>
      </div>
    </div>
  );
};

export default GameLoop;