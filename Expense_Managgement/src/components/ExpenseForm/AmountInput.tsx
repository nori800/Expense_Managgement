import React from 'react';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 数値以外の文字を削除
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    
    // 空文字列の場合は0として扱う
    const newValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
    
    onChange(newValue);
  };

  // 表示用にフォーマット（カンマ区切り）
  const displayValue = value.toLocaleString();

  return (
    <div className="space-y-1">
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">¥</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={`block w-full rounded-md pl-7 pr-12 py-2 text-right ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } sm:text-sm`}
          placeholder="0"
          aria-describedby="amount-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="amount-currency">
            円
          </span>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 