import React, { useState } from 'react';
import { Category, GameConfig } from '../types';

interface SetupProps {
  onStartGame: (config: GameConfig) => void;
}

const Setup: React.FC<SetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ANIMALS);
  const [customNamesInput, setCustomNamesInput] = useState('');

  const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setPlayerCount(val);
    if (impostorCount >= val) setImpostorCount(val - 1);
  };

  const handleStart = () => {
    let customNames: string[] = [];
    if (selectedCategory === Category.NOSOTROS) {
      customNames = customNamesInput.split(',').map(n => n.trim()).filter(n => n.length > 0);
      if (customNames.length < 2) {
        alert("Para la categoría 'Nosotros', ingresa al menos 2 nombres separados por coma.");
        return;
      }
    }

    onStartGame({
      playerCount,
      impostorCount,
      selectedCategory,
      customNames
    });
  };

  return (
    <div className="min-h-screen p-4 pb-28 flex flex-col items-center card-enter max-w-2xl mx-auto">
      <h2 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-8 tracking-tighter uppercase transform -skew-x-6 drop-shadow-lg">
        SETUP
      </h2>

      {/* Player Count */}
      <div className="glass-panel w-full p-6 rounded-2xl mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-20">
             <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        </div>
        <div className="flex justify-between mb-4 relative z-10">
          <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Jugadores</span>
          <span className="text-4xl font-black text-blue-400 drop-shadow-lg">{playerCount}</span>
        </div>
        <input
          type="range"
          min="3"
          max="20"
          value={playerCount}
          onChange={handlePlayerChange}
          className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
        />
      </div>

      {/* Impostor Count */}
      <div className="glass-panel w-full p-6 rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-20">
             <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"></path></svg>
        </div>
        <div className="flex justify-between mb-4 relative z-10">
          <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Impostores</span>
          <span className="text-4xl font-black text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">{impostorCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max={playerCount - 2}
          value={impostorCount}
          onChange={(e) => setImpostorCount(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
        />
        <p className="text-[10px] text-orange-400/80 mt-3 text-right uppercase font-bold tracking-wider">Requiere {playerCount - impostorCount} inocentes</p>
      </div>

      {/* Categories */}
      <div className="w-full mb-8">
        <h3 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em] ml-2">Selecciona Categoría</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wide relative overflow-hidden group ${
                selectedCategory === cat
                  ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-[1.02] border border-orange-400'
                  : 'bg-black/40 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="relative z-10">{cat}</span>
              {selectedCategory === cat && (
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Names Input */}
      {selectedCategory === Category.NOSOTROS && (
        <div className="w-full glass-panel p-6 rounded-xl mb-6 border border-orange-500/30 animate-fade-in">
          <label className="block text-xs font-black text-orange-400 mb-3 uppercase tracking-widest">Nombres (separados por coma)</label>
          <textarea
            value={customNamesInput}
            onChange={(e) => setCustomNamesInput(e.target.value)}
            className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-white h-32 focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] outline-none font-mono text-sm"
            placeholder="JUAN, PEDRO, SOFIA, MARIA..."
          />
        </div>
      )}

      {/* Action Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto z-50">
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xl font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95 uppercase tracking-widest border-t border-green-400/30"
        >
          INICIAR PARTIDA
        </button>
      </div>
    </div>
  );
};

export default Setup;