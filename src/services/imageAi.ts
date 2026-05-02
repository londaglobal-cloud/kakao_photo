// ============================================
// AI 이미지 생성 서비스 (얼굴 → 12개 이모티콘)
// ============================================
// 실제 AI 이미지 생성 API와의 연결 지점.
// 환경변수 IMAGE_AI_PROVIDER 값으로 프로바이더 전환:
//   mock | gemini | openai | replicate
//
// ▶ 처리 흐름
//   1. 입력 사진 + (스타일 절 + 정체성 락 + 12개 프리셋 프롬프트) 를
//      Gemini 에 12회 병렬 호출
//   2. 결과 이미지에 한글 라벨을 코드로 합성 (AI는 한글을 못 그림)
//   3. previewUrl / finalUrl 반환

import { EMOTICONS, EmoticonPreset } from '@/lib/emoticons';
import { GeneratedImage } from '@/lib/types';
import { getStyle, StyleId, DEFAULT_STYLE } from '@/lib/styles';
import { overlayKoreanText } from './textOverlay';

export interface GenerateInput {
  /** 사용자가 업로드한 얼굴 사진 (data URL, base64 형식) */
  faceImageDataUrl: string;
  /** 닉네임 (이미지에 부가 표시될 수도 있음) */
  nickname: string;
  /** 그림체 선택: photoreal | cartoon | emoticon */
  styleId?: StyleId;
}

export async function generateEmoticonSet(
  input: GenerateInput
): Promise<GeneratedImage[]> {
  const provider = process.env.IMAGE_AI_PROVIDER || 'mock';
  switch (provider) {
    case 'gemini':    return generateWithGemini(input);
    case 'openai':    return generateWithOpenAI(input);
    case 'replicate': return generateWithReplicate(input);
    case 'mock':
    default:          return generateWithMock(input);
  }
}

// --------------------------------------------
// Mock: 개발용 (얼굴 사진을 그대로 12번 반환)
// --------------------------------------------
async function generateWithMock(input: GenerateInput): Promise<GeneratedImage[]> {
  return EMOTICONS.map((preset) => buildMockImage(preset, input.faceImageDataUrl));
}

function buildMockImage(preset: EmoticonPreset, face: string): GeneratedImage {
  return {
    id: preset.id,
    label: preset.label,
    emoji: preset.emoji,
    previewUrl: face,
    finalUrl: face,
  };
}

// --------------------------------------------
// Gemini 2.5 Flash Image (Nano Banana)
// --------------------------------------------
async function generateWithGemini(input: GenerateInput): Promise<GeneratedImage[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[imageAi] GEMINI_API_KEY missing, fallback to mock');
    return generateWithMock(input);
  }

  const match = input.faceImageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    console.warn('[imageAi] invalid dataURL, fallback to mock');
    return generateWithMock(input);
  }
  const inputMime = match[1];
  const inputB64 = match[2];

  const style = getStyle(input.styleId ?? DEFAULT_STYLE);

  // 모든 호출에 공통으로 들어가는 강제 지시문
  // - 정체성 락: 입력 얼굴 그대로 유지
  // - 스타일: 사용자가 선택한 그림체 (실사/카툰/이모티콘)
  // - 구도: 흰 배경 + 두꺼운 흰 외곽선 + 정사각형
  // - 텍스트 금지: 한글은 후처리로 합성하므로 AI가 글자 안 넣게 함
  const baseClause =
    `${style.styleClause} ` +
    'Square 1:1 composition centered. Pure white background. ' +
    'Sticker cutout look with thick white outline border around the figure. ' +
    'IMPORTANT: do NOT include any text, letters, words, captions, or speech bubbles in the image.';

  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

  const callOne = async (preset: EmoticonPreset): Promise<GeneratedImage> => {
    const body = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: inputMime, data: inputB64 } },
            { text: `${baseClause}\n\nPose & expression: ${preset.prompt}.` },
          ],
        },
      ],
      generationConfig: { temperature: 0.4, responseModalities: ['IMAGE'] },
    };

    try {
      const res = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[imageAi] gemini ${preset.id} ${res.status}:`, errText.slice(0, 200));
        return buildMockImage(preset, input.faceImageDataUrl);
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const imgPart = parts.find(
        (p: { inlineData?: { data?: string; mimeType?: string }; inline_data?: { data?: string; mime_type?: string } }) =>
          p.inlineData?.data || p.inline_data?.data
      );
      const b64Raw = imgPart?.inlineData?.data || imgPart?.inline_data?.data;
      const mimeRaw =
        imgPart?.inlineData?.mimeType ||
        imgPart?.inline_data?.mime_type ||
        'image/png';

      if (!b64Raw) {
        console.warn(`[imageAi] gemini ${preset.id} no image returned`);
        return buildMockImage(preset, input.faceImageDataUrl);
      }

      // 한글 텍스트 합성 (AI 출력에 정확한 라벨을 얹음)
      let composedB64 = b64Raw;
      let composedMime = mimeRaw;
      try {
        const out = await overlayKoreanText(b64Raw, mimeRaw, preset.label);
        composedB64 = out.data;
        composedMime = out.mime;
      } catch (e) {
        console.error(`[imageAi] textOverlay failed for ${preset.id}:`, e);
      }

      const url = `data:${composedMime};base64,${composedB64}`;
      return {
        id: preset.id,
        label: preset.label,
        emoji: preset.emoji,
        previewUrl: url,
        finalUrl: url,
      };
    } catch (e) {
      console.error(`[imageAi] gemini ${preset.id} threw:`, e);
      return buildMockImage(preset, input.faceImageDataUrl);
    }
  };

  return Promise.all(EMOTICONS.map(callOne));
}

// --------------------------------------------
// OpenAI gpt-image-1 - 실제 연결 지점
// --------------------------------------------
async function generateWithOpenAI(input: GenerateInput): Promise<GeneratedImage[]> {
  console.warn('[imageAi] OpenAI provider not implemented, fallback to mock');
  return generateWithMock(input);
}

// --------------------------------------------
// Replicate - 실제 연결 지점
// --------------------------------------------
async function generateWithReplicate(input: GenerateInput): Promise<GeneratedImage[]> {
  console.warn('[imageAi] Replicate provider not implemented, fallback to mock');
  return generateWithMock(input);
}
