import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText
}: TextInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md ${
            error ? 'border-red-300' : ''
          }`}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
} 