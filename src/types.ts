export interface User {
  id: string;
  phoneCountryCode: string;
  phoneNumber: string;
  name: string;
  createdAt: string;
  currency?: string;
  dailyExpenseBudget?: number;
}

export type TransactionType = 'income' | 'expense' | 'micro';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface SpendAdvice {
  tips: {
    title: string;
    description: string;
    potentialSavings: number;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  generalAnalysis: string;
}
