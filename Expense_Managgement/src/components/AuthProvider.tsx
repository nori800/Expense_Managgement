import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Layout } from './Layout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NewExpensePage } from '../pages/NewExpensePage';
import { ExpenseListPage } from '../pages/ExpenseListPage';
import { ApprovalPage } from '../pages/ApprovalPage';
import { AdminPage } from '../pages/AdminPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AuthProvider() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const setLoading = useAuthStore((state) => state.setLoading);

  React.useEffect(() => {
    // 初期ローディング状態を解除
    setLoading(false);
  }, [setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 未認証ユーザー用のルート */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />

      {/* 認証済みユーザー用のルート */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/expenses/new" element={<NewExpensePage />} />
          <Route path="/expenses" element={<ExpenseListPage />} />
          <Route path="/approvals" element={<ApprovalPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      {/* 存在しないパスの場合はログインページにリダイレクト */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}