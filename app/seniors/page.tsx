"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { SeniorDashboardRow } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SeniorsPage() {
  const [seniors, setSeniors] = useState<SeniorDashboardRow[]>([]);
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 목록</h1>
          <p className="text-xl text-gray-600">등록된 시니어 프로필을 조회·수정·삭제합니다.</p>
        </div>
        <Link href="/register">
          <Button
            size="lg"
            className="text-xl py-6 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
          >
            + 새 프로필 등록
          </Button>
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">등록 목록</CardTitle>
            {!loading && (
              <Badge className="text-base px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
                총 {seniors.length}명
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 text-xl text-gray-400 text-center">불러오는 중…</div>
          ) : seniors.length === 0 ? (
            <div className="py-16 text-xl text-gray-400 text-center">
              등록된 시니어가 없습니다.{" "}
              <Link href="/register" className="underline text-blue-600 hover:text-blue-800">
                지금 등록하기 →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {["이름", "지역", "희망 직종", "경력", "상태", "작업"].map((h) => (
                      <th
                        key={h}
                        className={`py-3 px-4 text-lg font-semibold text-gray-700 text-center ${h === "작업" ? "w-64" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {seniors.map((s, idx) => {
                    const isAssigned = s.match_status === "assigned";
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-gray-100 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-4 px-4 text-xl font-semibold text-gray-900 text-center">
                          {s.name}
                        </td>
                        <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.region}</td>
                        <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.desired_job}</td>
                        <td className="py-4 px-4 text-xl text-gray-700 text-center">{s.career_years}년</td>
                        <td className="py-4 px-4 text-center">
                          {isAssigned ? (
                            <Badge className="text-base px-3 py-1 bg-green-100 text-green-800 border border-green-400">
                              ✅ 배정 완료
                            </Badge>
                          ) : s.match_status === "pending" ? (
                            <Badge className="text-base px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-400">
                              🕐 매칭 대기
                            </Badge>
                          ) : (
                            <Badge className="text-base px-3 py-1 bg-gray-100 text-gray-600 border border-gray-300">
                              미매칭
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="flex gap-2 justify-center">
                            <Link href={`/recommendations?senior_id=${s.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-base px-3 py-2 font-semibold border-2 cursor-pointer"
                              >
                                추천 보기
                              </Button>
                            </Link>
                            <Link href={`/seniors/${s.id}`}>
                              <Button
                                size="sm"
                                className="text-base px-3 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                              >
                                수정
                              </Button>
                            </Link>
                            {isAssigned ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                title="배정 완료된 시니어는 삭제할 수 없습니다"
                                className="text-base px-3 py-2 font-semibold border-2 text-gray-400 cursor-not-allowed"
                              >
                                삭제 불가
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(s.id, s.name)}
                                disabled={deletingId === s.id}
                                className="text-base px-3 py-2 font-semibold cursor-pointer"
                              >
                                {deletingId === s.id ? "삭제 중…" : "삭제"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
