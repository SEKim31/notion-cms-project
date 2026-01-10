import { Page, expect } from '@playwright/test'

/**
 * 테스트용 사용자 계정 정보
 */
export const TEST_USER = {
  email: 'test@example.com',
  password: 'Test1234!',
  companyName: '테스트 회사',
}

/**
 * 로그인 헬퍼 함수
 */
export async function login(page: Page, email?: string, password?: string) {
  await page.goto('/login')
  await page.fill('input[name="email"]', email ?? TEST_USER.email)
  await page.fill('input[name="password"]', password ?? TEST_USER.password)
  await page.click('button[type="submit"]')
}

/**
 * 로그인 상태 확인
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // 대시보드 또는 견적서 목록 페이지로 이동 가능한지 확인
    const response = await page.goto('/dashboard')
    return response?.status() === 200
  } catch {
    return false
  }
}

/**
 * 로그아웃 헬퍼 함수
 */
export async function logout(page: Page) {
  // 사용자 메뉴 클릭하여 로그아웃
  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="logout-button"]')
}

/**
 * 페이지 로딩 대기
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

/**
 * 토스트 메시지 확인
 */
export async function expectToast(page: Page, message: string) {
  const toast = page.locator('[data-sonner-toast]')
  await expect(toast).toContainText(message)
}

/**
 * API 응답 대기
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse((response) => {
    if (typeof urlPattern === 'string') {
      return response.url().includes(urlPattern)
    }
    return urlPattern.test(response.url())
  })
}

/**
 * 견적서 목록 페이지로 이동
 */
export async function goToQuotesList(page: Page) {
  await page.goto('/quotes')
  await waitForPageLoad(page)
}

/**
 * 견적서 상세 페이지로 이동
 */
export async function goToQuoteDetail(page: Page, quoteId: string) {
  await page.goto(`/quotes/${quoteId}`)
  await waitForPageLoad(page)
}

/**
 * 공유 페이지로 이동
 */
export async function goToSharedQuote(page: Page, shareId: string) {
  await page.goto(`/quote/share/${shareId}`)
  await waitForPageLoad(page)
}

/**
 * 설정 페이지로 이동
 */
export async function goToSettings(page: Page) {
  await page.goto('/settings')
  await waitForPageLoad(page)
}

/**
 * 폼 필드 에러 메시지 확인
 */
export async function expectFieldError(page: Page, fieldName: string, errorMessage: string) {
  const errorElement = page.locator(`[data-field="${fieldName}"] .error-message, #${fieldName}-error`)
  await expect(errorElement).toContainText(errorMessage)
}

/**
 * 버튼 클릭 후 로딩 상태 확인
 */
export async function clickAndWaitForLoading(page: Page, selector: string) {
  const button = page.locator(selector)
  await button.click()

  // 로딩 상태 확인 (disabled 또는 loading 클래스)
  await expect(button).toBeDisabled()

  // 로딩 완료 대기
  await expect(button).toBeEnabled({ timeout: 10000 })
}

/**
 * 테이블 행 수 확인
 */
export async function expectTableRows(page: Page, selector: string, minCount: number) {
  const rows = page.locator(`${selector} tbody tr`)
  await expect(rows).toHaveCount(minCount, { timeout: 10000 })
}

/**
 * 다운로드 대기 및 확인
 */
export async function waitForDownload(page: Page, triggerSelector: string) {
  const downloadPromise = page.waitForEvent('download')
  await page.click(triggerSelector)
  const download = await downloadPromise
  return download
}

/**
 * 클립보드 복사 확인 (실제 클립보드 접근이 제한될 수 있음)
 */
export async function expectClipboardCopy(page: Page, buttonSelector: string) {
  await page.click(buttonSelector)
  // 복사 성공 토스트 확인
  await expectToast(page, '복사')
}
