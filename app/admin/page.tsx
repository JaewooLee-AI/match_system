"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase, Job } from "@/lib/supabase";
import type { SeniorDashboardRow, MatchSummary } from "@/lib/supabase";
import { REGIONS, JOB_TYPES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── 상수 ────────────────────────────────────────────────────────────────────

const SELECT_TRIGGER_CLASS =
  "text-lg py-5 h-auto border-2 border-gray-300 focus:border-blue-500";

// ── 집계 카드 ────────────────────────────────────────────────────────────────

const SUMMARY_META = [
  {
    key: "unmatched_count" as keyof MatchSummary,
    icon: "⚠️",
    label: "미매칭",
    desc: "매칭 가능한 일자리 없음",
    color: "border-red-200 bg-red-50",
    textColor: "text-red-700",
  },
  {
    key: "pending_count" as keyof MatchSummary,
    icon: "🕐",
    label: "매칭 대기",
    desc: "일자리 매칭 완료 · 배정 전",
    color: "border-yellow-200 bg-yellow-50",
    textColor: "text-yellow-700",
  },
  {
    key: "assigned_count" as keyof MatchSummary,
    icon: "✅",
    label: "배정 완료",
    desc: "담당자가 배정 확인한 시니어",
    color: "border-green-200 bg-green-50",
    textColor: "text-green-700",
  },
] as const;

// ── 상태 배지 ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SeniorDashboardRow["match_status"] }) {
  if (status === "assigned")
    return (
      <Badge className="text-base px-3 py-1 bg-green-100 text-green-800 border border-green-400">
        배정 완료
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="text-base px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-400">
        매칭 대기
      </Badge>
    );
  return (
    <Badge className="text-base px-3 py-1 bg-gray-100 text-gray-600 border border-gray-300">
      미매칭
    </Badge>
  );
}

// ── 매칭 대시보드 ────────────────────────────────────────────────────────────

