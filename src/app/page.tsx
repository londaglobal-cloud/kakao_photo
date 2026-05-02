// ============================================
// 1. 메인 페이지 (/)
// ============================================
// - 서비스 설명
// - 가격 표시 (4,900원)
// - 사진 업로드 버튼 → /upload 로 이동
// - 샘플 이모티콘 12개 그리드
import Link from 'next/link';
import EmoticonGrid from '@/components/EmoticonGrid';

const PRICE = process.env.NEXT_PUBLIC_PRICE_KRW || '4900';

export default function HomePage() {
  return (
    <main className="container-mobile">
      {/* 헤더: 서비스 이름 + 한 줄 설명 */}
      <header className="text-center mb-6 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          내얼굴 <span className="text-secondary">이모티콘</span> 생성기
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          내 사진으로 만드는 카카오톡 스타일 이모티콘 12종
        </p>
      </header>

      {/* 가격 배지 */}
      <div className="bg-primary rounded-2xl py-4 px-5 text-center mb-5 shadow-sticker">
        <p className="text-xs text-gray-700">12종 세트</p>
        <p className="text-3xl font-extrabold">
          {Number(PRICE).toLocaleString()}원
        </p>
        <p className="text-xs text-gray-600 mt-1">
          한 번 결제로 PNG 12장 다운로드
        </p>
      </div>

      {/* 샘플 그리드 */}
      <h2 className="text-lg font-bold mb-3">이런 이모티콘이 만들어져요</h2>
      <EmoticonGrid />

      {/* CTA */}
      <Link href="/upload" className="block mt-7">
        <button className="btn-primary">📷 내 사진으로 시작하기</button>
      </Link>

      <p className="text-center text-xs text-gray-500 mt-3">
        본인 사진만 업로드해 주세요
      </p>

      {/* 결제 수단 안내 */}
      <div className="mt-8 mb-10 text-center">
        <p className="text-xs text-gray-500 mb-2">지원 결제 수단</p>
        <div className="flex justify-center gap-2 text-2xl">
          <span title="카카오페이">💛</span>
          <span title="네이버페이">💚</span>
          <span title="삼성페이">🔵</span>
          <span title="애플페이">🍎</span>
          <span title="휴대폰결제">📱</span>
        </div>
      </div>
    </main>
  );
}
