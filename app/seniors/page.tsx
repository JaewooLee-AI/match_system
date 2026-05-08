"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SeniorDashboardRow } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function StatusBadge({ status }: { status: SeniorDashboardRow["match_status"] }) {
  if (status === "assigned")
    return (
      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        배정 완료
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        매칭 대기
      </span>
    );
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-200">
      미매칭
    </span>
  );
}

function ActionButtons({
  s,
  deletingId,
  onDelete,
}: {
  s: SeniorDashboardRow;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}) {
  const isAssigned = s.match_status === "assigned";
  return (
    <div className="flex gap-2 flex-wrap">
      <Link href={`/recommendations?senior_id=${s.id}`}>
        <Button variant="outline" size="sm" className="text-sm font-semibold border-2 cursor-pointer">
          추천 보기
        </Button>
      </Link>
      <Link href={`/seniors/${s.id}`}>
        <Button size="sm" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
          수정
        </Button>
      </Link>
      {isAssigned ? (
        <Button
          variant="outline"
          size="sm"
          disabled
          title="배정 완료된 시니어는 삭제할 수 없습니다"
          className="w-20 text-sm font-semibold border-2 text-gray-400 cursor-not-allowed"
        >
          삭제 불가
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(s.id, s.name)}
          disabled={deletingId === s.id}
          className="w-20 text-sm font-semibold cursor-pointer"
        >
          {deletingId === s.id ? "삭제 중…" : "삭제"}
        </Button>
      )}
    </div>
  );
}

export default function SeniorsPage() {
  const [seniors, setSeniors] = useState<SeniorDashboardRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSeniors = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc("get_senior_dashboard");
    setSeniors((data as SeniorDashboardRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSeniors();
  }, [loadSeniors]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 님의 프로필을 삭제하시겠습니까?\n삭제하면 매칭 정보도 함께 삭제됩니다.`)) return;
    setDeletingId(id);
    await supabase.from("seniors").delete().eq("id", id);
    setDeletingId(null);
    loadSeniors();
  }

  const filtered = seniors.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q) ||
      s.desired_job.toLowerCase().includes(q)
    );
  });

  const emptyState =
    seniors.length === 0 ? (
      <div className="py-16 text-xl text-gray-400 text-center">
        등록된 시니어가 없습니다.{" "}
        <Link href="/register" className="underline text-blue-600 hover:text-blue-800">
          지금 등록하기 →
        </Link>
      </div>
    ) : filtered.length === 0 ? (
      <div className="py-12 text-xl text-gray-400 text-center">
        &ldquo;{query}&rdquo; 검색 결과가 없습니다.
      </div>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-1">관리</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">시니어 목록</h1>
          <p className="text-lg sm:text-xl text-gray-500">등록된 시니어 프로필을 조회·수정·삭제합니다.</p>
        </div>
        <Link href="/register" className="shrink-0">
          <Button
            size="lg"
            className="w-full sm:w-auto text-lg sm:text-xl py-5 sm:py-6 px-5 sm:px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer"
          >
            + 새 프로필 등록
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border border-gray-200 shadow-sm">
        {/* 검색 바 */}
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CardTitle className="text-xl sm:text-2xl text-gray-800 shrink-0">등록 목록</CardTitle>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="이름·지역·직종 검색"
                className="pl-10 text-base sm:text-lg py-4 sm:py-5 border-2 border-gray-300 focus:border-indigo-500"
              />
            </div>
            {!loading && (
              <Badge className="self-start sm:self-auto text-sm sm:text-base px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 shrink-0">
                {query ? `${filtered.length} / ${seniors.length}명` : `총 ${seniors.length}명`}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-6">
          {loading ? (
            <div className="py-16 text-xl text-gray-400 text-center">불러오는 중…</div>
          ) : emptyState ? (
            emptyState
          ) : (
            <>
              {/* ── 모바일: 카드 목록 ── */}
              <div className="flex flex-col gap-4 sm:hidden">
                {filtered.map((s) => (
                  <div
                    key={s.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">{s.name}</span>
                      <StatusBadge status={s.match_status} />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-base text-gray-600">
                      <span>📍 {s.region}</span>
                      <span>💼 {s.desired_job}</span>
                      <span>📅 경력 {s.career_years}년</span>
                      <span>⭐ 최고 {s.best_score}점</span>
                    </div>
                    <ActionButtons s={s} deletingId={deletingId} onDelete={handleDelete} />
                  </div>
                ))}
              </div>

              {/* ── 데스크톱: 테이블 ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
                  <colgroup>
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "36%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-slate-900">
                      {["이름", "지역", "희망 직종", "경력", "상태", "작업"].map((h) => (
                        <th key={h} className="py-4 px-5 text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className="bg-white hover:bg-indigo-50/40 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-semibold text-slate-900 text-center">{s.name}</td>
                        <td className="py-4 px-4 text-sm text-slate-600 text-center">{s.region}</td>
                        <td className="py-4 px-4 text-sm text-slate-600 text-center">{s.desired_job}</td>
                        <td className="py-4 px-4 text-sm text-slate-600 text-center">{s.career_years}년</td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={s.match_status} />
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="flex gap-2 justify-center">
                            <Link href={`/recommendations?senior_id=${s.id}`}>
                              <Button variant="outline" size="sm" className="text-sm px-3 py-1.5 font-semibold border cursor-pointer">
                                추천 보기
                              </Button>
                            </Link>
                            <Link href={`/seniors/${s.id}`}>
                              <Button size="sm" className="text-sm px-3 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                                수정
                              </Button>
                            </Link>
                            {s.match_status === "assigned" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                title="배정 완료된 시니어는 삭제할 수 없습니다"
                                className="w-20 text-sm py-1.5 font-semibold border text-gray-400 cursor-not-allowed"
                              >
                                삭제 불가
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(s.id, s.name)}
                                disabled={deletingId === s.id}
                                className="w-20 text-sm py-1.5 font-semibold cursor-pointer"
                              >
                                {deletingId === s.id ? "삭제 중…" : "삭제"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
