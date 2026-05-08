"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { REGIONS, JOB_TYPES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  region: string;
  desired_job: string;
  career_years: string;
};

type Errors = {
  name?: string;
  region?: string;
  desired_job?: string;
};

const FIELD_CLASS =
  "text-xl py-6 px-4 border-2 border-gray-300 focus:border-indigo-500";
const SELECT_TRIGGER_CLASS =
  "text-xl py-6 h-auto border-2 border-gray-300 focus:border-indigo-500";
const ERROR_CLASS =
  "text-lg text-red-700 bg-red-50 border border-red-300 rounded-lg px-4 py-3";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={ERROR_CLASS}>{message}</p>;
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    region: "",
    desired_job: "",
    career_years: "0",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [insertedId, setInsertedId] = useState<string | null>(null);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!form.region) e.region = "지역을 선택해 주세요.";
    if (!form.desired_job) e.desired_job = "희망 직종을 선택해 주세요.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    const { data: inserted, error } = await supabase
      .from("seniors")
      .insert({
        name: form.name.trim(),
        region: form.region,
        desired_job: form.desired_job,
        career_years: Math.max(0, Number(form.career_years) || 0),
      })
      .select("id")
      .single();

    if (error) {
      setServerError(error.message);
      setStatus("error");
      return;
    }

    // 자동 매칭: 해당 시니어 × 모든 일자리 점수 재계산
    await supabase.rpc("recalculate_matches_for_senior", {
      p_senior_id: inserted.id,
    });

    setInsertedId(inserted.id);
    setStatus("success");
    setForm({ name: "", region: "", desired_job: "", career_years: "0" });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">신청하기</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 일자리 신청하기</h1>
      <p className="text-xl text-gray-500 mb-10">
        정보를 입력하시면 맞는 일자리를 찾아드립니다.
      </p>

      {/* 성공 메시지 */}
      {status === "success" && (
        <div className="text-xl text-green-800 bg-green-50 border-2 border-green-400 rounded-xl px-6 py-5 mb-8 space-y-3">
          <p className="font-bold">✅ 등록이 완료되었습니다. 담당자가 곧 연락드립니다.</p>
          <p className="font-normal">아래 버튼을 눌러 추천 일자리를 먼저 확인하실 수 있습니다.</p>
          {insertedId && (
            <a
              href={`/recommendations?senior_id=${insertedId}`}
              className="inline-block mt-2 bg-green-700 hover:bg-green-800 text-white text-xl font-bold px-6 py-3 rounded-xl transition-colors"
            >
              추천 일자리 보기 →
            </a>
          )}
        </div>
      )}

      {/* 서버 오류 메시지 */}
      {status === "error" && (
        <div className="text-xl text-red-800 bg-red-50 border-2 border-red-400 rounded-xl px-6 py-5 mb-8 font-semibold">
          ❌ 오류가 발생했습니다: {serverError}
        </div>
      )}

      <Card className="rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-gray-800">개인 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                이름 <span className="text-red-500">*</span>
              </Label>
              <p className="text-base text-gray-500">실명을 입력해 주세요 (예: 홍길동)</p>
              <FieldError message={errors.name} />
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="홍길동"
                className={FIELD_CLASS}
              />
            </div>

            {/* 지역 */}
            <div className="space-y-2">
              <Label className="text-xl font-semibold text-gray-800">
                거주 지역 <span className="text-red-500">*</span>
              </Label>
              <p className="text-base text-gray-500">현재 거주하시는 지역을 선택해 주세요</p>
              <FieldError message={errors.region} />
              <Select value={form.region} onValueChange={(v) => set("region", v ?? "")}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r} className="text-xl py-3">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 희망 직종 */}
            <div className="space-y-2">
              <Label className="text-xl font-semibold text-gray-800">
                희망 직종 <span className="text-red-500">*</span>
              </Label>
              <p className="text-base text-gray-500">일하고 싶으신 직종을 선택해 주세요</p>
              <FieldError message={errors.desired_job} />
              <Select value={form.desired_job} onValueChange={(v) => set("desired_job", v ?? "")}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="직종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((j) => (
                    <SelectItem key={j} value={j} className="text-xl py-3">
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 경력 연수 */}
            <div className="space-y-2">
              <Label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
                관련 경력 (년)
              </Label>
              <p className="text-base text-gray-500">해당 직종 관련 경력 연수를 입력해 주세요 (없으면 0)</p>
              <Input
                id="career_years"
                type="number"
                min={0}
                value={form.career_years}
                onChange={(e) => set("career_years", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={status === "loading"}
              className="w-full text-2xl py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
            >
              {status === "loading" ? "저장 중…" : "등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
