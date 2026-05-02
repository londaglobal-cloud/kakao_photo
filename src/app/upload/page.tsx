// ============================================
// 2. 업로드 페이지 (/upload)
// ============================================
// - 이미지 업로드 (또는 모바일 카메라 촬영)
// - 스타일 선택 (실사 / 카툰 / 이모티콘)
// - 닉네임 입력
// - "생성하기" 클릭 → /api/generate 호출 → /result/[jobId]
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STYLES, DEFAULT_STYLE, type StyleId } from '@/lib/styles';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [styleId, setStyleId] = useState<StyleId>(DEFAULT_STYLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFile(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('사진을 먼저 선택해주세요');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faceImageDataUrl: file,
          nickname,
          styleId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '생성 실패');
      router.push(`/result/${data.jobId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했어요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-mobile">
      <div className="flex items-center mb-4 pt-4">
        <Link href="/" className="text-2xl">‹</Link>
        <h1 className="ml-2 text-xl font-extrabold">사진 업로드</h1>
      </div>

      {/* 업로드 영역 */}
      <label className="block">
        <div
          className={`aspect-square rounded-3xl border-4 border-dashed flex items-center
            justify-center cursor-pointer overflow-hidden bg-white
            ${file ? 'border-accent' : 'border-gray-300'}`}
        >
          {file ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file} alt="업로드 사진" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-5xl">📷</p>
              <p className="mt-2 text-sm">탭해서 사진 선택 / 촬영</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {/* 스타일 선택 */}
      <div className="mt-6">
        <label className="text-sm text-gray-700 font-bold">그림체 선택</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {STYLES.map((s) => {
            const selected = s.id === styleId;
            return (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`rounded-2xl py-3 px-2 text-center transition border-2
                  ${selected
                    ? 'bg-primary border-yellow-500 shadow-sticker'
                    : 'bg-white border-gray-200'}`}
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="font-bold text-sm mt-1">{s.label}</div>
                <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                  {s.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 닉네임 */}
      <div className="mt-5">
        <label className="text-sm text-gray-700 font-bold">닉네임 (선택)</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예: 지영"
          className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-accent outline-none"
          maxLength={10}
        />
      </div>

      <ul className="mt-5 text-xs text-gray-500 space-y-1">
        <li>• 정면을 바라보는 밝은 사진일수록 결과가 좋아요</li>
        <li>• 본인 얼굴 사진만 사용해주세요 (타인 사진 X)</li>
        <li>• 결제 전에 12장 미리보기를 확인할 수 있어요</li>
      </ul>

      {error && <p className="mt-3 text-sm text-red-500 font-bold">⚠ {error}</p>}

      <button
        className="btn-primary mt-6"
        disabled={loading || !file}
        onClick={handleSubmit}
      >
        {loading ? '생성 중... (15~30초)' : '✨ 12개 이모티콘 만들기'}
      </button>
    </main>
  );
}
