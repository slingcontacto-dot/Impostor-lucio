import React, { useState } from 'react';
import { GamePhase, Player } from '../types';

interface GameLoopProps {
  players: Player[];
  playerIndex: number;
  impostorCount: number;
  onNextPlayer: () => void;
  onFinishDistribution: () => void;
}

const GameLoop: React.FC<GameLoopProps> = ({
  players,
  playerIndex,
  impostorCount,
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center card-enter bg-slate-900">
        <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl border-2 border-slate-700 w-full max-w-md">
            <div className="mb-6">
                <span className="inline-block bg-slate-700 rounded-full px-4 py-1 text-sm text-slate-300 mb-2">
                    Turno {playerIndex + 1} de {players.length}
                </span>
                <h2 className="text-4xl font-bold text-white">Jugador {playerIndex + 1}</h2>
            </div>
          
          <p className="text-slate-400 mb-8 text-lg">
            Toma el dispositivo. Asegúrate de que nadie más esté mirando la pantalla.
          </p>

          <button
            onClick={() => setIsRevealed(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            VER MI ROL
          </button>
        </div>
      </div>
    );
  }

  // Phase 2: Reveal Role
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center card-enter bg-black">
        <div className={`w-full max-w-md p-8 rounded-3xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${currentPlayer.isImpostor ? 'border-red-600 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'}`}>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tu Identidad</h3>
            
            <div className="mb-8">
                {currentPlayer.isImpostor ? (
                    <>
                        <h1 className="text-5xl font-black text-red-500 mb-4 drop-shadow-lg">IMPOSTOR</h1>
                        <div className="w-24 h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        
                        {/* HINT SECTION */}
                        {currentPlayer.impostorHint && (
                          <div className="bg-red-950/50 p-4 rounded-xl border border-red-500/30 mb-4">
                            <p className="text-xs text-red-300 uppercase font-bold tracking-wider mb-1">Tu Pista de Ayuda</p>
                            <p className="text-lg text-white font-semibold italic">"{currentPlayer.impostorHint}"</p>
                          </div>
                        )}

                        <p className="text-red-200 text-lg">
                            Hay <span className="font-bold text-white text-2xl">{impostorCount}</span> impostores en total.
                        </p>
                        <p className="text-slate-400 mt-2 text-sm italic">Engaña a los demás usando tu pista.</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-5xl font-black text-blue-400 mb-4 drop-shadow-lg">INOCENTE</h1>
                        <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <p className="text-slate-300 text-sm mb-2 uppercase tracking-wide">Palabra Secreta:</p>
                        <div className="bg-slate-800 py-4 px-6 rounded-xl border border-blue-500/50">
                             <p className="text-3xl font-bold text-white">{currentPlayer.word}</p>
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold py-4 rounded-xl border border-slate-500 transition-colors"
            >
                {isLastPlayer ? 'FINALIZAR Y JUGAR' : 'OCULTAR Y PASAR'}
            </button>
      </div>
    </div>
  );
};

export default GameLoop;