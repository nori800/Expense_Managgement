export async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // 最大サイズの設定
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      let width = img.width;
      let height = img.height;

      // アスペクト比を保持しながらリサイズ
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // 画像の描画
      ctx?.drawImage(img, 0, 0, width, height);

      // 画質の設定（0.8 = 80%の品質）
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 新しいファイル名の生成
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('画像の最適化に失敗しました。'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました。'));
    };

    // FileReaderを使用してファイルを読み込む
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました。'));
    };
    reader.readAsDataURL(file);
  });
} 