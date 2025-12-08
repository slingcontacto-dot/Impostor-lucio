import React, { useState } from 'react';
import { Player } from '../types';

interface DiscussionProps {
  impostorCount: number;
  players: Player[];
  onNewGame: () => void;
}

const Discussion: React.FC<DiscussionProps> = ({ impostorCount, players, onNewGame }) => {
  const [showResults, setShowResults] = useState(false);

  // We find the impostors for the reveal screen
  const impostors = players.filter(p => p.isImpostor);
  const secretWord = players.find(p => !p.isImpostor)?.word || "Error";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 card-enter bg-slate-900">
      <div className="text-center w-full max-w-lg">
        {!showResults ? (
            <>
                <div className="animate-pulse mb-8">
                     <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-4xl font-black text-white mb-2 uppercase">¡A Debatir!</h1>
                <p className="text-slate-400 mb-8 text-lg">
                    Busquen a los <span className="text-red-500 font-bold">{impostorCount}</span> impostor(es).
                </p>
                
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 mb-8">
                    <p className="text-sm text-slate-500 mb-2">Instrucciones</p>
                    <ul className="text-left text-slate-300 space-y-2 text-sm">
                        <li>1. El jugador más joven empieza preguntando.</li>
                        <li>2. Respondan con una sola palabra o frase corta.</li>
                        <li>3. Voten para eliminar a los sospechosos.</li>
                    </ul>
                </div>

                <button
                    onClick={() => setShowResults(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg mb-4"
                >
                    REVELAR IMPOSTORES
                </button>
            </>
        ) : (
            <div className="card-enter">
                <h2 className="text-3xl font-bold text-white mb-6">Resultados</h2>
                
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 mb-6">
                    <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">La Palabra Era</p>
                    <p className="text-3xl font-black text-blue-400">{secretWord}</p>
                </div>

                <div className="bg-red-900/30 p-6 rounded-xl border border-red-800 mb-8">
                    <p className="text-red-300 text-sm uppercase tracking-wide mb-4">Los Impostores Eran</p>
                    <div className="space-y-2">
                         {impostors.map(imp => (
                             <div key={imp.id} className="text-xl font-bold text-white bg-red-600 py-2 px-4 rounded-lg">
                                 Jugador {imp.id + 1}
                             </div>
                         ))}
                    </div>
                </div>

                <button
                    onClick={onNewGame}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg"
                >
                    JUGAR OTRA VEZ
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
