import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { RootState } from '../../store';
import { addTransactionLocal } from '../../store/slices/transactionSlice';
import { Transaction } from '../../types';

interface FormData {
  description: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
}

const AddTransactionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.transactions);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: '',
      amount: '',
      category: categories[0],
      type: 'expense',
    },
  });

  const onSubmit = (data: FormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type,
      date: selectedDate.toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    dispatch(addTransactionLocal(newTransaction));
    
    Alert.alert(
      'Success',
      'Transaction added successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setSelectedDate(new Date());
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Transaction</Text>
        </View>

        <View style={styles.form}>
          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <Controller
              control={control}
              name="description"
              rules={{
                required: 'Description is required',
                minLength: {
                  value: 3,
                  message: 'Description must be at least 3 characters',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.description && styles.inputError]}
                  placeholder="Enter transaction description"
                  value={value}
                  onChangeText={onChange}
                  maxLength={100}
                />
              )}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            )}
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <Controller
              control={control}
              name="amount"
              rules={{
                required: 'Amount is required',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'Please enter a valid amount',
                },
                validate: (value) => {
                  const num = parseFloat(value);
                  return num > 0 || 'Amount must be greater than 0';
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.amount && styles.inputError]}
                  placeholder="0.00"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}
            />
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount.message}</Text>
            )}
          </View>

          {/* Transaction Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      value === 'expense' && styles.typeButtonActive,
                      { backgroundColor: value === 'expense' ? '#F44336' : '#f0f0f0' },
                    ]}
                    onPress={() => onChange('expense')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        value === 'expense' && styles.typeButtonTextActive,
                      ]}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      value === 'income' && styles.typeButtonActive,
                      { backgroundColor: value === 'income' ? '#4CAF50' : '#f0f0f0' },
                    ]}
                    onPress={() => onChange('income')}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        value === 'income' && styles.typeButtonTextActive,
                      ]}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          value === category && styles.categoryButtonActive,
                        ]}
                        onPress={() => onChange(category)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            value === category && styles.categoryButtonTextActive,
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            />
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate.toDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate}
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            setSelectedDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    // backgroundColor set dynamically
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
