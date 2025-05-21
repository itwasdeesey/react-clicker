export const skins = [
  {
    id: 1,
    name: 'Базовий Скін',
    cost: 0, // Безкоштовний початковий скін
    className: 'default-skin',
    colors: {
      primary: '#4ecca3', /* Основний акцентний колір */
      secondary: '#1a1a2e', /* Темний фон */
      tertiary: '#16213e', /* Темніший фон */
      text: '#fff', /* Колір основного тексту */
      resource: 'rgba(255, 255, 255, 0.1)', /* Фон ресурсів/карток */
      resourceText: '#fff', /* Колір тексту ресурсів */
      duiktcoin: '#ffd700', /* Колір дукткоїнів */
      prestige: '#ff6b6b', /* Колір престижу */
      button: '#4ecca3', /* Колір кнопки (загальний або фоновий) */
      buttonText: '#1a1a2e', /* Колір тексту кнопки */
      buttonHover: '#3db389', /* Колір кнопки при наведенні */
      border: '#4ecca3' /* Колір рамки */
    }
  },
  {
    id: 2,
    name: 'Золотий Клік',
    cost: 1, // Коштує 1 Дукткоїн
    className: 'golden-click-skin',
    colors: {
      primary: '#ffd700', // Gold
      secondary: '#2c3e50', // Dark blue-gray
      tertiary: '#34495e', // Slightly lighter dark blue-gray
      text: '#ecf0f1', // Light gray
      resource: 'rgba(255, 215, 0, 0.1)', // Gold with transparency
      resourceText: '#ecf0f1',
      duiktcoin: '#f1c40f', // Brighter gold
      prestige: '#e74c3c', // Red
      button: '#f39c12', // Orange gold
      buttonText: '#2c3e50',
      buttonHover: '#e67e22', // Darker orange gold
      border: '#f39c12'
    }
  },
  {
    id: 3,
    name: 'Неоновий Клік',
    cost: 2, // Коштує 2 Дукткоїни
    className: 'neon-click-skin',
    colors: {
      primary: '#9b59b6', // Amethyst
      secondary: '#341f97', // Dark purple
      tertiary: '#5f27cd', // Brighter purple
      text: '#ecf0f1',
      resource: 'rgba(155, 89, 182, 0.1)', // Purple with transparency
      resourceText: '#ecf0f1',
      duiktcoin: '#00cec9', // Cyan
      prestige: '#d63031', // Red
      button: '#8e44ad', // Dark amethyst
      buttonText: '#ecf0f1',
      buttonHover: '#9b59b6', // Amethyst
      border: '#8e44ad'
    }
  }
]; 