import { createClient } from "@supabase/supabase-js";

// 빌드 타임(Vercel)에 env가 없어도 모듈 로딩이 멈추지 않도록 ?? 처리
// 실제 런타임에는 Vercel Environment Variables에 등록된 값이 사용됨
// .trim(): Vercel 환경변수 붙여넣기 시 섞이는 개행·공백 제거
const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
).trim();
const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key"
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Senior = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
  created_at: string;
};

export type Job = {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career: number;
  created_at: string;
};

export type Match = {
  id: string;
  senior_id: string;
  job_id: string;
  score: number;
  status: "pending" | "assigned" | "done";
  created_at: string;
};

export type MatchWithJob = {
  id: string;
  score: number;
  status: string;
  jobs: Pick<Job, "id" | "title" | "region" | "job_type" | "required_career">;
};

export type SeniorDashboardRow = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
  created_at: string;
  best_score: number;
  match_status: "unmatched" | "pending" | "assigned";
};

export type MatchSummary = {
  unmatched_count: number;
  pending_count: number;
  assigned_count: number;
};
