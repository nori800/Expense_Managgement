import { User } from '../store/authStore';
import { mockUsers } from '../mocks/users';

export const mockAuthService = {
  // ログイン
  signIn: async (email: string, password: string): Promise<User> => {
    // テスト用の簡易認証
    if (email === 'test@example.com' && password === 'password') {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        return user;
      }
    }
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  },

  // サインアップ
  signUp: async (email: string, password: string): Promise<User> => {
    // 既存ユーザーのチェック
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    // 新規ユーザーの作成
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      role: 'user'
    };

    // 実際のアプリケーションではここでDBに保存
    mockUsers.push(newUser);
    
    return newUser;
  },

  // ログアウト
  signOut: async (): Promise<void> => {
    // 実際のアプリケーションではここでセッションをクリア
    return Promise.resolve();
  },

  // 現在のユーザーを取得
  getCurrentUser: async (): Promise<User | null> => {
    // テスト用に常にnullを返す
    return null;
  },

  // パスワードリセット（モック）
  resetPassword: async (email: string): Promise<void> => {
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    // 実際のアプリケーションではここでパスワードリセットメールを送信
    return Promise.resolve();
  },

  // メールアドレス更新（モック）
  updateEmail: async (userId: string, newEmail: string): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('ユーザーが見つかりません');
    }

    // メールアドレスの重複チェック
    if (mockUsers.some(u => u.email === newEmail)) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    // ユーザー情報の更新
    const updatedUser: User = {
      ...mockUsers[userIndex],
      email: newEmail
    };
    mockUsers[userIndex] = updatedUser;

    return updatedUser;
  }
}; 