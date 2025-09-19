import { useMemo, useCallback } from 'react';
import { Transaction } from '../types';

export const useOptimizedFlatList = (transactions: Transaction[]) => {
  // Memoized key extractor to prevent re-creation on every render
  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  // Memoized getItemLayout for fixed height items (performance boost)
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 80, // Fixed item height
      offset: 80 * index,
      index,
    }),
    []
  );

  // Optimized render configuration
  const flatListProps = useMemo(
    () => ({
      initialNumToRender: 10, // Render only 10 items initially
      maxToRenderPerBatch: 5, // Render 5 items per batch
      windowSize: 21, // Keep 21 screen lengths worth of items
      removeClippedSubviews: true, // Remove off-screen items from view hierarchy
      updateCellsBatchingPeriod: 50, // Batch updates every 50ms
      getItemLayout,
      keyExtractor,
    }),
    [getItemLayout, keyExtractor]
  );

  return flatListProps;
};
