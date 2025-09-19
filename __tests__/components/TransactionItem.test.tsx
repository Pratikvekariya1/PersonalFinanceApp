import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import transactionSlice from '../../src/store/slices/transactionSlice';
import TransactionsScreen from '../../src/screens/Transactions/TransactionsScreen';

const mockStore = configureStore({
  reducer: {
    transactions: transactionSlice,
  },
  preloadedState: {
    transactions: {
      transactions: [
        {
          id: '1',
          amount: 50,
          category: 'Food',
          description: 'Test transaction',
          type: 'expense' as const,
          date: '2024-01-15',
          createdAt: '2024-01-15T10:00:00Z',
        },
      ],
      categories: ['Food', 'Transport'],
      loading: false,
      error: null,
    },
  },
});

describe('TransactionsScreen', () => {
  it('should render transaction list correctly', () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <TransactionsScreen />
      </Provider>
    );

    expect(getByText('Test transaction')).toBeTruthy();
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('-$50.00')).toBeTruthy();
  });

  it('should filter transactions based on search query', () => {
    const { getByPlaceholderText, queryByText } = render(
      <Provider store={mockStore}>
        <TransactionsScreen />
      </Provider>
    );

    const searchInput = getByPlaceholderText('Search transactions...');
    fireEvent.changeText(searchInput, 'nonexistent');

    // Should not find any transactions
    expect(queryByText('Test transaction')).toBeFalsy();
  });
});
