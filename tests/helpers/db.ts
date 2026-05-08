import { createClient } from "@supabase/supabase-js";

// anon key는 공개 키 — 테스트 환경에서 직접 사용
export const db = createClient(
  "https://tdiazkelturrponuufxw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkaWF6a2VsdHVycnBvbnV1Znh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTE4NjcsImV4cCI6MjA5MzU2Nzg2N30.YhJEf_SbVFbn-VCw1U1rN5VjsOW3GIezVVVpw8wh0zw"
);

/** 3개 테이블 데이터 전체 삭제 (테스트 간 격리) */
export async function resetDB(): Promise<void> {
  await db.from("matches").delete().not("id", "is", null);
  await db.from("seniors").delete().not("id", "is", null);
  await db.from("jobs").delete().not("id", "is", null);
}

/** jobs 테이블에 공고 1건 삽입 */
export async function insertJob(params: {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}): Promise<{ id: string }> {
  const { data, error } = await db
    .from("jobs")
    .insert(params)
    .select("id")
    .single();
  if (error) throw new Error(`insertJob failed: ${error.message}`);
  return data!;
}

/** seniors 테이블 레코드 수 조회 */
export async function countSeniors(): Promise<number> {
  const { count, error } = await db
    .from("seniors")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`countSeniors failed: ${error.message}`);
  return count ?? 0;
}
