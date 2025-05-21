import { useState, useEffect } from 'react';
import { db } from '../db/database';
import { skins } from '../utils/skins'; // Імпорт списку скінів

export const useClicker = () => {
  const [gameState, setGameState] = useState({
    credits: 0,
    clickValue: 1,
    duiktcoins: 0,
    upgrades: [],
    skins: [1], // За замовчуванням володіємо базовим скіном (id: 1)
    activeSkin: 1, // Активний скін за замовчуванням (id: 1)
    prestigePoints: 0,
    prestigeMultiplier: 1,
  });

  const [statistics, setStatistics] = useState({
    totalClicks: 0,
    totalCredits: 0,
    playTime: 0,
    totalCreditsEarned: 0,
  });

  // Define initial game state and statistics
  const initialGameState = {
    credits: 0,
    clickValue: 1,
    duiktcoins: 0,
    upgrades: [],
    skins: [1], // Початковий стан володіння скінами
    activeSkin: 1, // Початковий активний скін
    prestigePoints: 0,
    prestigeMultiplier: 1,
  };

  const initialStatistics = {
    totalClicks: 0,
    totalCredits: 0,
    playTime: 0,
    totalCreditsEarned: 0,
  };

  // Load game state and statistics from IndexedDB on mount
  useEffect(() => {
    const loadGameState = async () => {
      const savedGameState = await db.gameState.get(1);
      const savedStatistics = await db.statistics.get(1);

      if (savedGameState) {
        setGameState(prev => ({
            ...initialGameState, // Починаємо з початкового стану як основи
            ...savedGameState,
            skins: savedGameState.skins || [1], // Якщо немає збережених скінів, використовуємо базовий
            activeSkin: savedGameState.activeSkin || 1 // Якщо немає активного скіна, використовуємо базовий
        }));
      } else {
        // Якщо стану не знайдено, зберігаємо початковий стан
        saveGameState(initialGameState);
      }

      if (savedStatistics) {
          setStatistics(initialStatistics);
      } else {
          saveStatistics(initialStatistics);
      }
    };
    loadGameState();
  }, []);

  // Save game state to IndexedDB whenever gameState changes
  useEffect(() => {
    // Avoid saving on initial load if no state is found or if it's the initial state
    if (
        gameState.id === undefined &&
        gameState.credits === 0 &&
        gameState.upgrades.length === 0 &&
        gameState.duiktcoins === 0 &&
        gameState.prestigePoints === 0 &&
        gameState.skins.length === 1 &&
        gameState.activeSkin === 1
    ) {
        return;
    }
    const saveState = async () => {
        await db.gameState.put({ ...gameState, id: 1 });
    };
    // Додаємо невелику затримку перед збереженням, щоб уникнути надмірного запису в DB
    const handler = setTimeout(() => {
        saveState();
    }, 500);

    return () => clearTimeout(handler);

  }, [gameState]); // Save whenever gameState changes

    // Save statistics to IndexedDB whenever statistics changes
    useEffect(() => {
        // Avoid saving on initial load if no state is found or if it's the initial state
        if (
            statistics.id === undefined &&
            statistics.totalClicks === 0 &&
            statistics.totalCredits === 0 &&
            statistics.playTime === 0 &&
            statistics.totalCreditsEarned === 0
        ) {
            return;
        }
        const saveStats = async () => {
            await db.statistics.put({ ...statistics, id: 1 });
        };
        // Додаємо невелику затримку перед збереженням, щоб уникнути надмірного запису в DB
        const handler = setTimeout(() => {
            saveStats();
        }, 500);

        return () => clearTimeout(handler);

      }, [statistics]); // Save whenever statistics changes

  // Effect to award Duiktcoins based on totalCreditsEarned
  useEffect(() => {
    // Визначаємо поріг для отримання Дукткоїнів (наприклад, кожні 1000 кредитів)
    const creditsPerDuiktcoin = 1000;

    // Розраховуємо, скільки Дукткоїнів користувач мав би отримати загалом
    // виходячи з усіх зароблених кредитів на даний момент
    const potentialDuiktcoins = Math.floor(statistics.totalCreditsEarned / creditsPerDuiktcoin);

    // Розраховуємо, скільки Дукткоїнів вже було видано
    // Для цього нам потрібен спосіб відстежувати видані Дукткоїни за кредити.
    // Додамо новий стан або статистику для цього.
    // Наразі, для спрощення, будемо видавати різницю між потенційними та поточними дукткоїнами,
    // але це може призвести до повторної видачі, якщо поточні дукткоїни були витрачені.
    // Краще відстежувати саме кількість виданих за кредити дукткоїнів.

    // Тимчасове рішення: видаємо Дукткоїни, якщо їхня кількість менша за потенційну,
    // і якщо різниця є позитивною. Це може бути не зовсім точно, якщо Дукткоїни витрачаються.
    // TODO: Реалізувати більш надійне відстеження виданих за кредити Дукткоїнів.
    const duiktcoinsToAward = potentialDuiktcoins - gameState.duiktcoins;

    if (duiktcoinsToAward > 0) {
      setGameState(prev => ({
        ...prev,
        duiktcoins: prev.duiktcoins + duiktcoinsToAward
      }));
    }

  }, [statistics.totalCreditsEarned, gameState.duiktcoins]); // Залежить від зароблених кредитів та поточних дукткоїнів

  // Handle click
  const handleClick = () => {
    setGameState(prev => ({
        ...prev,
        credits: prev.credits + (prev.clickValue * prev.prestigeMultiplier)
    }));
    setStatistics(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        totalCreditsEarned: prev.totalCreditsEarned + (gameState.clickValue * gameState.prestigeMultiplier)
    }));
    // Save is handled by the useEffect listener
  };

  // Auto clicker effect
  useEffect(() => {
    let autoClickInterval = null;
    // Check if the autoclicker upgrade (upgrade with id 3) is owned
    const autoClickUpgrade = { // Define upgrade details here or fetch from a central list
      id: 3,
      name: 'Автоклікер',
      description: 'Автоматично клікає щосекунди',
      cost: 100,
      value: 1 // Amount of credits added per interval
    };

    if (gameState.upgrades.includes(autoClickUpgrade.id)) {
      const clickAmount = autoClickUpgrade.value * gameState.prestigeMultiplier; // Apply prestige bonus
      const intervalTime = 1000; // 1000ms = 1 second

      autoClickInterval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          credits: prev.credits + clickAmount
        }));
        setStatistics(prev => ({
            ...prev,
            totalCreditsEarned: prev.totalCreditsEarned + clickAmount
        }));
        // Save is handled by the useEffect listener
      }, intervalTime);
    }

    // Cleanup: Clear the interval when the effect dependencies change or on unmount
    return () => {
      if (autoClickInterval) {
        clearInterval(autoClickInterval);
      }
    };
  }, [gameState.upgrades, gameState.prestigeMultiplier]); // Depend on upgrades and prestige multiplier

  // Buy upgrade
  const buyUpgrade = (upgrade) => {
    if (gameState.credits >= upgrade.cost && !gameState.upgrades.includes(upgrade.id)) {
      setGameState(prev => {
        let newClickValue = prev.clickValue;
        switch (upgrade.id) {
          case 1: // Кращий Клік
            newClickValue += upgrade.value;
            break;
          case 2: // Супер Клік
            newClickValue *= 2; // Подвоюємо
            break;
          case 4: // Мега Клік
            newClickValue *= 3; // Потроюємо
            break;
          case 5: // Ультра Клік
            newClickValue *= 5; // Множимо на 5
            break;
          // Для автоклікера (id 3) clickValue не змінюємо тут
        }

        const newState = {
          ...prev,
          credits: prev.credits - upgrade.cost,
          clickValue: newClickValue,
          upgrades: [...prev.upgrades, upgrade.id]
        };
        // Save is handled by the useEffect listener
        return newState;
      });
       setStatistics(prev => ({
            ...prev,
            totalCreditsEarned: prev.totalCreditsEarned + upgrade.cost
        }));
    }
  };

  // Buy skin
  const buySkin = (skin) => {
    // Перевірка наявності достатньої кількості дукткоїнів та чи скін вже не куплений
    if (gameState.duiktcoins >= skin.cost && !(gameState.skins || []).includes(skin.id)) {
      setGameState(prev => ({
          ...prev,
          duiktcoins: prev.duiktcoins - skin.cost,
          skins: [...(prev.skins || []), skin.id] // Додаємо новий скін до масиву
          // Можливо, автоматично активувати куплений скін
          // activeSkin: skin.id
      }));
      // Save is handled by the useEffect listener
    }
  };

  // Activate skin
  const activateSkin = (skinId) => {
    if (gameState.skins.includes(skinId)) {
      setGameState(prev => ({
          ...prev,
          activeSkin: skinId
      }));
      // Save is handled by the useEffect listener
    }
  };

  // Prestige
  const prestige = () => {
    // Приклад умови для престижу: потрібно заробити мінімум 10000 кредитів сумарно
    const prestigeRequirement = 10000;

    if (statistics.totalCreditsEarned >= prestigeRequirement) {
      // Розрахунок бонусних Дукткоїнів (наприклад, 1 Дукткоїн за кожні 10000 зароблених кредитів)
      const bonusDuiktcoins = Math.floor(statistics.totalCreditsEarned / 10000);

      // Розрахунок нового множника престижу (наприклад, +0.1 до множника за кожну точку престижу)
      const newPrestigeMultiplier = 1 + (gameState.prestigePoints + 1) * 0.1;

      setGameState(prev => ({
          ...initialGameState, // Скидаємо стан до початкового
          duiktcoins: prev.duiktcoins + bonusDuiktcoins, // Додаємо бонусні Дукткоїни
          prestigePoints: prev.prestigePoints + 1, // Збільшуємо очки престижу
          prestigeMultiplier: newPrestigeMultiplier, // Встановлюємо новий множник престижу
          skins: prev.skins, // Зберігаємо володіння скінами
          activeSkin: prev.activeSkin // Зберігаємо активний скін
      }));
      setStatistics(initialStatistics); // Скидаємо статистику
      // Save is handled by the useEffect listener
    }
  };

  // Reset game progress
  const resetProgress = async () => {
    // Скидаємо стан гри та статистику до початкових значень
    setGameState(initialGameState);
    setStatistics(initialStatistics);
    // Видаляємо дані з IndexedDB
    await db.gameState.clear();
    await db.statistics.clear();
    // Можливо, перезавантажити сторінку для повного скидання стану
    // window.location.reload();
  };

  return {
    gameState,
    statistics,
    handleClick,
    buyUpgrade,
    prestige,
    resetProgress,
    buySkin, // Додано buySkin
    activateSkin, // Додано activateSkin
    availableSkins: skins // Передаємо список доступних скінів
  };
}; 