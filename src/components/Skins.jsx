import { motion } from 'framer-motion';
import './Skins.scss';

const Skins = ({ availableSkins, ownedSkins, activeSkin, duiktcoins, onBuySkin, onActivateSkin }) => {
  return (
    <div className="skins-section">
      <h2>Скіни</h2>
      <div className="skins-grid">
        {availableSkins.map(skin => (
          <motion.div
            key={skin.id}
            className={`skin-card ${ownedSkins.includes(skin.id) ? 'owned' : ''} ${activeSkin === skin.id ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>{skin.name}</h3>
            {skin.cost > 0 && (
              <div className="skin-cost">
                Вартість: {skin.cost} Дукткоїнів
              </div>
            )}
            {!ownedSkins.includes(skin.id) ? (
              <button
                onClick={() => onBuySkin(skin)}
                disabled={duiktcoins < skin.cost}
              >
                Купити
              </button>
            ) : (
              <button
                onClick={() => onActivateSkin(skin.id)}
                disabled={activeSkin === skin.id}
              >
                {activeSkin === skin.id ? 'Активовано' : 'Активувати'}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skins; 