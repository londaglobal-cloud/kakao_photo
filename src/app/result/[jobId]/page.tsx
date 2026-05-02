// ============================================
// 3. 결과 미리보기 페이지 (/result/[jobId])
// ============================================
// - 생성된 12개 이모티콘 워터마크 미리보기
// - 결제 수단 선택 → 결제 진행 → /complete/[jobId]
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmoticonGrid from '@/components/EmoticonGrid';
import { PAYMENT_METHODS, requestPayment, PRICE_KRW } from '@/services/payment';
import type { GenerationJob, PaymentMethod } from '@/lib/types';

export default function ResultPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 잡 정보 불러오기
  useEffect(() => {
    fetch(`/api/job/${jobId}`)
      .then((r) => r.json())
      .then((d) => setJob(d.job))
      .catch(() => setError('이모티콘을 불러올 수 없어요'));
  }, [jobId]);

  const handlePay = async (method: PaymentMethod) => {
    setPaying(true);
    setError(null);
    try {
      const result = await requestPayment({ jobId, method });
      if (!result.success) {
        setError(result.message || '결제에 실패했어요');
        setPaying(false);
        return;
      }
      // mock 모드: 서버에 paid 처리를 알려줌
      await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          orderId: result.orderId,
          amount: result.amount,
          paymentKey: result.paymentKey,
        }),
      });
      router.push(`/complete/${jobId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '결제 오류');
    } finally {
      setPaying(false);
    }
  };

  if (!job) {
    return (
      <main className="container-mobile pt-20 text-center text-gray-500">
        이모티콘 불러오는 중...
      </main>
    );
  }

  return (
    <main className="container-mobile">
      <header className="text-center pt-5 mb-4">
        <h1 className="text-2xl font-extrabold">짜잔! 미리보기 🎉</h1>
        <p className="text-sm text-gray-600 mt-1">
          결제 후 워터마크 없이 다운로드할 수 있어요
        </p>
      </header>

      <EmoticonGrid images={job.images} watermark />

      <div className="mt-7 bg-white rounded-2xl p-5 shadow-sticker">
        <p className="text-sm text-gray-600">결제 금액</p>
        <p className="text-3xl font-extrabold">
          {PRICE_KRW.toLocaleString()}원
        </p>
        <p className="text-xs text-gray-500 mt-1">12장 PNG + 전체 ZIP 제공</p>
      </div>

      {/* 결제 수단 선택 */}
      <h2 className="mt-6 mb-2 text-sm font-bold text-gray-700">결제 수단 선택</h2>
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.key}
            onClick={() => handlePay(m.key)}
            disabled={paying}
            className="bg-white border-2 border-gray-200 rounded-2xl py-4 font-bold
                       active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="text-xl">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-bold">⚠ {error}</p>
      )}

      <p className="text-center text-xs text-gray-400 mt-5 mb-10">
        결제는 토스페이먼츠로 안전하게 처리됩니다
      </p>
    </main>
  );
}
