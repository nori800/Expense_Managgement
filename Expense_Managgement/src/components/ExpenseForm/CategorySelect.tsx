import React from 'react';

// 経費カテゴリーの定義
export const EXPENSE_CATEGORIES = [
  { id: 'transportation', name: '交通費' },
  { id: 'meals', name: '飲食費' },
  { id: 'accommodation', name: '宿泊費' },
  { id: 'supplies', name: '備品費' },
  { id: 'entertainment', name: '接待費' },
  { id: 'others', name: 'その他' },
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['id'];

interface CategorySelectProps {
  value: ExpenseCategory;
  onChange: (value: ExpenseCategory) => void;
  error?: string;
}

export function CategorySelect({ value, onChange, error }: CategorySelectProps) {
  return (
    <div className="space-y-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ExpenseCategory)}
        className={`block w-full rounded-md py-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        } sm:text-sm`}
      >
        {EXPENSE_CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 