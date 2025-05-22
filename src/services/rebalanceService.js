const logger = require('../config/logger');

class RebalanceService {
  constructor() {
    this.targetAllocation = Number(process.env.TARGET_BTC_ALLOCATION || 50) / 100; // 50/50 розподіл
    this.rebalanceThreshold = Number(process.env.REBALANCE_THRESHOLD || 7) / 100; // 7% поріг для ребалансування
  }

  /**
   * Перевіряє чи потрібне ребалансування
   * @param {number} btcBalance - Баланс BTC
   * @param {number} xautBalance - Баланс XAUT
   * @param {number} btcPrice - Ціна BTC в USDT
   * @param {number} xautPrice - Ціна XAUT в USDT
   * @returns {boolean} Чи потрібне ребалансування
   */
  shouldRebalance(btcBalance, xautBalance, btcPrice, xautPrice) {
    const btcValue = btcBalance * btcPrice;
    const xautValue = xautBalance * xautPrice;
    const totalValue = btcValue + xautValue;

    if (totalValue === 0) return false;

    const btcAllocation = btcValue / totalValue;
    const deviation = Math.abs(btcAllocation - this.targetAllocation);

    logger.info(`Поточна пропорція BTC: ${(btcAllocation * 100).toFixed(2)}%`);
    logger.info(`Відхилення: ${(deviation * 100).toFixed(2)}%`);

    return deviation > this.rebalanceThreshold;
  }

  /**
   * Розраховує необхідні операції для ребалансування
   * @param {number} btcBalance - Баланс BTC
   * @param {number} xautBalance - Баланс XAUT
   * @param {number} btcPrice - Ціна BTC в USDT
   * @param {number} xautPrice - Ціна XAUT в USDT
   * @returns {Object} Об'єкт з операціями для ребалансування
   */
  calculateRebalanceOperations(btcBalance, xautBalance, btcPrice, xautPrice) {
    const btcValue = btcBalance * btcPrice;
    const xautValue = xautBalance * xautPrice;
    const totalValue = btcValue + xautValue;

    if (totalValue === 0) {
      return { operations: [], message: 'Портфель порожній' };
    }

    const targetBtcValue = totalValue * this.targetAllocation;
    const targetXautValue = totalValue * (1 - this.targetAllocation);

    const operations = [];

    // Розраховуємо різницю в USDT
    const btcDiff = targetBtcValue - btcValue;
    const xautDiff = targetXautValue - xautValue;

    if (btcDiff > 0) {
      // Потрібно купити BTC
      operations.push({
        type: 'BUY',
        asset: 'BTC',
        amount: btcDiff / btcPrice,
        usdtAmount: btcDiff
      });
    } else if (btcDiff < 0) {
      // Потрібно продати BTC
      operations.push({
        type: 'SELL',
        asset: 'BTC',
        amount: Math.abs(btcDiff) / btcPrice,
        usdtAmount: Math.abs(btcDiff)
      });
    }

    if (xautDiff > 0) {
      // Потрібно купити XAUT
      operations.push({
        type: 'BUY',
        asset: 'XAUT',
        amount: xautDiff / xautPrice,
        usdtAmount: xautDiff
      });
    } else if (xautDiff < 0) {
      // Потрібно продати XAUT
      operations.push({
        type: 'SELL',
        asset: 'XAUT',
        amount: Math.abs(xautDiff) / xautPrice,
        usdtAmount: Math.abs(xautDiff)
      });
    }

    return {
      operations,
      message: 'Розраховано операції для ребалансування'
    };
  }

  /**
   * Виконує ребалансування портфелю
   * @param {number} btcBalance - Баланс BTC
   * @param {number} xautBalance - Баланс XAUT
   * @param {number} btcPrice - Ціна BTC в USDT
   * @param {number} xautPrice - Ціна XAUT в USDT
   * @returns {Object} Результат ребалансування
   */
  rebalance(btcBalance, xautBalance, btcPrice, xautPrice) {
    if (!this.shouldRebalance(btcBalance, xautBalance, btcPrice, xautPrice)) {
      return {
        operations: [],
        message: 'Ребалансування не потрібне'
      };
    }

    return this.calculateRebalanceOperations(btcBalance, xautBalance, btcPrice, xautPrice);
  }
}

module.exports = new RebalanceService(); 