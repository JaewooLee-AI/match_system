import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pages = [
  {
    href: "/register",
    title: "프로필 등록",
    description: "이름, 지역, 희망 직종, 경력을 입력하세요.",
    icon: "📝",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    href: "/recommendations",
    title: "추천 일자리",
    description: "매칭 점수 높은 순으로 일자리를 확인하세요.",
    icon: "💼",
    color: "border-green-200 hover:border-green-400",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "미매칭 · 매칭 대기 · 배정 완료 현황을 관리하세요.",
    icon: "📊",
    color: "border-purple-200 hover:border-purple-400",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">상상우리</h1>
      <p className="text-2xl text-gray-600 mb-16">
        시니어와 일자리를 연결하는 자동 매칭 시스템
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card
              className={`border-2 ${page.color} transition-all cursor-pointer h-full shadow-sm hover:shadow-md`}
            >
              <CardHeader className="pb-2">
                <div className="text-5xl mb-2">{page.icon}</div>
                <CardTitle className="text-2xl text-gray-800">{page.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl text-gray-600 mb-6">{page.description}</p>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-xl py-6 font-semibold"
                >
                  바로 가기
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
