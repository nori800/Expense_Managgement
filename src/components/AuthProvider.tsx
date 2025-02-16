import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // テスト用に常にログイン状態を設定
  React.useEffect(() => {
    setUser({
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin'
    });
  }, [setUser]);

  return <>{children}</>;
}