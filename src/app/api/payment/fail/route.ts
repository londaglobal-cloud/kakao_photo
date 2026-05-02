// ============================================
// GET /api/payment/fail
// ============================================
// 토스페이먼츠 결제 실패 시 redirect 되는 URL
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');
  return NextResponse.redirect(
    new URL(`/result/${jobId || ''}?error=fail`, req.url)
  );
}
