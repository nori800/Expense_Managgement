import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { mockExpenses } from '../mocks/expenses';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  // ダミーデータの集計
  const pendingCount = mockExpenses.filter(e => e.status === 'pending').length;
  const approvedCount = mockExpenses.filter(e => e.status === 'approved').length;
  const rejectedCount = mockExpenses.filter(e => e.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">ようこそ、{user?.email}さん</h1>
        <p className="mt-1 text-sm text-gray-500">
          経費の申請や確認をこちらで行えます。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-[#FFA000]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">承認待ち</dt>
                  <dd className="text-lg font-semibold text-gray-900">{pendingCount}件</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-[#43A047]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">承認済み</dt>
                  <dd className="text-lg font-semibold text-gray-900">{approvedCount}件</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-[#E53935]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">否認</dt>
                  <dd className="text-lg font-semibold text-gray-900">{rejectedCount}件</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/expenses/new"
          className="bg-white overflow-hidden shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusCircle className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-900">新規申請</dt>
                  <dd className="text-sm text-gray-500">経費を申請する</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">最近の申請</h3>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.storeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{expense.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {expense.status === 'pending' ? '承認待ち' :
                           expense.status === 'approved' ? '承認済み' :
                           '否認'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}