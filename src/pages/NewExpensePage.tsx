import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, Search, ZoomIn, ZoomOut, X, Camera } from 'lucide-react';

export function NewExpensePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    storeName: '',
    items: '',
    comments: ''
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('カメラの起動に失敗しました:', err);
      alert('カメラへのアクセスが許可されていないか、利用できません。');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setPreview(imageData);
        stopCamera();
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズは10MB以下にしてください。');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement expense submission
      navigate('/expenses');
    } catch (error) {
      console.error('Failed to submit expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-xl font-semibold text-gray-900">経費申請</h1>
          <p className="mt-1 text-sm text-gray-500">* は必須項目です</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  領収書画像 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {isCameraActive ? (
                    <div className="space-y-1 text-center w-full">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="max-h-64 mx-auto"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-4">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#1E88E5] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]"
                          >
                            撮影
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : preview ? (
                    <div className="space-y-1 text-center">
                      <div className="relative">
                        <img
                          src={preview}
                          alt="領収書プレビュー"
                          className={`mx-auto transition-transform duration-200 ${
                            isZoomed ? 'max-h-[80vh] cursor-zoom-out' : 'max-h-64 cursor-zoom-in'
                          }`}
                          onClick={() => setIsZoomed(!isZoomed)}
                        />
                        <button
                          type="button"
                          onClick={() => setPreview(null)}
                          className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsZoomed(!isZoomed)}
                          className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          {isZoomed ? (
                            <ZoomOut className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ZoomIn className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <label className="cursor-pointer bg-white rounded-md font-medium text-[#1E88E5] hover:text-[#1976D2] focus-within:outline-none">
                          <span>別の画像をアップロード</span>
                          <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </label>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="font-medium text-[#1E88E5] hover:text-[#1976D2]"
                        >
                          写真を撮り直す
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <label className="cursor-pointer bg-white rounded-md font-medium text-[#1E88E5] hover:text-[#1976D2] focus-within:outline-none">
                            <span>ファイルを選択</span>
                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                          </label>
                          <span>または</span>
                          <button
                            type="button"
                            onClick={startCamera}
                            className="inline-flex items-center font-medium text-[#1E88E5] hover:text-[#1976D2]"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            写真を撮る
                          </button>
                        </div>
                        <p className="mt-2">ドラッグ＆ドロップでもOK</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG（10MBまで）
                        <br />
                        推奨サイズ: 1200px × 1600px
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 残りのフォームフィールドは変更なし */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    金額 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">¥</span>
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="pl-7 shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      placeholder="3000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">1円単位で入力してください</p>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    日付 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">経費発生日を選択してください</p>
                </div>
              </div>

              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  店舗名 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    placeholder="例：株式会社文具堂"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">領収書に記載された正式な店舗名を入力してください</p>
              </div>

              <div>
                <label htmlFor="items" className="block text-sm font-medium text-gray-700">
                  購入品目 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="items"
                    rows={3}
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    placeholder="例：ノート、ボールペン、付箋"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">購入した商品やサービスを具体的に記入してください</p>
              </div>

              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  備考
                </label>
                <div className="mt-1">
                  <textarea
                    id="comments"
                    rows={2}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="shadow-sm focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="例：オフィス用品の補充のため"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">経費の目的や特記事項があれば記入してください</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/expenses')}
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
        </div>
      </div>
    </div>
  );
}