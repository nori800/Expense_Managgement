import React, { useState } from 'react';
import { Download, Users, Receipt, CreditCard, ArrowUpRight, Search, Check, X } from 'lucide-react';
import { dummyExpenses } from '../store/authStore';

// 管理者ページ用のダミーユーザーデータ
const dummyUsers = [
  { id: 1, email: 'yamada@example.com', role: 'user', lastLogin: '2025-02-16 14:30' },
  { id: 2, email: 'suzuki@example.com', role: 'approver', lastLogin: '2025-02-16 13:15' },
  { id: 3, email: 'tanaka@example.com', role: 'admin', lastLogin: '2025-02-16 11:45' },
];

const dummyStats = {
  totalUsers: dummyUsers.length,
  totalExpenses: dummyExpenses.length,
  totalAmount: dummyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
  recentActivity: [
    { id: 1, user: '山田太郎', action: 'ユーザー登録', date: '2025-02-16 14:30' },
    { id: 2, user: '鈴木花子', action: '経費申請', date: '2025-02-16 13:15' },
    { id: 3, user: '佐藤次郎', action: '経費承認', date: '2025-02-16 11:45' },
  ]
};

export function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof dummyUsers[0] | null>(null);

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    // TODO: Implement role change logic with Supabase
    console.log(`Changing role for user ${userId} to ${newRole}`);
    setShowRoleModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1E88E5] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
        >
          <Download className="-ml-1 mr-2 h-4 w-4" />
          CSVエクスポート
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">総ユーザー数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {dummyStats.totalUsers}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">増加</span>
                      12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">総申請件数</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {dummyStats.totalExpenses}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">総申請金額</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ¥{dummyStats.totalAmount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">ユーザー管理</h2>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm"
                  placeholder="メールアドレスで検索..."
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm rounded-md"
              >
                <option value="all">全ての役割</option>
                <option value="user">一般ユーザー</option>
                <option value="approver">承認者</option>
                <option value="admin">管理者</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">現在の役割</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終ログイン</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'approver' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? '管理者' :
                         user.role === 'approver' ? '承認者' : 'ユーザー'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="text-[#1E88E5] hover:text-[#1976D2] font-medium"
                      >
                        役割を変更
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 役割変更モーダル */}
      {showRoleModal && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  役割の変更
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedUser.email} の役割を変更します。
                </p>
                <div className="space-y-4">
                  {['user', 'approver', 'admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(selectedUser.id, role)}
                      className={`w-full inline-flex items-center justify-between px-4 py-2 border rounded-md ${
                        selectedUser.role === role
                          ? 'border-[#1E88E5] bg-blue-50 text-[#1E88E5]'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium">
                          {role === 'admin' ? '管理者' :
                           role === 'approver' ? '承認者' : 'ユーザー'}
                        </span>
                      </span>
                      {selectedUser.role === role && (
                        <Check className="h-5 w-5 text-[#1E88E5]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1E88E5] text-base font-medium text-white hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5] sm:text-sm"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}