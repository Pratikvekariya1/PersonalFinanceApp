import { Transaction, CategoryTotal } from '../types';

/**
 * Groups transactions by category and calculates total spending per category
 * Time Complexity: O(n), Space Complexity: O(k) where k is number of categories
 */
export const groupTransactionsByCategory = (transactions: Transaction[]): CategoryTotal => {
  return transactions.reduce((acc: CategoryTotal, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
};

/**
 * Sorts transactions by date in descending order (newest first)
 * Time Complexity: O(n log n), Space Complexity: O(n)
 */
export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

/**
 * Recursive function to calculate compound interest over n periods
 * Formula: A = P(1 + r/n)^(nt)
 * @param principal - Initial amount
 * @param rate - Annual interest rate (as decimal)
 * @param compoundsPerYear - Number of times interest compounds per year
 * @param years - Number of years
 * @param currentYear - Current year in recursion (default 0)
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  compoundsPerYear: number,
  years: number,
  currentYear: number = 0
): number => {
  // Base case
  if (currentYear >= years) {
    return principal;
  }

  // Calculate interest for current year
  const newPrincipal = principal * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear);
  
  // Recursive call for next year
  return calculateCompoundInterest(newPrincipal, rate, compoundsPerYear, years, currentYear + 1);
};

/**
 * Debounce function for search optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
