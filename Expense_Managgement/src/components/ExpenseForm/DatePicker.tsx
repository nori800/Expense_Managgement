import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DatePicker({ value, onChange, error }: DatePickerProps) {
  return (
    <div className="space-y-1">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md py-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        } sm:text-sm`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 