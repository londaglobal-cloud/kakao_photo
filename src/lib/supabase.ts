// ============================================
// Supabase 클라이언트 (선택 사용)
// ============================================
// 환경변수가 비어있으면 null 반환 → 메모리 저장소(storage.ts) 사용.
// .env.local 에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력 시 활성화.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}

/**
 * Supabase jobs 테이블 스키마 (참고용)
 *
 *   create table jobs (
 *     id text primary key,
 *     nickname text,
 *     images jsonb not null,
 *     paid boolean default false,
 *     created_at timestamptz default now()
 *   );
 *
 *   -- Row Level Security (사용자별 접근 제한 시)
 *   alter table jobs enable row level security;
 */
