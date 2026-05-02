// ============================================
// 2. 업로드 페이지 (/upload)
// ============================================
// - 이미지 업로드 (또는 모바일 카메라 촬영)
// - 닉네임 입력
// - "생성하기" 클릭 → /api/generate 호출 → /result/[jobId] 로 이동
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<string | null>(null); // dataURL
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 파일 → dataURL 변환 (서버로 그대로 전송)
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
        body: JSON.stringify({ faceImageDataUrl: file, nickname }),
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

      {/* 업로드 영역 (탭하면 카메라/앨범 선택, 모바일은 capture로 카메라 우선) */}
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

      {/* 닉네임 (선택) */}
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

      {/* 안내문구 */}
      <ul className="mt-5 text-xs text-gray-500 space-y-1">
        <li>• 정면을 바라보는 밝은 사진일수록 결과가 좋아요</li>
        <li>• 본인 얼굴 사진만 사용해주세요 (타인 사진 X)</li>
        <li>• 결제 전에 12장 미리보기를 확인할 수 있어요</li>
      </ul>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-bold">⚠ {error}</p>
      )}

      <button
        className="btn-primary mt-6"
        disabled={loading || !file}
        onClick={handleSubmit}
      >
        {loading ? '생성 중... (10~30초)' : '✨ 12개 이모티콘 만들기'}
      </button>
    </main>
  );
}
