// ============================================
// POST /api/generate
// ============================================
// 사용자 사진을 받아 AI 이미지 12장을 생성하고 Job 저장.
// body: { faceImageDataUrl: string, nickname: string }
// res: { jobId: string }
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { generateEmoticonSet } from '@/services/imageAi';
import { saveJob } from '@/services/storage';
import { DEFAULT_STYLE, getStyle } from '@/lib/styles';

export const runtime = 'nodejs';
// dataURL 페이로드가 클 수 있으니 응답 시간 여유
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { faceImageDataUrl, nickname, styleId } = await req.json();
    if (!faceImageDataUrl?.startsWith('data:image/')) {
      return NextResponse.json({ error: '잘못된 이미지' }, { status: 400 });
    }

    const style = getStyle(styleId ?? DEFAULT_STYLE);
    const images = await generateEmoticonSet({
      faceImageDataUrl,
      nickname: nickname || '나',
      styleId: style.id,
    });

    const jobId = uuid();
    saveJob({
      jobId,
      nickname: nickname || '나',
      styleId: style.id,
      images,
      paid: false,
      createdAt: Date.now(),
    });

    return NextResponse.json({ jobId });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 }
    );
  }
}
