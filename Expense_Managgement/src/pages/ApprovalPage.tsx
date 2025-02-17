import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { mockExpenses } from '../mocks/expenses';

export function ApprovalPage() {
  // 承認待ちの経費のみフィルタリング
  const pendingExpenses = mockExpenses.filter(expense => expense.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">承認待ち一覧</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {pendingExpenses.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">
              承認待ちの経費申請はありません
            </div>
          ) : (
            <div className="space-y-4">
              {pendingExpenses.map((expense) => (
                <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{expense.storeName}</p>
                      <p className="text-sm text-gray-500">{expense.items}</p>
                      <p className="text-sm text-gray-500">{expense.date}</p>
                      <p className="text-lg font-semibold text-gray-900">¥{expense.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#43A047] hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#43A047]"
                      >
                        <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                        承認
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935]"
                      >
                        <XCircle className="-ml-1 mr-2 h-4 w-4" />
                        否認
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <img
                      src={expense.imageUrl}
                      alt="領収書"
                      className="w-full max-w-lg mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                  {expense.comments && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="font-medium">コメント：</p>
                      <p>{expense.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}