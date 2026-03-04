import { GameProvider, useGame } from './state/gameState';
import { HomeScreen } from './components/screens/HomeScreen';
import { BattleScreen } from './components/screens/BattleScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';

function GameRouter() {
  const { state } = useGame();
  switch (state.screen) {
    case 'home': return <HomeScreen />;
    case 'battle': return <BattleScreen />;
    case 'results': return <ResultsScreen />;
    default: return <HomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="max-w-md mx-auto min-h-screen">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
