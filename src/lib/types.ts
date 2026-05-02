// ============================================
// 공통 타입 정의
// ============================================

export interface GeneratedImage {
  /** 이모티콘 프리셋 ID (예: hello, love) */
  id: string;
  /** 한글 라벨 */
  label: string;
  /** 이모티콘 미리보기 이모지 */
  emoji: string;
  /** 이미지 데이터 URL 또는 외부 URL (워터마크 포함된 미리보기) */
  previewUrl: string;
  /** 결제 후 받을 수 있는 원본(워터마크 없는) URL */
  finalUrl: string;
}

export interface GenerationJob {
  jobId: string;
  nickname: string;
  /** 워터마크 미리보기 12장 */
  images: GeneratedImage[];
  /** 결제 완료 여부 */
  paid: boolean;
  createdAt: number;
}

export interface PaymentRequest {
  jobId: string;
  amount: number;
  /** 토스페이먼츠 method 키 */
  method: PaymentMethod;
}

export type PaymentMethod =
  | 'PHONE'        // 휴대폰 소액결제
  | 'NAVERPAY'     // 네이버페이
  | 'KAKAOPAY'     // 카카오페이
  | 'SAMSUNGPAY'   // 삼성페이
  | 'APPLEPAY';    // 애플페이

export interface PaymentResult {
  success: boolean;
  paymentKey?: string;
  orderId: string;
  amount: number;
  message?: string;
}
