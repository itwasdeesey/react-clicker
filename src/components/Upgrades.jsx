import { motion } from 'framer-motion';
import './Upgrades.scss';

const upgrades = [
  {
    id: 1,
    name: 'Кращий Клік',
    description: 'Збільшує значення кліку на 1',
    cost: 10,
    value: 1
  },
  {
    id: 2,
    name: 'Супер Клік',
    description: 'Подвоює значення кліку',
    cost: 50,
    value: 2
  },
  {
    id: 3,
    name: 'Автоклікер',
    description: 'Автоматично клікає щосекунди',
    cost: 100,
    value: 1
  },
  {
    id: 4,
    name: 'Мега Клік',
    description: 'Потроює значення кліку',
    cost: 200,
    value: 3
  },
  {
    id: 5,
    name: 'Ультра Клік',
    description: 'Множить значення кліку на 5',
    cost: 500,
    value: 5
  }
];

const Upgrades = ({ credits, ownedUpgrades, onBuyUpgrade }) => {
  return (
    <div className="upgrades">
      <h2>Покращення</h2>
      <div className="upgrades-grid">
        {upgrades.map(upgrade => (
          <motion.div
            key={upgrade.id}
            className={`upgrade-card ${ownedUpgrades.includes(upgrade.id) ? 'owned' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>{upgrade.name}</h3>
            <p>{upgrade.description}</p>
            <div className="upgrade-cost">
              Вартість: {upgrade.cost} кредитів
            </div>
            <button
              onClick={() => onBuyUpgrade(upgrade)}
              disabled={credits < upgrade.cost || ownedUpgrades.includes(upgrade.id)}
            >
              {ownedUpgrades.includes(upgrade.id) ? 'Придбано' : 'Купити'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Upgrades; 