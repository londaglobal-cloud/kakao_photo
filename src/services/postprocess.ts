// ============================================
// 스티커 후처리 (카톡 이모티콘 판매 규격)
// ============================================
// AI가 만든 1024x1024 흰 배경 이미지를:
//   - 360x360 으로 리사이즈
//   - 흰 배경을 투명하게 (chromakey)
//   - PNG-32 (RGBA) 로 출력
//
// 카톡 이모티콘 정지형 표준 = 360×360 PNG-32 투명 배경.

import sharp from 'sharp';

export const STICKER_SIZE = 360;

export interface StickerOptions {
  size?: number;
  /** 배경 제거 임계값(0~255). 이 값 이상의 밝기는 투명. 기본 248 */
  whiteThreshold?: number;
  /** 임계값 아래로 부드러운 알파 그라데이션 폭. 기본 13 */
  feather?: number;
}

/**
 * base64 이미지 → 360x360 투명 배경 PNG (base64) 로 변환.
 */
export async function makeStickerPng(
  inputB64: string,
  _inputMime: string,
  opts: StickerOptions = {}
): Promise<{ data: string; mime: string; width: number; height: number }> {
  const size = opts.size ?? STICKER_SIZE;
  const threshold = opts.whiteThreshold ?? 248;
  const feather = opts.feather ?? 13;

  const inputBuf = Buffer.from(inputB64, 'base64');

  // 1) 리사이즈 + RGBA raw 픽셀 추출
  const { data, info } = await sharp(inputBuf)
    .resize(size, size, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2) chromakey: 흰색에 가까운 픽셀 → 투명
  //    부드러운 가장자리를 위해 [threshold-feather, threshold] 구간은 알파 그라데이션
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minC = Math.min(r, g, b);

    let alpha: number;
    if (minC >= threshold) {
      alpha = 0;
    } else if (minC >= threshold - feather) {
      alpha = Math.round((255 * (threshold - minC)) / feather);
    } else {
      alpha = 255;
    }

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  // 3) PNG-32 로 인코딩
  const png = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  return {
    data: png.toString('base64'),
    mime: 'image/png',
    width: info.width,
    height: info.height,
  };
}
