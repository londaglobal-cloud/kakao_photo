// ============================================
// AI 이미지 생성 서비스 (얼굴 → 12개 이모티콘)
// ============================================
// 실제 AI 이미지 생성 API와의 연결 지점.
// 현재는 mock 모드로 동작하며, 환경변수 IMAGE_AI_PROVIDER 값에 따라
// 실제 프로바이더(gemini / openai / replicate 등)로 교체할 수 있다.
//
// ▶ 실제 API 연결 방법
//   1. .env.local 에 IMAGE_AI_PROVIDER=gemini 와 GEMINI_API_KEY 입력
//   2. 아래 generateWithGemini() 함수 안의 TODO 부분에 실제 호출 코드 작성
//   3. 그 외에는 변경할 것 없음 (호출자는 generateEmoticonSet 만 사용)

import { EMOTICONS, EmoticonPreset } from '@/lib/emoticons';
import { GeneratedImage } from '@/lib/types';

export interface GenerateInput {
  /** 사용자가 업로드한 얼굴 사진 (data URL, base64 형식) */
  faceImageDataUrl: string;
  /** 닉네임 (이미지에 부가 표시될 수도 있음) */
  nickname: string;
}

/**
 * 12개 이모티콘 세트를 생성한다.
 * 결제 전 미리보기는 워터마크가 들어간 previewUrl 을 사용하고,
 * 결제 후 다운로드는 워터마크 없는 finalUrl 을 사용한다.
 */
export async function generateEmoticonSet(
  input: GenerateInput
): Promise<GeneratedImage[]> {
  const provider = process.env.IMAGE_AI_PROVIDER || 'mock';

  switch (provider) {
    case 'gemini':
      return generateWithGemini(input);
    case 'openai':
      return generateWithOpenAI(input);
    case 'replicate':
      return generateWithReplicate(input);
    case 'mock':
    default:
      return generateWithMock(input);
  }
}

// --------------------------------------------
// Mock: 개발용 가짜 이미지 (얼굴 사진 위에 이모지 텍스트 합성)
// --------------------------------------------
async function generateWithMock(input: GenerateInput): Promise<GeneratedImage[]> {
  // 실제로는 AI가 12장을 만들지만, mock 에서는 같은 사진을 12번 반환하고
  // 클라이언트에서 emoji 와 label 을 오버레이 해서 각각 다르게 보이게 한다.
  return EMOTICONS.map((preset) => buildMockImage(preset, input.faceImageDataUrl));
}

function buildMockImage(preset: EmoticonPreset, face: string): GeneratedImage {
  return {
    id: preset.id,
    label: preset.label,
    emoji: preset.emoji,
    // 미리보기는 동일 이미지지만, UI 단에서 워터마크/라벨을 덧씌워 보여준다.
    previewUrl: face,
    finalUrl: face,
  };
}

// --------------------------------------------
// Gemini (Google Nano Banana / 2.5 Flash Image) - 실제 연결 지점
// --------------------------------------------
async function generateWithGemini(input: GenerateInput): Promise<GeneratedImage[]> {
  // TODO: 실제 Gemini Image API 호출
  // const apiKey = process.env.GEMINI_API_KEY;
  // const results = await Promise.all(
  //   EMOTICONS.map(async (preset) => {
  //     const res = await fetch('https://generativelanguage.googleapis.com/...', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
  //       body: JSON.stringify({
  //         contents: [{ parts: [
  //           { inline_data: { mime_type: 'image/png', data: input.faceImageDataUrl.split(',')[1] }},
  //           { text: preset.prompt },
  //         ]}],
  //       }),
  //     });
  //     const data = await res.json();
  //     return { id: preset.id, label: preset.label, emoji: preset.emoji,
  //              previewUrl: data.image, finalUrl: data.image };
  //   })
  // );
  // return results;
  console.warn('[imageAi] Gemini provider not implemented, fallback to mock');
  return generateWithMock(input);
}

// --------------------------------------------
// OpenAI (gpt-image-1) - 실제 연결 지점
// --------------------------------------------
async function generateWithOpenAI(input: GenerateInput): Promise<GeneratedImage[]> {
  // TODO: OpenAI Images API 호출
  console.warn('[imageAi] OpenAI provider not implemented, fallback to mock');
  return generateWithMock(input);
}

// --------------------------------------------
// Replicate (FLUX Kontext / Seedream 등) - 실제 연결 지점
// --------------------------------------------
async function generateWithReplicate(input: GenerateInput): Promise<GeneratedImage[]> {
  // TODO: Replicate Predictions API 호출
  console.warn('[imageAi] Replicate provider not implemented, fallback to mock');
  return generateWithMock(input);
}
