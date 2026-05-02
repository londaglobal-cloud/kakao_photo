// ============================================
// POST /api/payment/confirm
// ============================================
// 결제 승인 (mock 모드: 그냥 paid=true; real 모드: 토스 승인 API 호출)
//
// ▶ 토스 실제 승인 호출 예시 (PAYMENT_MODE=real 일 때 활성화)
//   const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Basic ' + Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64'),
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ paymentKey, orderId, amount }),
//   });
import { NextRequest, NextResponse } from 'next/server';
import { markPaid } from '@/services/storage';

export async function POST(req: NextRequest) {
  const { jobId, orderId, amount, paymentKey } = await req.json();
  const mode = process.env.PAYMENT_MODE || 'mock';

  if (mode === 'real') {
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
        const data = await res.json();
        return NextResponse.json({ error: data }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'toss error' },
        { status: 500 }
      );
    }
  }

  const ok = markPaid(jobId);
  if (!ok) return NextResponse.json({ error: 'job not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
