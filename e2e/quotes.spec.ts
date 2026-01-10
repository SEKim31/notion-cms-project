import { test, expect } from '@playwright/test'

// UI 테스트는 CI 환경에서만 실행 (로컬에서 브라우저 통신 문제 방지)
const isCI = !!process.env.CI

// =============================================
// 견적서 목록 페이지 UI 테스트 (비인증 상태)
// =============================================

test.describe('견적서 목록 페이지 접근 제어', () => {
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('비인증 상태에서 견적서 목록 페이지 접근 시 로그인으로 리디렉션', async ({ page }) => {
    await page.goto('/quotes', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되었는지 확인
    await page.waitForURL(/\/(login|signin)/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/(login|signin)/)
  })

  test('비인증 상태에서 견적서 상세 페이지 접근 시 로그인으로 리디렉션', async ({ page }) => {
    await page.goto('/quotes/some-quote-id', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되었는지 확인
    await page.waitForURL(/\/(login|signin)/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/(login|signin)/)
  })
})

// =============================================
// 홈 페이지 UI 테스트 (공개 페이지)
// =============================================

test.describe('홈 페이지', () => {
  test('홈 페이지가 정상적으로 렌더링된다', async ({ request }) => {
    // API 요청으로 홈페이지 접근 가능 여부 확인
    const response = await request.get('/')
    expect(response.status()).toBe(200)
  })

  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('로그인 버튼 클릭 시 로그인 페이지로 이동', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // 로그인 링크/버튼 클릭
    const loginButton = page.locator('a[href*="login"]').first()
    await loginButton.click()

    // 로그인 페이지로 이동했는지 확인
    await page.waitForURL(/\/login/, { timeout: 15000 })
    expect(page.url()).toContain('/login')
  })
})

// =============================================
// 견적서 API 테스트
// =============================================

test.describe('견적서 API', () => {
  test('견적서 목록 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes')
    expect(response.status()).toBe(401)
  })

  test('견적서 상세 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id')
    expect(response.status()).toBe(401)
  })

  test('공유 링크 생성 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/quotes/test-id/share')
    expect(response.status()).toBe(401)
  })

  test('PDF 다운로드 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id/pdf')
    expect(response.status()).toBe(401)
  })
})
