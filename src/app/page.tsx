// ============================================
// 1. 메인(랜딩) 페이지 (/)
// ============================================
import Link from 'next/link';
import EmoticonGrid from '@/components/EmoticonGrid';

const PRICE = process.env.NEXT_PUBLIC_PRICE_KRW || '4900';

export default function HomePage() {
  return (
    <main>
      {/* ───────── 히어로 ───────── */}
      <section className="container-mobile pt-8 pb-2">
        <div className="text-center">
          <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">
            내 사진 한 장이면 끝
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">
            나만의 <span className="text-secondary">카톡 이모티콘</span><br />
            12종 세트
          </h1>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            셀카 한 장 올리면 AI가 12가지 표정의<br />
            실사 이모티콘을 만들어드려요
          </p>
        </div>

        {/* 미니 미리보기 - 대표 4장 */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[1, 3, 7, 11].map((idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={`/samples/${String(idx).padStart(2, '0')}_${
                ['hello', 'best', 'love', 'fighting', 'wellDone',
                 'hmm', 'omg', 'sleepy', 'yummy', 'cute',
                 'thanks', 'good'][idx - 1]
              }.png`}
              alt="샘플"
              className="aspect-square object-cover rounded-2xl shadow-sticker bg-white"
            />
          ))}
        </div>

        <Link href="/upload" className="block mt-6">
          <button className="btn-primary">
            ✨ 지금 만들기 · {Number(PRICE).toLocaleString()}원
          </button>
        </Link>
        <p className="text-center text-[11px] text-gray-400 mt-2">
          결제 전에 12장 미리보기 무료
        </p>
      </section>

      {/* ───────── 12종 풀 그리드 ───────── */}
      <section className="container-mobile mt-8">
        <h2 className="text-lg font-bold mb-1">12가지 표정, 한 번에</h2>
        <p className="text-xs text-gray-500 mb-3">
          인사 · 감사 · 사랑 · 응원 등 일상에서 자주 쓰는 표정만
        </p>
        <EmoticonGrid useSamples />
      </section>

      {/* ───────── 사용 방법 3단계 ───────── */}
      <section className="container-mobile mt-10">
        <h2 className="text-lg font-bold mb-3 text-center">이렇게 만들어요</h2>
        <ol className="space-y-3">
          {[
            { n: '1', t: '셀카 업로드', d: '정면 사진 한 장이면 끝' },
            { n: '2', t: 'AI 생성 15초', d: '12장 미리보기 무료 확인' },
            { n: '3', t: '결제 후 다운로드', d: '카톡 바로 등록 가능' },
          ].map((s) => (
            <li
              key={s.n}
              className="bg-white rounded-2xl p-4 shadow-sticker flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-gray-900 font-extrabold">
                {s.n}
              </span>
              <div>
                <p className="font-bold">{s.t}</p>
                <p className="text-xs text-gray-500">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── 가격 카드 ───────── */}
      <section className="container-mobile mt-10">
        <div className="bg-gradient-to-br from-primary to-yellow-300 rounded-3xl p-6 text-center shadow-sticker">
          <p className="text-xs text-gray-700">단 한 번 결제</p>
          <p className="text-5xl font-extrabold mt-1">
            {Number(PRICE).toLocaleString()}<span className="text-2xl">원</span>
          </p>
          <ul className="mt-3 text-xs text-gray-700 space-y-0.5">
            <li>✓ 360×360 PNG 12장</li>
            <li>✓ 배경 투명 · 카톡 바로 등록</li>
            <li>✓ 전체 ZIP 다운로드</li>
            <li>✓ 워터마크 없음</li>
          </ul>
        </div>
        <Link href="/upload" className="block mt-4">
          <button className="btn-primary">📷 내 사진으로 시작하기</button>
        </Link>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="container-mobile mt-10">
        <h2 className="text-lg font-bold mb-3">자주 묻는 질문</h2>
        <div className="space-y-2">
          {[
            {
              q: '진짜 내 얼굴로 만들어지나요?',
              a: '네. 업로드한 사진의 얼굴을 그대로 유지하면서 12가지 표정과 포즈를 만듭니다.',
            },
            {
              q: '얼마나 걸려요?',
              a: '약 15~30초. 12장이 동시에 생성됩니다.',
            },
            {
              q: '카톡에 바로 쓸 수 있나요?',
              a: '네. 360×360 투명 PNG로 만들어져서 카톡 커스텀 이모티콘에 바로 등록 가능합니다.',
            },
            {
              q: '환불 되나요?',
              a: '결제 전에 12장 미리보기를 무료로 확인할 수 있어요. 마음에 들 때만 결제하세요.',
            },
            {
              q: '내 사진은 안전한가요?',
              a: '생성 후 24시간 내 자동 삭제. 본인 사진만 업로드해주세요.',
            },
          ].map((f, i) => (
            <details
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sticker"
            >
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                <span>{f.q}</span>
                <span className="text-secondary">+</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── 결제 수단 + 마지막 CTA ───────── */}
      <section className="container-mobile mt-10 mb-12">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">지원 결제 수단</p>
          <div className="flex justify-center gap-2 text-2xl mb-1">
            <span title="카카오페이">💛</span>
            <span title="네이버페이">💚</span>
            <span title="삼성페이">🔵</span>
            <span title="애플페이">🍎</span>
            <span title="휴대폰결제">📱</span>
          </div>
          <p className="text-[10px] text-gray-400">토스페이먼츠 안전결제</p>
        </div>

        <Link href="/upload" className="block mt-6">
          <button className="btn-primary">✨ 지금 시작하기</button>
        </Link>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          본인 사진만 업로드해주세요 · 타인 사진 사용 금지
        </p>
      </section>
    </main>
  );
}
