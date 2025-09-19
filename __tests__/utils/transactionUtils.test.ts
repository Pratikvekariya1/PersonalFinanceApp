import {
  groupTransactionsByCategory,
  sortTransactionsByDate,
  calculateCompoundInterest,
} from '../../src/utils/transactionUtils';
import { Transaction } from '../../src/types';

describe('Transaction Utils', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 50,
      category: 'Food',
      description: 'Grocery',
      type: 'expense',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      amount: 30,
      category: 'Transport',
      description: 'Bus fare',
      type: 'expense',
      date: '2024-01-16',
      createdAt: '2024-01-16T10:00:00Z',
    },
    {
      id: '3',
      amount: 20,
      category: 'Food',
      description: 'Coffee',
      type: 'expense',
      date: '2024-01-14',
      createdAt: '2024-01-14T10:00:00Z',
    },
  ];

  describe('groupTransactionsByCategory', () => {
    it('should group transactions by category correctly', () => {
      const result = groupTransactionsByCategory(mockTransactions);
      expect(result).toEqual({
        Food: 70,
        Transport: 30,
      });
    });

    it('should return empty object for empty array', () => {
      const result = groupTransactionsByCategory([]);
      expect(result).toEqual({});
    });
  });

  describe('sortTransactionsByDate', () => {
    it('should sort transactions by date in descending order', () => {
      const result = sortTransactionsByDate(mockTransactions);
      expect(result[0].date).toBe('2024-01-16');
      expect(result[1].date).toBe('2024-01-15');
      expect(result[2].date).toBe('2024-01-14');
    });

    it('should not mutate original array', () => {
      const originalLength = mockTransactions.length;
      sortTransactionsByDate(mockTransactions);
      expect(mockTransactions.length).toBe(originalLength);
      expect(mockTransactions[0].date).toBe('2024-01-15'); // Original order preserved
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly', () => {
      const result = calculateCompoundInterest(1000, 0.05, 12, 2);
      expect(result).toBeCloseTo(1104.89, 2);
    });

    it('should return original principal for 0 years', () => {
      const result = calculateCompoundInterest(1000, 0.05, 12, 0);
      expect(result).toBe(1000);
    });

    it('should handle edge case of 0% interest rate', () => {
      const result = calculateCompoundInterest(1000, 0, 12, 5);
      expect(result).toBe(1000);
    });
  });
});
