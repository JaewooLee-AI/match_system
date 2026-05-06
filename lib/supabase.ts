import { createClient } from "@supabase/supabase-js";

// anon key는 프론트엔드 공개 키 — 코드에 직접 기재해도 보안 문제 없음 (학습 환경)
// Vercel 빌드 시 NEXT_PUBLIC_* 치환 오작동을 피하기 위해 값을 직접 선언
const supabaseUrl = "https://tdiazkelturrponuufxw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkaWF6a2VsdHVycnBvbnV1Znh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTE4NjcsImV4cCI6MjA5MzU2Nzg2N30.YhJEf_SbVFbn-VCw1U1rN5VjsOW3GIezVVVpw8wh0zw";

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
