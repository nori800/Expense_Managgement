import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseForm } from '../components/ExpenseForm/ExpenseForm';
import type { ExpenseFormData } from '../components/ExpenseForm/ExpenseForm';
import { mockExpenseService } from '../services/mockExpenseService';

export function NewExpensePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      await mockExpenseService.createExpense({
        amount: data.amount,
        date: data.date,
        storeName: data.storeName,
        items: data.items,
        comments: data.comments,
        // TODO: 画像のアップロード処理を実装
        imageUrl: URL.createObjectURL(data.image as Blob)
      });
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-xl font-semibold text-gray-900">経費申請</h1>
          <p className="mt-1 text-sm text-gray-500">* は必須項目です</p>
          
          <div className="mt-6">
            <ExpenseForm
              onSubmit={handleSubmit}
              onCancel={() => navigate('/expenses')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}