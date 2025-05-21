import Dexie from 'dexie';

export const db = new Dexie('clickerGame');

db.version(1).stores({
  gameState: '++id, credits, clickValue, duiktcoins, upgrades, skins, prestigePoints, prestigeMultiplier',
  achievements: '++id, name, unlocked, progress',
  statistics: '++id, totalClicks, totalCredits, playTime, totalCreditsEarned'
}); 