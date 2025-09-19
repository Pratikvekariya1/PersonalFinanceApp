import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = memo(
  ({ transaction, onDelete }) => {
    const handleDelete = () => onDelete(transaction);

    return (
      <View style={styles.container}>
        <View style={styles.left}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor:
                  transaction.type === 'income' ? '#4CAF50' : '#F44336',
              },
            ]}
          >
            <Icon
              name={
                transaction.type === 'income' ? 'trending-up' : 'trending-down'
              }
              size={20}
              color="white"
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.description} numberOfLines={1}>
              {transaction.description}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {transaction.category}
            </Text>
            <Text style={styles.date}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text
            style={[
              styles.amount,
              { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' },
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}$
            {transaction.amount.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  // Custom comparison function for memo
  (prevProps, nextProps) => {
    return (
      prevProps.transaction.id === nextProps.transaction.id &&
      prevProps.transaction.description === nextProps.transaction.description &&
      prevProps.transaction.amount === nextProps.transaction.amount &&
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

const styles = StyleSheet.create({
  container: {
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
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
  right: {
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
});

export default TransactionItem;
