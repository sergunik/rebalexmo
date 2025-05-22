const TelegramBot = require('node-telegram-bot-api');
const logger = require('../config/logger');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }

  async sendMessage(message) {
    try {
      await this.bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
      logger.info('Повідомлення успішно відправлено в Telegram');
    } catch (error) {
      logger.error('Помилка відправки повідомлення в Telegram:', error);
    }
  }
}

module.exports = new TelegramService(); 