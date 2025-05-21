import { motion } from 'framer-motion'
import { useClicker } from './hooks/useClicker'
import Upgrades from './components/Upgrades'
import Skins from './components/Skins'
import './App.scss'

function App() {
  const { gameState, statistics, handleClick, buyUpgrade, prestige, resetProgress, buySkin, activateSkin, availableSkins } = useClicker()

  const activeSkinClass = availableSkins.find(skin => skin.id === gameState.activeSkin)?.className || '';

  return (
    <div className={`app ${activeSkinClass}`}>
      <header className="app-header">
        <div className="logos">
        </div>
        <h1>React Клікер</h1>
        <div className="resources">
          <div className="credits">Кредити: {Math.floor(gameState.credits)}</div>
          <div className="duiktcoins">Дукткоїни: {gameState.duiktcoins}</div>
          <div className="prestige">Рівень Престижу: {gameState.prestigePoints} (x{gameState.prestigeMultiplier.toFixed(1)})</div>
        </div>
      </header>
      
      <main className="game-container">
        <motion.button
          className="click-button"
          onClick={handleClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          КЛІКНИ МЕНЕ! (+{gameState.clickValue * gameState.prestigeMultiplier})
        </motion.button>

        <div className="sections-container">
          <Upgrades
            credits={gameState.credits}
            ownedUpgrades={gameState.upgrades}
            onBuyUpgrade={buyUpgrade}
          />

          <Skins
            availableSkins={availableSkins}
            ownedSkins={gameState.skins}
            activeSkin={gameState.activeSkin}
            duiktcoins={gameState.duiktcoins}
            onBuySkin={buySkin}
            onActivateSkin={activateSkin}
          />
        </div>

        {statistics.totalCreditsEarned >= 10000 && (
          <motion.button
            className="prestige-button"
            onClick={prestige}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Престиж (Потрібно 10000 всього зароблених кредитів)
          </motion.button>
        )}

        <motion.button
          className="reset-button"
          onClick={() => {
            if (window.confirm('Ви впевнені, що хочете скинути весь прогрес?')) {
              resetProgress();
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Скинути прогрес
        </motion.button>
      </main>
    </div>
  )
}

export default App 