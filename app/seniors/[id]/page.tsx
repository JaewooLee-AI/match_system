"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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

const FIELD_CLASS =
  "text-xl py-6 px-4 border-2 border-gray-300 focus:border-blue-500";
const SELECT_TRIGGER_CLASS =
  "text-xl py-6 h-auto border-2 border-gray-300 focus:border-blue-500";
const ERROR_CLASS =
  "text-lg text-red-700 bg-red-50 border border-red-300 rounded-lg px-4 py-3";

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={ERROR_CLASS}>{message}</p>;
}

export default function EditSeniorPage() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    name: "",
    region: "",
    desired_job: "",
    career_years: "0",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("seniors")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setForm({
        name: data.name,
        region: data.region,
        desired_job: data.desired_job,
        career_years: String(data.career_years),
      });
      setLoading(false);
    }
    load();
  }, [id]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "success") setStatus("idle");
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
    setStatus("saving");

    const { error } = await supabase
      .from("seniors")
      .update({
        name: form.name.trim(),
        region: form.region,
        desired_job: form.desired_job,
        career_years: Math.max(0, Number(form.career_years) || 0),
      })
      .eq("id", id);

    if (error) {
      setServerError(error.message);
      setStatus("error");
      return;
    }

    await supabase.rpc("recalculate_matches_for_senior", { p_senior_id: id });
    setStatus("success");
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-xl text-gray-400 text-center">
        불러오는 중…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center space-y-6">
        <p className="text-2xl text-red-700">해당 시니어를 찾을 수 없습니다.</p>
        <Link href="/seniors">
          <Button size="lg" className="text-xl cursor-pointer">
            목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/seniors">
          <Button variant="outline" className="text-base cursor-pointer mb-4 border-gray-300 text-gray-600 hover:bg-gray-100">
            ← 목록으로
          </Button>
        </Link>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">프로필 관리</p>
        <h1 className="text-4xl font-bold text-gray-900">프로필 수정</h1>
      </div>

      {status === "success" && (
        <div className="text-xl text-green-800 bg-green-50 border-2 border-green-400 rounded-xl px-6 py-5 mb-8 space-y-3">
          <p className="font-bold">✅ 수정이 완료되었습니다. 매칭이 재계산되었습니다.</p>
          <div className="flex gap-6">
            <Link href="/seniors" className="underline font-semibold hover:text-green-700">
              목록으로 →
            </Link>
            <Link
              href={`/recommendations?senior_id=${id}`}
              className="underline font-semibold hover:text-green-700"
            >
              추천 일자리 보기 →
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-xl text-red-800 bg-red-50 border-2 border-red-400 rounded-xl px-6 py-5 mb-8 font-semibold">
          ❌ 오류가 발생했습니다: {serverError}
        </div>
      )}

      <Card className="rounded-2xl border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-gray-800">개인 정보 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                이름 <span className="text-red-500">*</span>
              </Label>
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
              <FieldError message={errors.desired_job} />
              <Select
                value={form.desired_job}
                onValueChange={(v) => set("desired_job", v ?? "")}
              >
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
              disabled={status === "saving"}
              className="w-full text-2xl py-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
            >
              {status === "saving" ? "저장 중…" : "수정 저장"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
