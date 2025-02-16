import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Receipt, FileText, CheckSquare, Settings, LogOut } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  // 役割に基づいてナビゲーションアイテムをフィルタリング
  const navigation = [
    { name: 'ダッシュボード', href: '/', icon: Receipt, roles: ['user', 'approver', 'admin'] },
    { name: '経費一覧', href: '/expenses', icon: FileText, roles: ['user', 'approver', 'admin'] },
    { name: '承認待ち', href: '/approvals', icon: CheckSquare, roles: ['approver', 'admin'] },
    { name: '管理者設定', href: '/admin', icon: Settings, roles: ['admin'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  // 管理者ページへのアクセス制御
  if (location.pathname === '/admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 承認ページへのアクセス制御
  if (location.pathname === '/approvals' && !['approver', 'admin'].includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-[#E3F2FD] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Receipt className="h-8 w-8 text-[#1E88E5]" />
                <span className="ml-2 text-xl font-bold text-gray-900">経費管理システム</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'border-[#1E88E5] text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user?.email}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                  {user?.role === 'admin' ? '管理者' :
                   user?.role === 'approver' ? '承認者' : 'ユーザー'}
                </span>
              </span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}