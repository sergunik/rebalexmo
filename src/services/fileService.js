const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');

class FileService {
  constructor() {
    this.dataDir = path.join(__dirname, '..', '..', 'data');
  }

  async ensureDataDirectory() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir);
      logger.info('Створено директорію для даних');
    }
  }

  async saveToFile(data, filename) {
    const filePath = path.join(this.dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.info(`Дані збережено у файл: ${filename}`);
  }

  async readFromFile(filename) {
    const filePath = path.join(this.dataDir, filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Помилка читання файлу ${filename}:`, error);
      return null;
    }
  }
}

module.exports = new FileService(); 