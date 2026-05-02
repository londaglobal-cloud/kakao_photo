// ============================================
// 12개 이모티콘 프리셋 정의
// ============================================
// 각 프리셋은 표정/포즈/장식을 영문으로 기술한다.
// 한글 텍스트는 AI에 맡기지 않고(오타 발생) 서버에서 후처리로 합성한다.
// 스타일(실사/카툰/이모티콘)은 lib/styles.ts 에서 별도 적용된다.

export interface EmoticonPreset {
  /** 고유 ID (파일명, ZIP 내 이름에도 사용됨) */
  id: string;
  /** 이모티콘에 합성될 한글 텍스트 */
  label: string;
  /** 이모지 (UI 데코용) */
  emoji: string;
  /** 표정/포즈/장식만 기술하는 영문 (스타일/얼굴 일관성은 별도 적용) */
  prompt: string;
}

/** 메인 페이지에서 보여주는 샘플 이미지 경로 (1~12 순서 고정) */
export function getSamplePath(index1to12: number): string {
  return `/samples/${String(index1to12).padStart(2, '0')}_${EMOTICONS[index1to12 - 1].id}.png`;
}

export const EMOTICONS: EmoticonPreset[] = [
  {
    id: 'hello',
    label: '안녕!',
    emoji: '👋',
    prompt: 'smiling and waving one hand in friendly greeting, eyes looking forward',
  },
  {
    id: 'best',
    label: '최고야!',
    emoji: '👍',
    prompt: 'bright smile, giving a thumbs up gesture, sparkles around',
  },
  {
    id: 'love',
    label: '사랑해',
    emoji: '💖',
    prompt: 'making a heart shape with both hands above chest, soft smile, hearts floating around',
  },
  {
    id: 'fighting',
    label: '화이팅!',
    emoji: '✊',
    prompt: 'raising one fist up energetically, motivated determined expression, only upper body visible',
  },
  {
    id: 'wellDone',
    label: '잘했어!',
    emoji: '👏',
    prompt: 'clapping hands together near the chest, happy smile, sparkles around',
  },
  {
    id: 'hmm',
    label: '음...',
    emoji: '🤔',
    prompt: 'thinking pose with index finger on chin, slightly squinted eyes looking up, question marks floating',
  },
  {
    id: 'omg',
    label: '어머!',
    emoji: '😲',
    prompt: 'wide-eyed surprised expression, mouth slightly open, both hands placed on cheeks',
  },
  {
    id: 'sleepy',
    label: '졸려요...',
    emoji: '😪',
    prompt: 'sleepy half-closed eyes, one hand rubbing the eye, small "Z" symbols floating',
  },
  {
    id: 'yummy',
    label: '냠냠~',
    emoji: '🍴',
    prompt:
      'happily eating with a spoon containing white rice or normal-colored food ' +
      '(no purple/blue food), eyes closed in delight, music notes floating around',
  },
  {
    id: 'cute',
    label: '뽀잉~',
    emoji: '💕',
    prompt: 'cute aegyo pose with index finger pressed against the cheek, small smile, hearts floating',
  },
  {
    id: 'thanks',
    label: '감사합니다!',
    emoji: '🙇',
    prompt: 'polite bowing pose with both hands clasped together in front of chest, eyes gently closed',
  },
  {
    id: 'good',
    label: '좋아요!',
    emoji: '😉',
    prompt: 'winking one eye, making a small finger heart with thumb and index finger near the cheek, sparkles',
  },
];

export const EMOTICON_COUNT = EMOTICONS.length; // 12

