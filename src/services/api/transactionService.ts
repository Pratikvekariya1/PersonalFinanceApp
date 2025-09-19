import axios from 'axios';
import { Transaction } from '../../types';

const API_BASE_URL = 'https://api.personalfinance.mock.com'; // Mock API

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout'));
    }
    return Promise.reject(error);
  }
);

export const transactionService = {
  getAllTransactions: async () => {
    try {
      // Mock response for demonstration
      return {
        data: [
          {
            id: '1',
            amount: 50,
            category: 'Food',
            description: 'Grocery shopping',
            type: 'expense' as const,
            date: '2024-01-15',
            createdAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      // Mock API call - in real app, this would be: return apiClient.post('/transactions', transaction);
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return { data: newTransaction };
    } catch (error) {
      throw error;
    }
  },

  updateTransaction: async (id: string, transaction: Partial<Transaction>) => {
    return apiClient.put(`/transactions/${id}`, transaction);
  },

  deleteTransaction: async (id: string) => {
    return apiClient.delete(`/transactions/${id}`);
  },
};
