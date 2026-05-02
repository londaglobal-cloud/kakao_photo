// ============================================
// 이모티콘 스타일 프리셋 (3종)
// ============================================
// 사용자가 업로드 시 고를 수 있는 그림체.
// 각 스타일은 12개 프롬프트에 동일하게 적용되는 "스타일 수식어"를 제공한다.

export type StyleId = 'photoreal' | 'cartoon' | 'emoticon';

export interface StylePreset {
  id: StyleId;
  label: string;
  emoji: string;
  description: string;
  /** 모든 이모티콘 프롬프트 앞에 붙이는 공통 스타일 지시문 */
  styleClause: string;
}

export const STYLES: StylePreset[] = [
  {
    id: 'photoreal',
    label: '실사',
    emoji: '📷',
    description: '진짜 사진처럼 자연스럽게',
    styleClause:
      'PHOTOREALISTIC photo, real photography, DSLR portrait quality, ' +
      'NOT cartoon, NOT illustration, NOT anime, NOT painting. ' +
      'Same person\'s real face from the input photo, head and shoulders only.',
  },
  {
    id: 'cartoon',
    label: '카툰',
    emoji: '🎨',
    description: '귀여운 일러스트 그림체',
    styleClause:
      'Cute Korean webtoon-style cartoon illustration, soft clean line art, ' +
      'flat pastel colors, large eyes, head and shoulders only. ' +
      'Keep the person\'s recognizable features (hair, glasses, face shape) from the input photo.',
  },
  {
    id: 'emoticon',
    label: '이모티콘',
    emoji: '😀',
    description: '카카오톡 스티커 캐릭터 느낌',
    styleClause:
      'Chibi sticker mascot style, super-deformed cute character, ' +
      'simplified round face, big head small body, kawaii kakao sticker style, ' +
      'thick clean outlines, vivid colors. ' +
      'Keep the recognizable features (hair, glasses) from the input photo.',
  },
];

export const DEFAULT_STYLE: StyleId = 'photoreal';

export function getStyle(id: string | undefined): StylePreset {
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}
