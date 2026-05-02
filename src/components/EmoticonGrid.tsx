// ============================================
// 12개 이모티콘 그리드 (4×3) - 메인/결과/완료 페이지 공통 사용
// ============================================
'use client';

import { EMOTICONS, getSamplePath } from '@/lib/emoticons';
import type { GeneratedImage } from '@/lib/types';

interface Props {
  /** 실제 생성된 이미지가 있으면 표시. 없으면 'sample' 모드면 샘플, 아니면 이모지 placeholder */
  images?: GeneratedImage[];
  /** 워터마크 표시 여부 (결제 전 true) */
  watermark?: boolean;
  /** images 가 없을 때 샘플 이미지 사용 여부 */
  useSamples?: boolean;
}

export default function EmoticonGrid({ images, watermark = false, useSamples = false }: Props) {
  const items = images?.length
    ? images
    : EMOTICONS.map((p, idx) => ({
        id: p.id,
        label: p.label,
        emoji: p.emoji,
        previewUrl: useSamples ? getSamplePath(idx + 1) : '',
        finalUrl: '',
      }));

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`sticker-card aspect-square ${watermark ? 'watermark' : ''}`}
        >
          {item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.previewUrl}
              alt={item.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-[10px] font-bold text-secondary">{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
