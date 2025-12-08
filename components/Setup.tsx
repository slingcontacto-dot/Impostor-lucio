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
    <div className="min-h-screen p-6 pb-24 flex flex-col items-center card-enter max-w-2xl mx-auto">
      <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">CONFIGURACIÓN</h2>

      {/* Player Count */}
      <div className="w-full bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-bold text-slate-200">Jugadores</span>
          <span className="text-2xl font-bold text-blue-400">{playerCount}</span>
        </div>
        <input
          type="range"
          min="3"
          max="20"
          value={playerCount}
          onChange={handlePlayerChange}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Impostor Count */}
      <div className="w-full bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-bold text-slate-200">Impostores</span>
          <span className="text-2xl font-bold text-red-500">{impostorCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max={playerCount - 2}
          value={impostorCount}
          onChange={(e) => setImpostorCount(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
        <p className="text-xs text-slate-400 mt-2 text-right">Mínimo 2 inocentes requeridos</p>
      </div>

      {/* Categories */}
      <div className="w-full mb-8">
        <h3 className="text-xl font-bold text-slate-300 mb-4">Categoría</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl text-sm font-semibold transition-all border-2 ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Names Input */}
      {selectedCategory === Category.NOSOTROS && (
        <div className="w-full bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700 animate-fade-in">
          <label className="block text-sm font-bold text-slate-300 mb-2">Ingresa nombres (separados por coma)</label>
          <textarea
            value={customNamesInput}
            onChange={(e) => setCustomNamesInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Juan, Pedro, Maria, Sofia..."
          />
        </div>
      )}

      {/* Action Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-2xl mx-auto">
        <button
          onClick={handleStart}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 rounded-2xl shadow-xl transition-transform active:scale-95 uppercase tracking-wider"
        >
          Comenzar Juego
        </button>
      </div>
    </div>
  );
};

export default Setup;
