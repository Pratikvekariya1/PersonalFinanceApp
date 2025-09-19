export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
}

export interface CategoryTotal {
  [category: string]: number;
}

export interface AppState {
  transactions: Transaction[];
  categories: string[];
  loading: boolean;
  error: string | null;
}
