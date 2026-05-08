import { test, expect } from "@playwright/test";
import { resetDB, insertJob } from "./helpers/db";

test.beforeEach(async () => {
  await resetDB();
  // 사전 조건: 지역·직종 전혀 안 맞고 요구 경력도 높은 공고 1건
  // 서울/경비/3년 시니어와 점수 계산 → 0점 (필터링됨)
  await insertJob({
    title: "기타 지역 기타 직종 고경력",
    region: "기타",
    job_type: "기타",
    required_career: 10,
  });
});

test("엣지 시나리오: 0점 매칭만 있을 때 안내 박스 표시", async ({ page }) => {
  await page.goto("/register");

  await page.locator("#name").fill("노매칭시니어");

  await page.getByRole("combobox").filter({ hasText: "지역을 선택하세요" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  await page.getByRole("combobox").filter({ hasText: "직종을 선택하세요" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  await page.locator("#career_years").fill("3");

  await page.getByRole("button", { name: "등록하기" }).click();

  // 등록 성공 확인
  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible();

  // 추천 페이지로 이동
  const href = await page
    .getByRole("link", { name: /추천 일자리 보기/ })
    .getAttribute("href");
  await page.goto(href!);

  // 0점 매칭 → "현재 매칭되는 일자리가 없습니다" 안내 박스
  await expect(page.getByText("현재 매칭되는 일자리가 없습니다")).toBeVisible();
});
