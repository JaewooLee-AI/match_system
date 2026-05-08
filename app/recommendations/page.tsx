"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { MatchWithJob } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ScoreBadge({ score }: { score: number }) {
  if (score === 6)
    return (
      <Badge className="text-lg px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-500 font-bold">
        ⭐ {score}점 · 매우 적합
      </Badge>
    );
  if (score >= 4)
    return (
      <Badge className="text-lg px-3 py-1 bg-green-100 text-green-800 border border-green-400 font-semibold">
        {score}점 · 적합
      </Badge>
    );
  return (
    <Badge className="text-lg px-3 py-1 bg-gray-100 text-gray-600 border border-gray-300">
      {score}점 · 보통
    </Badge>
  );
}

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const seniorId = searchParams.get("senior_id");

  const [matches, setMatches] = useState<MatchWithJob[]>([]);
  const [seniorName, setSeniorName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seniorId) {
      setLoading(false);
      return;
    }

    async function load() {
      const [{ data: senior }, { data: matchData }] = await Promise.all([
        supabase.from("seniors").select("name").eq("id", seniorId!).single(),
        supabase
          .from("matches")
          .select("id, score, status, jobs(id, title, region, job_type, required_career)")
          .eq("senior_id", seniorId!)
          .gt("score", 0)
          .order("score", { ascending: false }),
      ]);

      if (senior) setSeniorName(senior.name);
      setMatches((matchData as unknown as MatchWithJob[]) ?? []);
      setLoading(false);
    }

    load();
  }, [seniorId]);

  if (!seniorId) {
    return (
      <div className="text-xl text-blue-800 bg-blue-50 border-2 border-blue-300 rounded-xl px-6 py-6">
        시니어 ID가 필요합니다.{" "}
        <a href="/register" className="underline font-bold hover:text-blue-600">
          프로필을 먼저 등록해 주세요 →
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-xl text-gray-500 py-16 text-center">
        매칭 결과를 불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {seniorName ? `${seniorName} 님께 맞는 일자리` : "추천 일자리"}
        </h1>
        <p className="text-xl text-gray-600">
          경력과 희망 직종에 맞는 일자리를 점수 순으로 보여드립니다.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-xl text-orange-800 bg-orange-50 border-2 border-orange-300 rounded-xl px-6 py-10 text-center space-y-2">
          <p className="font-bold text-2xl">현재 매칭되는 일자리가 없습니다.</p>
          <p className="text-orange-600">
            담당자가 직접 연락드리니 잠시만 기다려 주세요.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="text-lg text-gray-600">정렬 기준:</span>
            <Badge className="text-base px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
              매칭 점수 높은 순
            </Badge>
            <span className="text-lg text-gray-500">총 {matches.length}건</span>
          </div>

          <div className="space-y-4">
            {matches.map((m) => (
              <Card
                key={m.id}
                className="shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl text-gray-900">
                      {m.jobs.title}
                    </CardTitle>
                    <ScoreBadge score={m.score} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-xl text-gray-700">
                    <span>📍 지역: {m.jobs.region}</span>
                    <span>💼 직종: {m.jobs.job_type}</span>
                    <span>📅 요구 경력: {m.jobs.required_career}년 이상</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Suspense
        fallback={
          <div className="text-xl text-gray-500 py-16 text-center">
            매칭 결과를 불러오는 중…
          </div>
        }
      >
        <RecommendationsContent />
      </Suspense>
    </div>
  );
}
