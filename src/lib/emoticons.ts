// ============================================
// 12개 이모티콘 프리셋 정의
// ============================================
// 각 프리셋은 AI 이미지 생성 시 사용되는 프롬프트와
// UI에서 표시되는 한글 텍스트를 담고 있다.
// 새 이모티콘을 추가하려면 EMOTICONS 배열에 객체를 더하면 된다.

export interface EmoticonPreset {
  /** 고유 ID (파일명, ZIP 내 이름에도 사용됨) */
  id: string;
  /** 이모티콘에 표시되는 한글 텍스트 */
  label: string;
  /** AI 이미지 생성용 영문 프롬프트 (얼굴 일관성 유지를 전제로 함) */
  prompt: string;
  /** 이모지 (mock 미리보기 + UI 데코용) */
  emoji: string;
}

export const EMOTICONS: EmoticonPreset[] = [
  {
    id: 'hello',
    label: '안녕!',
    emoji: '👋',
    prompt:
      'smiling person waving one hand, friendly greeting pose, Korean kakao sticker style, white background, thick white outline, cute handwritten Korean text "안녕!"',
  },
  {
    id: 'best',
    label: '최고야!',
    emoji: '👍',
    prompt:
      'smiling person giving a thumbs up, sparkles around, cute kakao sticker style, white background, thick white outline, handwritten Korean text "최고야!"',
  },
  {
    id: 'love',
    label: '사랑해',
    emoji: '💖',
    prompt:
      'smiling person making a heart with both hands, hearts floating around, kakao sticker style, white background, thick white outline, handwritten Korean text "사랑해"',
  },
  {
    id: 'fighting',
    label: '화이팅!',
    emoji: '✊',
    prompt:
      'energetic person raising fist into the air, motivated expression, kakao sticker style, white background, thick white outline, handwritten Korean text "화이팅!"',
  },
  {
    id: 'wellDone',
    label: '잘했어!',
    emoji: '👏',
    prompt:
      'person clapping hands with bright smile, sparkles, kakao sticker style, white background, thick white outline, handwritten Korean text "잘했어!"',
  },
  {
    id: 'hmm',
    label: '음...',
    emoji: '🤔',
    prompt:
      'thinking face with finger on chin, question marks floating, kakao sticker style, white background, thick white outline, handwritten Korean text "음..."',
  },
  {
    id: 'omg',
    label: '어머!',
    emoji: '😲',
    prompt:
      'surprised face with both hands on cheeks, wide eyes, kakao sticker style, white background, thick white outline, handwritten Korean text "어머!"',
  },
  {
    id: 'sleepy',
    label: '졸려요...',
    emoji: '😪',
    prompt:
      'sleepy face rubbing eyes, small Zzz floating, kakao sticker style, white background, thick white outline, handwritten Korean text "졸려요..."',
  },
  {
    id: 'yummy',
    label: '냠냠~',
    emoji: '🍴',
    prompt:
      'person happily eating with spoon, music notes, kakao sticker style, white background, thick white outline, handwritten Korean text "냠냠~"',
  },
  {
    id: 'cute',
    label: '뽀잉~',
    emoji: '💕',
    prompt:
      'cute aegyo cheek pose, finger on cheek, hearts floating, kakao sticker style, white background, thick white outline, handwritten Korean text "뽀잉~"',
  },
  {
    id: 'thanks',
    label: '감사합니다!',
    emoji: '🙇',
    prompt:
      'polite bowing pose with hands together, hearts floating, kakao sticker style, white background, thick white outline, handwritten Korean text "감사합니다!"',
  },
  {
    id: 'good',
    label: '좋아요!',
    emoji: '😉',
    prompt:
      'winking face making finger heart, sparkles, kakao sticker style, white background, thick white outline, handwritten Korean text "좋아요!"',
  },
];

export const EMOTICON_COUNT = EMOTICONS.length; // 12
