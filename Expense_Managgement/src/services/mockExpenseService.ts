import { mockExpenses, Expense } from '../mocks/expenses';

// 型定義
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface ExpenseInput {
  amount: number;
  date: string;
  storeName: string;
  items: string;
  comments?: string;
  imageUrl?: string;
}

// インメモリストレージ
let expenses: Expense[] = [...mockExpenses];

export const mockExpenseService = {
  // 経費一覧の取得
  getExpenses: async (): Promise<Expense[]> => {
    return expenses;
  },

  // 経費の詳細取得
  getExpenseById: async (id: string): Promise<Expense | null> => {
    const expense = expenses.find(e => e.id === id);
    return expense || null;
  },

  // 経費の作成
  createExpense: async (input: ExpenseInput): Promise<Expense> => {
    const newExpense: Expense = {
      ...input,
      id: crypto.randomUUID(),
      userId: 'test-user-id', // モック用のユーザーID
      status: 'pending',
      imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85', // デフォルト画像
      comments: input.comments || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses = [...expenses, newExpense];
    return newExpense;
  },

  // 経費の更新
  updateExpense: async (id: string, input: Partial<ExpenseInput> & { status?: ExpenseStatus }): Promise<Expense> => {
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('経費が見つかりません');
    }

    const updatedExpense: Expense = {
      ...expenses[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    expenses = expenses.map(e => e.id === id ? updatedExpense : e);
    return updatedExpense;
  },

  // 経費の削除
  deleteExpense: async (id: string): Promise<void> => {
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('経費が見つかりません');
    }
    expenses = expenses.filter(e => e.id !== id);
  },

  // 経費の承認
  approveExpense: async (id: string, comments?: string): Promise<Expense> => {
    return mockExpenseService.updateExpense(id, {
      status: 'approved',
      comments,
    });
  },

  // 経費の却下
  rejectExpense: async (id: string, comments: string): Promise<Expense> => {
    return mockExpenseService.updateExpense(id, {
      status: 'rejected',
      comments,
    });
  },

  // 経費のフィルタリング（ステータス別）
  getExpensesByStatus: async (status: ExpenseStatus): Promise<Expense[]> => {
    return expenses.filter(e => e.status === status);
  },

  // 経費の検索（店舗名、コメント）
  searchExpenses: async (query: string): Promise<Expense[]> => {
    const lowercaseQuery = query.toLowerCase();
    return expenses.filter(e => 
      e.storeName.toLowerCase().includes(lowercaseQuery) ||
      e.comments?.toLowerCase().includes(lowercaseQuery)
    );
  }
}; 