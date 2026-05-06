import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecommendationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-600 mb-10">
        회원님의 경력과 희망 직종에 맞는 일자리를 점수 순으로 보여드립니다.
      </p>

      {/* 정렬 안내 */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-lg text-gray-600">정렬 기준:</span>
        <Badge className="text-base px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
          매칭 점수 높은 순
        </Badge>
      </div>

      {/* 추천 카드 목록 자리 */}
      <div className="space-y-4">
        {/* 빈 상태 플레이스홀더 */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-semibold text-gray-500 mb-2">
              추천 일자리가 없습니다
            </p>
            <p className="text-xl text-gray-400">
              프로필을 등록하시면 맞는 일자리를 찾아드립니다.
            </p>
          </CardContent>
        </Card>

        {/* 카드 뼈대 예시 (UI 레이아웃 확인용) */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm hover:shadow-md transition-shadow opacity-30">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl text-gray-800">일자리 제목 자리</CardTitle>
                <Badge className="text-lg px-3 py-1 bg-green-100 text-green-800 border border-green-300">
                  점수: 00점
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-xl text-gray-600">
                <span>지역: ○○구</span>
                <span>직종: ○○○</span>
                <span>필요 경력: 0년 이상</span>
                <span>상태: 대기중</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-400 text-lg">
        ※ 매칭 기능은 다음 단계에서 구현됩니다.
      </p>
    </div>
  );
}
