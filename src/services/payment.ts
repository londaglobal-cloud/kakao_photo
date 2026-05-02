// ============================================
// 결제 서비스 (토스페이먼츠 통합)
// ============================================
// 토스페이먼츠 한 곳으로 5가지 결제 수단을 모두 처리한다:
//   - 휴대폰 소액결제 (PHONE)
//   - 네이버페이 (NAVERPAY)
//   - 카카오페이 (KAKAOPAY)
//   - 삼성페이 (SAMSUNGPAY)
//   - 애플페이 (APPLEPAY)
//
// PAYMENT_MODE=mock 이면 결제 호출 없이 성공 처리 (개발용).
// PAYMENT_MODE=real 이면 토스페이먼츠 실제 결제창을 띄운다.
//
// ▶ 실제 결제 연결 방법
//   1. https://developers.tosspayments.com 에서 키 발급
//   2. .env.local 에 NEXT_PUBLIC_TOSS_CLIENT_KEY, TOSS_SECRET_KEY 입력
//   3. PAYMENT_MODE=real 로 변경
//   4. (서버) /api/payment/confirm 에서 결제 승인 호출 (토스 문서 참고)

import type { PaymentMethod, PaymentResult } from '@/lib/types';

export const PRICE_KRW = Number(process.env.NEXT_PUBLIC_PRICE_KRW || 4900);

/** 토스페이먼츠 method 키 매핑 */
export const TOSS_METHOD_MAP: Record<PaymentMethod, string> = {
  PHONE: '휴대폰',
  NAVERPAY: '네이버페이',
  KAKAOPAY: '카카오페이',
  SAMSUNGPAY: '삼성페이',
  APPLEPAY: '애플페이',
};

/** 결제 수단 메타정보 (UI에서 사용) */
export const PAYMENT_METHODS: { key: PaymentMethod; label: string; emoji: string }[] = [
  { key: 'KAKAOPAY',   label: '카카오페이', emoji: '💛' },
  { key: 'NAVERPAY',   label: '네이버페이', emoji: '💚' },
  { key: 'SAMSUNGPAY', label: '삼성페이',   emoji: '🔵' },
  { key: 'APPLEPAY',   label: '애플페이',   emoji: '🍎' },
  { key: 'PHONE',      label: '휴대폰결제', emoji: '📱' },
];

/**
 * 클라이언트 측 결제 시작
 * - mock 모드: 즉시 성공 결과 반환
 * - real 모드: 토스페이먼츠 SDK 호출 → 결제창 → 성공 시 successUrl 로 리다이렉트
 */
export async function requestPayment(params: {
  jobId: string;
  method: PaymentMethod;
  customerName?: string;
}): Promise<PaymentResult> {
  const mode = process.env.NEXT_PUBLIC_PAYMENT_MODE || 'mock';
  const orderId = `order_${params.jobId}_${Date.now()}`;

  if (mode === 'mock') {
    // 개발용: 결제 통과 시뮬레이션
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      orderId,
      amount: PRICE_KRW,
      paymentKey: `mock_pk_${orderId}`,
      message: 'mock 결제 성공',
    };
  }

  // 실제 결제: 토스페이먼츠 SDK 사용
  try {
    const { loadTossPayments } = await import('@tosspayments/payment-sdk');
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
    const tossPayments = await loadTossPayments(clientKey);

    // 일부 결제수단은 토스 SDK 타입에 정의되지 않아 any 캐스팅으로 호출
    await (tossPayments.requestPayment as any)(TOSS_METHOD_MAP[params.method], {
      amount: PRICE_KRW,
      orderId,
      orderName: '내얼굴 이모티콘 12종 세트',
      customerName: params.customerName || '고객',
      successUrl: `${window.location.origin}/api/payment/success?jobId=${params.jobId}`,
      failUrl: `${window.location.origin}/api/payment/fail?jobId=${params.jobId}`,
    });

    // 토스 결제창은 redirect 기반이라 여기 도달하지 않음
    return { success: false, orderId, amount: PRICE_KRW, message: 'redirect pending' };
  } catch (e) {
    return {
      success: false,
      orderId,
      amount: PRICE_KRW,
      message: e instanceof Error ? e.message : 'unknown error',
    };
  }
}
