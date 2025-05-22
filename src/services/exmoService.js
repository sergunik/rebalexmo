const axios = require('axios');
const logger = require('../config/logger');
const fileService = require('./fileService');
const telegramService = require('./telegramService');

class ExmoService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.exmo.com/v1.1',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async checkMarket() {
    try {
      const response = await this.api.get('/ticker');
      const data = response.data;
      
      await fileService.saveToFile(data, 'market_data.json');
      logger.info('Отримано нові дані з ринку');
      
      return data;
    } catch (error) {
      logger.error('Помилка при роботі з EXMO API:', error);
      throw error;
    }
  }
}

module.exports = new ExmoService(); 