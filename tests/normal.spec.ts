import { test, expect } from "@playwright/test";
import { resetDB, insertJob } from "./helpers/db";

test.beforeEach(async () => {
  await resetDB();
  // 사전 조건: 서울 / 경비 / 요구 경력 3년 공고 1건
  await insertJob({
    title: "서울 아파트 경비원 모집",
    region: "서울",
    job_type: "경비",
    required_career: 3,
  });
});

test("정상 시나리오: 시니어 등록 후 6점 금색 배지 카드 표시", async ({ page }) => {
  await page.goto("/register");

  // 이름 입력
  await page.locator("#name").fill("테스트시니어");

  // 지역 선택 (shadcn Select → Radix UI combobox)
  await page.getByRole("combobox").filter({ hasText: "지역을 선택하세요" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  // 희망 직종 선택
  await page.getByRole("combobox").filter({ hasText: "직종을 선택하세요" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  // 경력 입력 (기본값 0 → 5 로 덮어씀)
  await page.locator("#career_years").fill("5");

  // 폼 제출
  await page.getByRole("button", { name: "등록하기" }).click();

  // 성공 메시지 확인
  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible();

  // 추천 링크 href 추출
  const link = page.getByRole("link", { name: /추천 일자리 보기/ });
  await expect(link).toBeVisible();
  const href = await link.getAttribute("href");
  expect(href).toContain("/recommendations?senior_id=");

  // 추천 페이지 이동
  await page.goto(href!);

  // 6점 금색 배지(⭐ 6점) 카드가 최상단에 노출
  await expect(page.getByText(/⭐.*6점/)).toBeVisible();
});
