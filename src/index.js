require('dotenv').config();
const logger = require('./config/logger');
const fileService = require('./services/fileService');
const exmoService = require('./services/exmoService');

async function main() {
  try {
    // Створення директорії для даних
    await fileService.ensureDataDirectory();
    
    // Запуск перевірки ринку кожні 5 хвилин
    setInterval(async () => {
      try {
        await exmoService.checkMarket();
      } catch (error) {
        logger.error('Помилка при перевірці ринку:', error);
      }
    }, 5 * 60 * 1000);
    
    // Початкова перевірка
    await exmoService.checkMarket();
    
    logger.info('Додаток запущено');
  } catch (error) {
    logger.error('Критична помилка при запуску:', error);
    process.exit(1);
  }
}

main(); 