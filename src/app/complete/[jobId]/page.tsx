// ============================================
// 4. 결제 완료 / 다운로드 페이지 (/complete/[jobId])
// ============================================
// - 12개 PNG 개별 다운로드
// - 전체 ZIP 다운로드
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import EmoticonGrid from '@/components/EmoticonGrid';
import type { GenerationJob } from '@/lib/types';

export default function CompletePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<GenerationJob | null>(null);

  useEffect(() => {
    fetch(`/api/job/${jobId}`)
      .then((r) => r.json())
      .then((d) => setJob(d.job));
  }, [jobId]);

  // 개별 PNG 저장
  const downloadOne = async (url: string, name: string) => {
    const blob = await (await fetch(url)).blob();
    saveAs(blob, `${name}.png`);
  };

  // 전체 ZIP 저장
  const downloadAll = async () => {
    if (!job) return;
    const zip = new JSZip();
    await Promise.all(
      job.images.map(async (img, i) => {
        const blob = await (await fetch(img.finalUrl)).blob();
        zip.file(`${String(i + 1).padStart(2, '0')}_${img.id}_${img.label}.png`, blob);
      })
    );
    const out = await zip.generateAsync({ type: 'blob' });
    saveAs(out, `myface-emoticon-${jobId}.zip`);
  };

  if (!job) {
    return (
      <main className="container-mobile pt-20 text-center text-gray-500">
        잠시만요...
      </main>
    );
  }

  if (!job.paid) {
    return (
      <main className="container-mobile pt-20 text-center">
        <p className="text-lg font-bold">아직 결제가 확인되지 않았어요</p>
        <p className="text-sm text-gray-500 mt-1">
          결제 페이지로 돌아가 다시 시도해주세요
        </p>
      </main>
    );
  }

  return (
    <main className="container-mobile">
      <header className="text-center pt-6 mb-4">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-2 text-2xl font-extrabold">결제 완료!</h1>
        <p className="text-sm text-gray-600 mt-1">
          이모티콘 12장을 다운로드 받으세요
        </p>
      </header>

      <EmoticonGrid images={job.images} />

      <button onClick={downloadAll} className="btn-primary mt-7">
        📦 전체 ZIP 다운로드
      </button>

      <h2 className="mt-6 mb-2 text-sm font-bold text-gray-700">개별 다운로드</h2>
      <div className="grid grid-cols-2 gap-2 mb-12">
        {job.images.map((img) => (
          <button
            key={img.id}
            onClick={() => downloadOne(img.finalUrl, img.label)}
            className="bg-white border-2 border-gray-200 rounded-2xl py-3 px-3 text-sm font-bold
                       flex items-center justify-between active:scale-95 transition"
          >
            <span>{img.emoji} {img.label}</span>
            <span className="text-accent">⬇</span>
          </button>
        ))}
      </div>
    </main>
  );
}
