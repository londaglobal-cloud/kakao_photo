// ============================================
// 인메모리 잡(Job) 저장소
// ============================================
// MVP 단계에서는 서버 메모리에 잡을 임시 저장한다.
// 실서비스에서는 Supabase / Redis 로 교체할 것.
//
// ▶ Supabase 연결 방법
//   1. Supabase 프로젝트 생성, jobs 테이블 만들기
//      - id (text, pk), nickname, images (jsonb), paid (bool), created_at
//   2. 아래 saveJob/getJob 을 supabase 호출로 교체

import type { GenerationJob } from '@/lib/types';

const jobs = new Map<string, GenerationJob>();

export function saveJob(job: GenerationJob): void {
  jobs.set(job.jobId, job);
}

export function getJob(jobId: string): GenerationJob | undefined {
  return jobs.get(jobId);
}

export function markPaid(jobId: string): boolean {
  const job = jobs.get(jobId);
  if (!job) return false;
  job.paid = true;
  jobs.set(jobId, job);
  return true;
}