function MatchDashboard({ refreshKey }: { refreshKey: number }) {
  const [summary, setSummary] = useState<MatchSummary | null>(null);
  const [seniors, setSeniors] = useState<SeniorDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: sumArr }, { data: seniorRows }] = await Promise.all([
      supabase.rpc("get_match_summary"),
      supabase.rpc("get_senior_dashboard"),
    ]);
    setSummary((sumArr as MatchSummary[] | null)?.[0] ?? null);
    setSeniors((seniorRows as SeniorDashboardRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function assignSenior(id: string) {
    setActingId(id);
    await supabase
      .from("matches")
      .update({ status: "assigned" })
      .eq("senior_id", id)
      .eq("status", "pending");
    await load();
    setActingId(null);
  }

  async function unassignSenior(id: string) {
    setActingId(id);
    await supabase
      .from("matches")
      .update({ status: "pending" })
      .eq("senior_id", id)
      .eq("status", "assigned");
    await load();
    setActingId(null);
  }

  const activeSeniors = seniors.filter((s) => s.match_status !== "assigned");
  const assignedSeniors = seniors.filter((s) => s.match_status === "assigned");

  const scoreClass = (score: number) =>
    score === 6
      ? "text-yellow-600"
      : score >= 4
      ? "text-green-600"
      : score >= 2
      ? "text-gray-700"
      : "text-gray-400";

  return (
    <section className="mb-16">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">현황</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">매칭 현황</h2>

      {/* 집계 카드 3개 */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {SUMMARY_META.map((m) => (
          <Card key={m.key} className={`rounded-2xl border-2 ${m.color} shadow-sm`}>
            <CardContent className="py-6 text-center">
              <p className="text-3xl mb-1">{m.icon}</p>
              <p className="text-xl font-semibold text-gray-700 mb-1">{m.label}</p>
              <p className={`text-5xl font-bold ${m.textColor}`}>
                {loading ? "…" : (summary?.[m.key] ?? 0)}
              </p>
              <p className="text-base text-gray-500 mt-1">{m.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 미매칭 · 매칭 대기 목록 */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">미매칭 · 매칭 대기 목록</CardTitle>
            {!loading && (
              <Badge className="text-base px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
                {activeSeniors.length}명
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-xl text-gray-400 text-center">불러오는 중…</div>
          ) : activeSeniors.length === 0 ? (
            <div className="py-12 text-xl text-gray-400 text-center">
              미매칭·대기 중인 시니어가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["이름", "지역", "희망 직종", "최고 점수", "상태", "상세"].map((h) => (
                      <th key={h} className="py-3 px-4 text-lg font-semibold text-gray-700 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeSeniors.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-4 px-4 text-xl font-semibold text-gray-900 text-center">{s.name}</td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.region}</td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.desired_job}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xl font-bold ${scoreClass(s.best_score)}`}>
                          {s.best_score}점
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {s.match_status === "pending" ? (
                          <button
                            onClick={() => assignSenior(s.id)}
                            disabled={actingId === s.id}
                            title="클릭하여 배정 완료 처리"
                            className="text-base px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-full font-semibold hover:bg-yellow-200 cursor-pointer transition-colors disabled:opacity-50"
                          >
                            {actingId === s.id ? "처리 중…" : "🕐 매칭 대기"}
                          </button>
                        ) : (
                          <StatusBadge status={s.match_status} />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link href={`/recommendations?senior_id=${s.id}`}>
                          <Button variant="outline" size="sm" className="text-base px-4 py-2 font-semibold border-2 cursor-pointer">
                            상세 보기
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 배정 완료 목록 */}
      <Card className="rounded-2xl border-2 border-green-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">✅ 배정 완료 목록</CardTitle>
            {!loading && (
              <Badge className="text-base px-3 py-1 bg-green-100 text-green-800 border border-green-400">
                {assignedSeniors.length}명
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-xl text-gray-400 text-center">불러오는 중…</div>
          ) : assignedSeniors.length === 0 ? (
            <div className="py-12 text-xl text-gray-400 text-center">
              배정 완료된 시니어가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["이름", "지역", "희망 직종", "최고 점수", "상태", "상세", "매칭 취소"].map((h) => (
                      <th key={h} className="py-3 px-4 text-lg font-semibold text-gray-700 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignedSeniors.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-green-50"} hover:bg-green-100 transition-colors`}
                    >
                      <td className="py-4 px-4 text-xl font-semibold text-gray-900 text-center">{s.name}</td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.region}</td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.desired_job}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xl font-bold ${scoreClass(s.best_score)}`}>
                          {s.best_score}점
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={s.match_status} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link href={`/recommendations?senior_id=${s.id}`}>
                          <Button variant="outline" size="sm" className="text-base px-4 py-2 font-semibold border-2 cursor-pointer">
                            상세 보기
                          </Button>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unassignSenior(s.id)}
                          disabled={actingId === s.id}
                          className="text-base px-4 py-2 font-semibold border-2 border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer"
                        >
                          {actingId === s.id ? "처리 중…" : "매칭 취소"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// ── 일자리 관리 ────────────────────────────────────────────────────────────

type JobForm = {
  title: string;
  region: string;
  job_type: string;
  required_career: string;
};

const EMPTY_JOB_FORM: JobForm = {
  title: "",
  region: "",
  job_type: "",
  required_career: "0",
};

function JobManagement({ onJobAdded }: { onJobAdded: () => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<JobForm>(EMPTY_JOB_FORM);
  const [formErrors, setFormErrors] = useState<Partial<JobForm>>({});
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    setJobs(data ?? []);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  function setField(field: keyof JobForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateJob(): Partial<JobForm> {
    const e: Partial<JobForm> = {};
    if (!form.title.trim()) e.title = "공고명을 입력해 주세요.";
    if (!form.region) e.region = "지역을 선택해 주세요.";
    if (!form.job_type) e.job_type = "직종을 선택해 주세요.";
    return e;
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validateJob();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setAdding(true);
    const { data: inserted } = await supabase
      .from("jobs")
      .insert({
        title: form.title.trim(),
        region: form.region,
        job_type: form.job_type,
        required_career: Math.max(0, Number(form.required_career) || 0),
      })
      .select("id")
      .single();

    if (inserted) {
      // 자동 매칭: 해당 일자리 × 모든 시니어 점수 재계산
      await supabase.rpc("recalculate_matches_for_job", { p_job_id: inserted.id });
      onJobAdded();
    }

    setForm(EMPTY_JOB_FORM);
    setFormErrors({});
    setAdding(false);
    loadJobs();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from("jobs").delete().eq("id", id);
    setDeletingId(null);
    loadJobs();
    onJobAdded(); // matches도 CASCADE로 삭제되므로 대시보드 갱신
  }

  return (
    <section className="mb-16">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">일자리</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">일자리 관리</h2>

      {/* 일자리 추가 폼 */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl text-gray-800">새 일자리 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} noValidate className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 공고명 */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-lg font-semibold text-gray-800">
                  공고명 <span className="text-red-500">*</span>
                </Label>
                {formErrors.title && (
                  <p className="text-base text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                    {formErrors.title}
                  </p>
                )}
                <Input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="예: 아파트 경비원 모집"
                  className="text-lg py-5 px-4 border-2 border-gray-300 focus:border-blue-500"
                />
              </div>

              {/* 지역 */}
              <div className="space-y-1">
                <Label className="text-lg font-semibold text-gray-800">
                  지역 <span className="text-red-500">*</span>
                </Label>
                {formErrors.region && (
                  <p className="text-base text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                    {formErrors.region}
                  </p>
                )}
                <Select value={form.region} onValueChange={(v) => setField("region", v ?? "")}>
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r} className="text-lg py-2">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 직종 */}
              <div className="space-y-1">
                <Label className="text-lg font-semibold text-gray-800">
                  직종 <span className="text-red-500">*</span>
                </Label>
                {formErrors.job_type && (
                  <p className="text-base text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                    {formErrors.job_type}
                  </p>
                )}
                <Select
                  value={form.job_type}
                  onValueChange={(v) => setField("job_type", v ?? "")}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue placeholder="직종 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((j) => (
                      <SelectItem key={j} value={j} className="text-lg py-2">
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 요구 경력 */}
              <div className="space-y-1">
                <Label className="text-lg font-semibold text-gray-800">요구 경력 (년)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.required_career}
                  onChange={(e) => setField("required_career", e.target.value)}
                  className="text-lg py-5 px-4 border-2 border-gray-300 focus:border-blue-500"
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={adding}
                  size="lg"
                  className="w-full text-xl py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  {adding ? "추가 중…" : "일자리 추가"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 일자리 목록 테이블 */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">등록된 일자리</CardTitle>
            <Badge className="text-base px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
              총 {jobs.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-xl text-gray-400">
              등록된 일자리가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["공고명", "지역", "직종", "요구 경력", "삭제"].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-lg font-semibold text-gray-700 text-center"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={`border-b border-gray-100 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-4 px-4 text-xl font-medium text-gray-900 text-center">
                        {job.title}
                      </td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">
                        {job.region}
                      </td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">
                        {job.job_type}
                      </td>
                      <td className="py-4 px-4 text-xl text-gray-700 text-center">
                        {job.required_career}년
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="text-base px-4 py-2 font-semibold"
                        >
                          {deletingId === job.id ? "삭제 중…" : "삭제"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// ── 페이지 ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [dashboardKey, setDashboardKey] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">관리자</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-500 mb-12">
        일자리를 등록하고 시니어 매칭 현황을 관리하세요.
      </p>

      <MatchDashboard refreshKey={dashboardKey} />

      <div className="border-t-2 border-gray-200 pt-12">
        <JobManagement onJobAdded={() => setDashboardKey((k) => k + 1)} />
      </div>
    </div>
  );
}
