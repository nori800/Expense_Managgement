export type User = {
  id: string;
  email: string;
  role: 'user' | 'approver' | 'admin';
};

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  date: string;
  storeName: string;
  items: string;
  imageUrl: string;
  status: ExpenseStatus;
  comments?: string;
  createdAt: string;
  updatedAt: string;
};