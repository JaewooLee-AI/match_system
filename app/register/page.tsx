import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-10">
        정보를 입력하시면 맞는 일자리를 찾아드립니다.
      </p>

      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-gray-800">개인 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                className="text-xl py-6 px-4 border-2 border-gray-300 focus:border-blue-500"
                disabled
              />
            </div>

            {/* 지역 */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-xl font-semibold text-gray-800">
                거주 지역
              </Label>
              <Input
                id="region"
                name="region"
                type="text"
                placeholder="서울 강남구"
                className="text-xl py-6 px-4 border-2 border-gray-300 focus:border-blue-500"
                disabled
              />
            </div>

            {/* 희망 직종 */}
            <div className="space-y-2">
              <Label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">
                희망 직종
              </Label>
              <Input
                id="desired_job"
                name="desired_job"
                type="text"
                placeholder="경비, 청소, 사무보조 등"
                className="text-xl py-6 px-4 border-2 border-gray-300 focus:border-blue-500"
                disabled
              />
            </div>

            {/* 경력 연수 */}
            <div className="space-y-2">
              <Label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
                관련 경력 (년)
              </Label>
              <Input
                id="career_years"
                name="career_years"
                type="number"
                min={0}
                placeholder="0"
                className="text-xl py-6 px-4 border-2 border-gray-300 focus:border-blue-500"
                disabled
              />
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-2xl py-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              disabled
            >
              등록하기
            </Button>

            <p className="text-center text-gray-500 text-lg">
              ※ 기능은 다음 단계에서 구현됩니다.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
