// ============================================
// 12개 이모티콘 그리드 (4x3) - 메인/결과/완료 페이지 공통 사용
// ============================================
'use client';

import Image from 'next/image';
import { EMOTICONS } from '@/lib/emoticons';
import type { GeneratedImage } from '@/lib/types';

interface Props {
  /** 실제 생성된 이미지가 있으면 표시, 없으면 샘플(이모지) 표시 */
  images?: GeneratedImage[];
  /** 워터마크 표시 여부 (결제 전 true) */
  watermark?: boolean;
}

export default function EmoticonGrid({ images, watermark = false }: Props) {
  // 이미지가 없을 땐 EMOTICONS 프리셋으로 빈 카드 12개 표시 (메인 페이지 샘플)
  const items = images?.length
    ? images
    : EMOTICONS.map((p) => ({
        id: p.id,
        label: p.label,
        emoji: p.emoji,
        previewUrl: '',
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
            // 실제 생성 이미지가 있을 때
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.previewUrl}
              alt={item.label}
              className="w-full h-full object-cover"
            />
          ) : (
            // 샘플 모드: 이모지 + 라벨
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{item.emoji}</span>
            </div>
          )}
          {/* 한글 손글씨 라벨 (이미지 위 오버레이) */}
          <span className="absolute top-1 left-2 text-sm font-extrabold text-secondary drop-shadow">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
