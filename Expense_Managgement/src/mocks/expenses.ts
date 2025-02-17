import { ExpenseStatus } from '../services/mockExpenseService';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  date: string;
  storeName: string;
  items: string;
  imageUrl: string;
  status: ExpenseStatus;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

// モック経費データ
export const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: 'test-user-id',
    amount: 3500,
    date: '2025-02-15',
    storeName: '株式会社文具堂',
    items: 'ノート、ボールペン、付箋',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    status: 'pending',
    comments: 'オフィス用品の補充',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'test-user-id',
    amount: 12000,
    date: '2025-02-14',
    storeName: '駅前居酒屋',
    items: '取引先との会食',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    status: 'approved',
    comments: '新規案件の打ち合わせ',
    createdAt: '2025-02-14T18:30:00Z',
    updatedAt: '2025-02-15T09:00:00Z'
  },
  {
    id: '3',
    userId: 'test-user-id',
    amount: 5000,
    date: '2025-02-13',
    storeName: 'タクシー',
    items: '深夜帰宅',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
    status: 'rejected',
    comments: '遅延による緊急対応',
    createdAt: '2025-02-13T23:45:00Z',
    updatedAt: '2025-02-14T10:00:00Z'
  }
]; 