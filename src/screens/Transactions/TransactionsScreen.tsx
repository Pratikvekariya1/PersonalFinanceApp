import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store';
import { deleteTransaction } from '../../store/slices/transactionSlice';
import { Transaction } from '../../types';
import { sortTransactionsByDate, debounce } from '../../utils/transactionUtils';

const ITEMS_PER_PAGE = 20;

const TransactionsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state: RootState) => state.transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (searchQuery.trim()) {
      filtered = transactions.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return sortTransactionsByDate(filtered);
  }, [transactions, searchQuery]);

  // Paginated transactions for infinite scroll
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset pagination when searching
    }, 300),
    []
  );

  const handleDelete = useCallback((transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteTransaction(transaction.id)),
        },
      ]
    );
  }, [dispatch]);

  const loadMoreTransactions = useCallback(() => {
    if (paginatedTransactions.length < filteredTransactions.length && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginatedTransactions.length, filteredTransactions.length, loading]);

  const renderTransaction = useCallback(({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: item.type === 'income' ? '#4CAF50' : '#F44336' }
        ]}>
          <Icon 
            name={item.type === 'income' ? 'trending-up' : 'trending-down'} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.amount,
          { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
        ]}>
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  ), [handleDelete]);

  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.footer}>
          <Text>Loading more transactions...</Text>
        </View>
      );
    }
    return null;
  }, [loading]);

  // Optimized keyExtractor
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          onChangeText={debouncedSearch}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={paginatedTransactions}
        keyExtractor={keyExtractor}
        renderItem={renderTransaction}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 80,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default TransactionsScreen;
