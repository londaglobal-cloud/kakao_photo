// ============================================
// GET /api/job/[jobId]
// ============================================
// 잡 정보(미리보기 12장 + paid 여부)를 반환.
import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/services/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = getJob(params.jobId);
  if (!job) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ job });
}
