const rebalanceService = require('../rebalanceService');

describe('RebalanceService', () => {
  // Тестові дані
  const testCases = [
    {
      name: 'Потрібне ребалансування (BTC > 57%)',
      input: {
        btcBalance: 1.0,
        xautBalance: 10.0,
        btcPrice: 50000,
        xautPrice: 2000
      },
      expectedRebalance: true
    },
    {
      name: 'Потрібне ребалансування (BTC < 43%)',
      input: {
        btcBalance: 0.5,
        xautBalance: 20.0,
        btcPrice: 50000,
        xautPrice: 2000
      },
      expectedRebalance: true
    },
    {
      name: 'Ребалансування не потрібне (в межах ±7%)',
      input: {
        btcBalance: 0.52,
        xautBalance: 12.0,
        btcPrice: 50000,
        xautPrice: 2000
      },
      expectedRebalance: false
    }
  ];

  describe('shouldRebalance', () => {
    testCases.forEach(testCase => {
      it(testCase.name, () => {
        const { btcBalance, xautBalance, btcPrice, xautPrice } = testCase.input;
        const result = rebalanceService.shouldRebalance(
          btcBalance,
          xautBalance,
          btcPrice,
          xautPrice
        );
        expect(result).toBe(testCase.expectedRebalance);
      });
    });
  });

  describe('calculateRebalanceOperations', () => {
    it('повинен правильно розраховувати операції для ребалансування', () => {
      const result = rebalanceService.calculateRebalanceOperations(
        1.0, // btcBalance
        10.0, // xautBalance
        50000, // btcPrice
        2000 // xautPrice
      );

      expect(result.operations).toBeDefined();
      expect(Array.isArray(result.operations)).toBe(true);
      expect(result.message).toBeDefined();
    });

    it('повинен повертати порожній масив для порожнього портфелю', () => {
      const result = rebalanceService.calculateRebalanceOperations(
        0, // btcBalance
        0, // xautBalance
        50000, // btcPrice
        2000 // xautPrice
      );

      expect(result.operations).toHaveLength(0);
      expect(result.message).toBe('Портфель порожній');
    });
  });

  describe('rebalance', () => {
    it('повинен повертати порожній масив, якщо ребалансування не потрібне', () => {
      const result = rebalanceService.rebalance(
        0.52, // btcBalance
        12.0, // xautBalance
        50000, // btcPrice
        2000 // xautPrice
      );

      expect(result.operations).toHaveLength(0);
      expect(result.message).toBe('Ребалансування не потрібне');
    });

    it('повинен повертати операції для ребалансування, якщо воно потрібне', () => {
      const result = rebalanceService.rebalance(
        1.0, // btcBalance
        10.0, // xautBalance
        50000, // btcPrice
        2000 // xautPrice
      );

      expect(result.operations.length).toBeGreaterThan(0);
      expect(result.message).toBe('Розраховано операції для ребалансування');
    });
  });
}); 