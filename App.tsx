import React, { useState } from 'react';
import Login from './components/Login';
import Setup from './components/Setup';
import GameLoop from './components/GameLoop';
import Discussion from './components/Discussion';
import { generateGameContent, generateHintForCustomWord } from './services/geminiService';
import { GamePhase, GameConfig, Player, Category } from './types';

function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.LOGIN);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [config, setConfig] = useState<GameConfig | null>(null);

  const handleLogin = () => {
    setPhase(GamePhase.SETUP);
  };

  const startGame = async (gameConfig: GameConfig) => {
    setConfig(gameConfig);
    setPhase(GamePhase.LOADING_TOPIC);

    let secretWord = '';
    let impostorHint = '';
    
    // Pick ONE category randomly from the selected list
    const activeCategory = gameConfig.selectedCategories[Math.floor(Math.random() * gameConfig.selectedCategories.length)];
    
    // Logic to determine secret word and hint
    if (activeCategory === Category.NOSOTROS) {
      if (gameConfig.customNames.length > 0) {
        const randIndex = Math.floor(Math.random() * gameConfig.customNames.length);
        secretWord = gameConfig.customNames[randIndex];
        // Generate a hint for this custom word if hints are enabled (or generate it anyway to be safe)
        impostorHint = await generateHintForCustomWord(secretWord);
      } else {
        secretWord = "Error: Sin Nombres";
        impostorHint = "Sin Pista";
      }
    } else {
      // Use AI for other categories to get both word and hint
      const content = await generateGameContent(activeCategory);
      secretWord = content.word;
      impostorHint = content.hint;
    }

    // Initialize players
    const newPlayers: Player[] = Array.from({ length: gameConfig.playerCount }, (_, i) => ({
      id: i,
      isImpostor: false,
      word: secretWord,
      impostorHint: undefined
    }));

    // Assign Impostors randomly
    let assignedImpostors = 0;
    while (assignedImpostors < gameConfig.impostorCount) {
      const randomIndex = Math.floor(Math.random() * gameConfig.playerCount);
      if (!newPlayers[randomIndex].isImpostor) {
        newPlayers[randomIndex].isImpostor = true;
        newPlayers[randomIndex].impostorHint = impostorHint; // Assign the hint specifically to the impostor
        assignedImpostors++;
      }
    }

    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setPhase(GamePhase.PASS_DEVICE);
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prev) => prev + 1);
  };

  const handleFinishDistribution = () => {
    setPhase(GamePhase.DISCUSSION);
  };

  const handleNewGame = () => {
    setPhase(GamePhase.SETUP);
    setPlayers([]);
    setConfig(null);
  };

  const handleReplay = () => {
    if (config) {
      startGame(config);
    }
  };

  // Render logic based on phase
  const renderContent = () => {
    switch (phase) {
      case GamePhase.LOGIN:
        return <Login onLogin={handleLogin} />;
      
      case GamePhase.SETUP:
        return <Setup onStartGame={startGame} />;
      
      case GamePhase.LOADING_TOPIC:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-xl font-semibold animate-pulse">Generando palabra y pistas con IA...</p>
          </div>
        );

      case GamePhase.PASS_DEVICE:
      case GamePhase.REVEAL_ROLE: // GameLoop handles internal reveal state
        return (
          <GameLoop 
            players={players} 
            playerIndex={currentPlayerIndex}
            impostorCount={config?.impostorCount || 1}
            enableHints={config?.enableHints ?? true} // Pass the toggle preference
            onNextPlayer={handleNextPlayer}
            onFinishDistribution={handleFinishDistribution}
          />
        );

      case GamePhase.DISCUSSION:
        return (
          <Discussion 
            impostorCount={config?.impostorCount || 1}
            players={players}
            onNewGame={handleNewGame}
            onReplay={handleReplay}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* MARCA DE AGUA GLOBAL */}
      <div className="fixed bottom-2 right-3 z-50 pointer-events-none select-none opacity-40">
        <p className="text-[10px] text-white font-mono uppercase tracking-widest drop-shadow-md">
          Creado por Luciano Murua
        </p>
      </div>
    </>
  );
}

export default App;