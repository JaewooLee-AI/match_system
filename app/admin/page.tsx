import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StatusColumn = {
  key: string;
  label: string;
  color: string;
  badgeClass: string;
  count: number;
};

const columns: StatusColumn[] = [
  {
    key: "pending",
    label: "미매칭",
    color: "border-red-200 bg-red-50",
    badgeClass: "bg-red-100 text-red-800 border border-red-300",
    count: 0,
  },
  {
    key: "waiting",
    label: "매칭 대기",
    color: "border-yellow-200 bg-yellow-50",
    badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    count: 0,
  },
  {
    key: "assigned",
    label: "배정 완료",
    color: "border-green-200 bg-green-50",
    badgeClass: "bg-green-100 text-green-800 border border-green-300",
    count: 0,
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-600 mb-10">
        매칭 상태별로 시니어 현황을 한눈에 확인하세요.
      </p>

      {/* 요약 통계 자리 */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {columns.map((col) => (
          <Card key={col.key} className={`border-2 ${col.color} shadow-sm`}>
            <CardContent className="py-6 text-center">
              <p className="text-xl font-semibold text-gray-700 mb-1">{col.label}</p>
              <p className="text-5xl font-bold text-gray-900">{col.count}</p>
              <p className="text-lg text-gray-500 mt-1">건</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 칸반 레이아웃 */}
      <div className="grid grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.key} className={`rounded-xl border-2 ${col.color} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{col.label}</h2>
              <Badge className={`text-base px-3 py-1 ${col.badgeClass}`}>
                {col.count}건
              </Badge>
            </div>

            {/* 빈 상태 */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-xl text-gray-400">데이터 없음</p>
              <p className="text-base text-gray-300 mt-1">
                매칭 후 여기에 표시됩니다
              </p>
            </div>

            {/* 카드 뼈대 예시 */}
            {[1].map((i) => (
              <Card key={i} className="mb-3 shadow-sm opacity-20">
                <CardContent className="py-4 px-4">
                  <p className="text-xl font-semibold text-gray-800">시니어 이름</p>
                  <p className="text-lg text-gray-600">희망 직종</p>
                  <p className="text-lg text-gray-500">지역 | 경력 0년</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-400 text-lg">
        ※ 대시보드 기능은 다음 단계에서 구현됩니다.
      </p>
    </div>
  );
}
