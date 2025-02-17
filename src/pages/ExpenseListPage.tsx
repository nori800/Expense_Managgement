import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Download, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { dummyExpenses } from '../store/authStore';
import type { Expense } from '../types';

export function ExpenseListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof Expense) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredExpenses = dummyExpenses
    .filter(expense => {
      const matchesSearch = 
        expense.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.items.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDateRange = 
        (!dateRange.start || new Date(expense.date) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(expense.date) <= new Date(dateRange.end));
      
      const matchesAmountRange =
        (!amountRange.min || expense.amount >= Number(amountRange.min)) &&
        (!amountRange.max || expense.amount <= Number(amountRange.max));
      
      const matchesStatus = 
        statusFilter.length === 0 || statusFilter.includes(expense.status);
      
      return matchesSearch && matchesDateRange && matchesAmountRange && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">経費一覧</h1>
        <div className="flex space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
          >
            <Download className="-ml-1 mr-2 h-4 w-4" />
            CSVエクスポート
          </button>
          <Link
            to="/expenses/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1E88E5] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
          >
            <PlusCircle className="-ml-1 mr-2 h-4 w-4" />
            新規申請
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {/* 検索・フィルターセクション */}
          <div className="mb-6 space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm"
                  placeholder="店舗名・品目で検索..."
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
                onClick={() => {/* フィルターモーダルを開く */}}
              >
                <Filter className="-ml-1 mr-2 h-4 w-4" />
                フィルター
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">期間:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm border-gray-300 rounded-md"
                />
                <span>～</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">金額:</label>
                <input
                  type="number"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="最小"
                  className="w-24 shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm border-gray-300 rounded-md"
                />
                <span>～</span>
                <input
                  type="number"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="最大"
                  className="w-24 shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">ステータス:</label>
                <select
                  multiple
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(Array.from(e.target.selectedOptions, option => option.value))}
                  className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="pending">承認待ち</option>
                  <option value="approved">承認済み</option>
                  <option value="rejected">否認</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('date')}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>申請日</span>
                      {sortConfig?.key === 'date' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('storeName')}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>店舗</span>
                      {sortConfig?.key === 'storeName' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    項目
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>金額</span>
                      {sortConfig?.key === 'amount' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>ステータス</span>
                      {sortConfig?.key === 'status' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.items}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        type="button"
                        className="text-[#1E88E5] hover:text-[#1976D2] font-medium"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}