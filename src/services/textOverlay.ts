// ============================================
// 한글 텍스트 합성 (sharp + SVG)
// ============================================
// AI가 한글을 제대로 못 그려서 오타가 잦다.
// 그래서 AI 결과 이미지에 코드로 정확한 한글 텍스트를 얹는다.
//
// 동작: 이미지 우상단(또는 라벨에 따라 위치 다르게)에
//      흰 외곽선 + 검정 본체 손글씨 느낌의 한글을 SVG 로 그려서 합성.

import sharp from 'sharp';

/**
 * 이미지 base64 (mime + b64) 에 한글 라벨을 합성하여 base64 PNG 로 반환.
 */
export async function overlayKoreanText(
  inputDataB64: string,
  inputMime: string,
  label: string
): Promise<{ data: string; mime: string }> {
  const inputBuf = Buffer.from(inputDataB64, 'base64');

  // 입력 이미지 사이즈 파악 (1024 표준이지만 안전하게 동적으로)
  const meta = await sharp(inputBuf).metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;

  // 라벨 길이에 따라 폰트 크기 조절 (360 기준으로 보기 좋게)
  const charCount = [...label].length;
  const fontSize = Math.round(w * (charCount <= 4 ? 0.16 : charCount <= 6 ? 0.13 : 0.11));
  const x = Math.round(w * 0.5);
  const y = Math.round(h * 0.18);
  // 작은 이미지에서도 외곽선이 또렷하도록 stroke 비율 강화
  const strokeWidth = Math.max(2, Math.round(fontSize * 0.22));

  // SVG 텍스트: 두꺼운 흰 stroke (외곽선) + 진한 본체
  // text-anchor=middle 로 중앙 정렬, font-family 는 시스템 폰트 fallback
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <style>
        .lbl {
          font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', 'Pretendard',
                       'Nanum Gothic', 'Noto Sans CJK KR', sans-serif;
          font-weight: 900;
          font-size: ${fontSize}px;
        }
      </style>
      <text class="lbl" x="${x}" y="${y}"
            text-anchor="middle"
            stroke="white" stroke-width="${strokeWidth}"
            stroke-linejoin="round" stroke-linecap="round"
            paint-order="stroke fill"
            fill="#FF4B75">${escapeXml(label)}</text>
    </svg>
  `;

  const out = await sharp(inputBuf)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  return { data: out.toString('base64'), mime: 'image/png' };
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default:  return c;
    }
  });
}
