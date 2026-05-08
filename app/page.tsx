import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    href: "/register",
    title: "프로필 등록",
    description: "이름, 지역, 희망 직종, 경력을 입력하면 즉시 매칭이 시작됩니다.",
    icon: "📝",
  },
  {
    href: "/seniors",
    title: "시니어 목록",
    description: "등록된 시니어 프로필을 조회·수정·삭제합니다.",
    icon: "👥",
  },
  {
    href: "/recommendations",
    title: "추천 일자리",
    description: "매칭 점수 높은 순으로 맞춤 일자리를 확인하세요.",
    icon: "💼",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "미매칭·매칭 대기·배정 완료 현황을 한눈에 관리합니다.",
    icon: "📊",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        {/* 도트 패턴 */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* 블루 글로우 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 sm:py-36 text-center">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm">
            🤝 시니어 일자리 자동 매칭 시스템
          </div>

          {/* 제목 */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="text-white">일자리, 이제</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
              상상우리
            </span>
            <span className="text-white">가 찾아드립니다</span>
          </h1>

          {/* 부제목 */}
          <p className="text-lg sm:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            지역·직종·경력을 입력하면 딱 맞는 일자리를{" "}
            <span className="text-white font-semibold">자동으로 매칭</span>
            해 드립니다.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto text-xl py-7 px-10 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer transition-colors"
              >
                지금 신청하기 →
              </Button>
            </Link>
            <Link href="/seniors">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-xl py-7 px-10 border-2 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white rounded-xl cursor-pointer transition-colors"
              >
                시니어 목록 보기
              </Button>
            </Link>
          </div>

          {/* 통계 힌트 */}
          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 text-center">
            {[
              { label: "자동 매칭", value: "6점 만점" },
              { label: "지원 지역", value: "8개 지역" },
              { label: "지원 직종", value: "5개 직종" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm sm:text-base text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기능 카드 ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24 w-full">
        <p className="text-center text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
          주요 기능
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          무엇을 도와드릴까요?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Link key={f.href} href={f.href}>
              <div className="group h-full flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all cursor-pointer">
                <div className="text-4xl">{f.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-relaxed">{f.description}</p>
                </div>
                <span className="mt-auto text-blue-600 font-semibold text-sm group-hover:underline">
                  바로 가기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
