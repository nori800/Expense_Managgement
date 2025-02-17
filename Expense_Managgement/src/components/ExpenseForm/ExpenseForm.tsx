import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { AmountInput } from './AmountInput';
import { DatePicker } from './DatePicker';
import { CategorySelect, ExpenseCategory } from './CategorySelect';
import { TextInput } from './TextInput';
import { TextArea } from './TextArea';

interface ExpenseFormData {
  amount: number;
  date: string;
  category: ExpenseCategory;
  storeName: string;
  items: string;
  comments: string;
  image: File | null;
}

export type { ExpenseFormData };

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ExpenseFormData>;
}

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount ?? 0,
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    category: initialData?.category ?? 'others',
    storeName: initialData?.storeName ?? '',
    items: initialData?.items ?? '',
    comments: initialData?.comments ?? '',
    image: initialData?.image ?? null
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // バリデーション
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    if (formData.amount <= 0) {
      newErrors.amount = '金額を入力してください';
    }
    if (!formData.date) {
      newErrors.date = '日付を選択してください';
    }
    if (!formData.storeName.trim()) {
      newErrors.storeName = '店舗名を入力してください';
    }
    if (!formData.items.trim()) {
      newErrors.items = '購入品目を入力してください';
    }
    if (!formData.image) {
      newErrors.image = '領収書画像をアップロードしてください';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit expense:', error);
      // エラーハンドリング
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            領収書画像 <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <ImageUpload
              onFileSelect={(file) => setFormData({ ...formData, image: file })}
              error={errors.image}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              金額 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <AmountInput
                value={formData.amount}
                onChange={(value) => setFormData({ ...formData, amount: value })}
                error={errors.amount}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">1円単位で入力してください</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              日付 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <DatePicker
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
                error={errors.date}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">経費発生日を選択してください</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <CategorySelect
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              error={errors.category}
            />
          </div>
        </div>

        <TextInput
          id="storeName"
          label="店舗名"
          value={formData.storeName}
          onChange={(value) => setFormData({ ...formData, storeName: value })}
          placeholder="例：株式会社文具堂"
          required
          error={errors.storeName}
          helpText="領収書に記載された正式な店舗名を入力してください"
        />

        <TextArea
          id="items"
          label="購入品目"
          value={formData.items}
          onChange={(value) => setFormData({ ...formData, items: value })}
          placeholder="例：ノート、ボールペン、付箋"
          required
          error={errors.items}
          helpText="購入した商品やサービスを具体的に記入してください"
        />

        <TextArea
          id="comments"
          label="備考"
          value={formData.comments}
          onChange={(value) => setFormData({ ...formData, comments: value })}
          placeholder="例：オフィス用品の補充のため"
          rows={2}
          helpText="経費の目的や特記事項があれば記入してください"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1E88E5] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              送信中...
            </>
          ) : (
            '申請する'
          )}
        </button>
      </div>
    </form>
  );
} 