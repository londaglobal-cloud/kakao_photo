// ============================================
// GET /api/payment/success
// ============================================
// 토스페이먼츠 결제창에서 성공 시 redirect 되는 URL.
// 여기서 confirm 호출 후 /complete/[jobId] 로 보낸다.
import { NextRequest, NextResponse } from 'next/server';
import { markPaid } from '@/services/storage';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');
  const paymentKey = url.searchParams.get('paymentKey');
  const orderId = url.searchParams.get('orderId');
  const amount = Number(url.searchParams.get('amount') || '0');
  if (!jobId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 실제 모드: 토스 승인 호출
  if (process.env.PAYMENT_MODE === 'real' && paymentKey && orderId) {
    try {
      const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });
      if (!res.ok) {
        return NextResponse.redirect(new URL(`/result/${jobId}?error=confirm`, req.url));
      }
    } catch {
      return NextResponse.redirect(new URL(`/result/${jobId}?error=confirm`, req.url));
    }
  }

  markPaid(jobId);
  return NextResponse.redirect(new URL(`/complete/${jobId}`, req.url));
}
