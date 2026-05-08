import { test, expect } from "@playwright/test";
import { resetDB, countSeniors } from "./helpers/db";

test.beforeEach(async () => {
  await resetDB();
});

test("실패 시나리오: 이름 빈 채 제출 시 빨간 오류 박스, DB 저장 차단", async ({ page }) => {
  await page.goto("/register");

  // 이름 비움 (기본값 빈 문자열 유지)

  // 지역 선택
  await page.getByRole("combobox").filter({ hasText: "지역을 선택하세요" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  // 희망 직종 선택
  await page.getByRole("combobox").filter({ hasText: "직종을 선택하세요" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  // 경력 입력
  await page.locator("#career_years").fill("3");

  // 폼 제출
  await page.getByRole("button", { name: "등록하기" }).click();

  // 이름 필드 위 빨간 안내 박스 노출
  await expect(page.getByText("이름을 입력해 주세요")).toBeVisible();

  // 성공 메시지 없음
  await expect(page.getByText("등록이 완료되었습니다")).not.toBeVisible();

  // DB에 새 레코드가 삽입되지 않음
  const count = await countSeniors();
  expect(count).toBe(0);
});
