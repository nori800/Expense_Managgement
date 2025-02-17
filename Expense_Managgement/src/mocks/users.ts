import { User } from '../store/authStore';

// 拡張したUser型
interface ExtendedUser extends User {
  lastLogin: string;
}

// モックユーザーデータ
export const mockUsers: ExtendedUser[] = [
  {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'admin',
    lastLogin: '2025-02-16 14:30'
  },
  {
    id: 'user-1',
    email: 'user1@example.com',
    role: 'approver',
    lastLogin: '2025-02-16 13:15'
  },
  {
    id: 'user-2',
    email: 'user2@example.com',
    role: 'user',
    lastLogin: '2025-02-16 11:45'
  }
]; 