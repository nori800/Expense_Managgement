import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, ZoomIn, ZoomOut } from 'lucide-react';
import { UPLOAD_CONSTANTS } from '../../constants/upload';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export function ImageUpload({ onFileSelect, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ページ全体のドラッグ＆ドロップイベントを防ぐ
  React.useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('dragenter', preventDefault, false);
    document.addEventListener('dragleave', preventDefault, false);
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);

    return () => {
      document.removeEventListener('dragenter', preventDefault);
      document.removeEventListener('dragleave', preventDefault);
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // 画像ファイルのバリデーション
    if (!UPLOAD_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type as typeof UPLOAD_CONSTANTS.ALLOWED_FILE_TYPES[number])) {
      alert('画像ファイルのみアップロード可能です。');
      return;
    }

    // ファイルサイズの制限
    if (file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      alert(`ファイルサイズは${UPLOAD_CONSTANTS.MAX_FILE_SIZE_TEXT}以下にしてください。`);
      return;
    }

    // プレビューの生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  }, [onFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const openFileDialog = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!isCameraActive && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      console.log('カメラ起動処理を開始します...');

      // 既存のカメラストリームを確実に停止
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      // カメラの使用状況を確認
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('利用可能なカメラデバイス:', videoDevices);

      if (videoDevices.length === 0) {
        throw new Error('カメラデバイスが見つかりません');
      }

      // シンプルな設定でカメラを起動
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      console.log('カメラ設定:', constraints);

      // カメラストリームの取得を試みる
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('カメラストリームを取得しました');

      if (videoRef.current) {
        // 既存のストリームを停止
        if (videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
        }

        // 新しいストリームを設定
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('autoplay', '');
        videoRef.current.setAttribute('playsinline', '');
        videoRef.current.setAttribute('muted', '');

        try {
          await videoRef.current.play();
          setIsCameraActive(true);
          console.log('カメラの表示を開始しました');
        } catch (playError) {
          console.error('ビデオの再生に失敗しました:', playError);
          throw playError;
        }
      } else {
        throw new Error('ビデオ要素の参照が見つかりません');
      }
    } catch (err) {
      console.error('カメラの起動に失敗しました:', err);
      
      let errorMessage = 'カメラの起動に失敗しました。';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'カメラへのアクセスが許可されていません。\n1. 他のアプリケーション（Zoom等）を終了してください\n2. ブラウザを再起動してください\n3. それでも解決しない場合は、PCの再起動をお試しください';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = 'カメラが見つかりません。\n1. PCにカメラが接続されているか確認\n2. デバイスマネージャーでカメラが正常に認識されているか確認\n3. 他のアプリケーションがカメラを使用していないか確認';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = 'カメラにアクセスできません。\n1. Zoomなどのカメラを使用するアプリケーションを終了\n2. ブラウザを再起動\n3. PCを再起動して再度お試しください';
        } else {
          errorMessage = `${errorMessage}\n詳細: ${err.message}\nカメラを使用している他のアプリケーションをすべて終了してから、再度お試しください。`;
        }
      }
      
      alert(errorMessage);
      setIsCameraActive(false);
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
        
        // Base64をBlobに変換してFileオブジェクトを作成
        const byteString = atob(imageData.split(',')[1]);
        const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onFileSelect(file);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setIsDragging(false);
  }, []);

  const clearPreview = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
      {isCameraActive ? (
        <div className="space-y-1 text-center">
          <div className="relative">
            <video
              ref={videoRef}
              style={{ transform: 'scaleX(-1)' }}
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
              onClick={clearPreview}
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
            <button
              type="button"
              onClick={openFileDialog}
              className="font-medium text-[#1E88E5] hover:text-[#1976D2] focus:outline-none"
            >
              別の画像をアップロード
            </button>
            <button
              type="button"
              onClick={startCamera}
              className="font-medium text-[#1E88E5] hover:text-[#1976D2] focus:outline-none"
            >
              写真を撮り直す
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={dropZoneRef}
          role="button"
          tabIndex={0}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
          } cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openFileDialog();
            }
          }}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex flex-col items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="font-medium text-[#1E88E5] hover:text-[#1976D2] focus:outline-none"
                >
                  ファイルを選択
                </button>
                <span>または</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="inline-flex items-center font-medium text-[#1E88E5] hover:text-[#1976D2] focus:outline-none"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  写真を撮る
                </button>
              </div>
              <p className="mt-2">ドラッグ＆ドロップでもOK</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG（{UPLOAD_CONSTANTS.MAX_FILE_SIZE_TEXT}まで）
              <br />
              推奨サイズ: {UPLOAD_CONSTANTS.RECOMMENDED_WIDTH}px × {UPLOAD_CONSTANTS.RECOMMENDED_HEIGHT}px
            </p>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
} 