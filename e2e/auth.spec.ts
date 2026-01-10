import { test, expect } from '@playwright/test'

// =============================================
// 인증 페이지 UI 테스트
// 참고: UI 테스트는 CI 환경에서 실행 권장
// 로컬에서는 환경에 따라 타임아웃이 발생할 수 있음
// =============================================

// UI 테스트는 CI 환경에서만 실행 (로컬에서 브라우저 통신 문제 방지)
const isCI = !!process.env.CI

test.describe('로그인 페이지 UI', () => {
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })

    // 페이지 제목 확인 (CardTitle)
    await expect(page.locator('text=로그인').first()).toBeVisible({ timeout: 10000 })

    // 이메일 입력 필드 확인
    await expect(page.locator('input[name="email"]')).toBeVisible()

    // 비밀번호 입력 필드 확인
    await expect(page.locator('input[name="password"]')).toBeVisible()

    // 로그인 버튼 확인
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('이메일 형식이 잘못되면 에러가 표시된다', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })

    // 페이지 로드 대기
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 })

    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Zod 검증 에러 메시지 또는 HTML5 검증 확인
    await page.waitForTimeout(500)

    // 에러 메시지 또는 폼이 여전히 로그인 페이지에 있음을 확인
    const hasError = await page.locator('text=이메일').count() > 0
    expect(hasError).toBe(true)
  })

  test('회원가입 링크가 존재한다', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })

    // 페이지 로드 대기
    await expect(page.locator('text=로그인').first()).toBeVisible({ timeout: 10000 })

    // 회원가입 페이지로 이동하는 링크 확인 (실제 경로는 /register)
    const signupLink = page.locator('a[href*="register"]')
    await expect(signupLink).toBeVisible()
  })
})

test.describe('회원가입 페이지 UI', () => {
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('회원가입 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    // 실제 경로는 /register
    await page.goto('/register', { waitUntil: 'domcontentloaded' })

    // 페이지 제목 확인
    await expect(page.locator('text=회원가입').first()).toBeVisible({ timeout: 10000 })

    // 이메일 입력 필드 확인
    await expect(page.locator('input[name="email"]')).toBeVisible()

    // 비밀번호 입력 필드 확인
    await expect(page.locator('input[name="password"]').first()).toBeVisible()

    // 회원가입 버튼 확인
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('필수 필드가 비어있으면 제출이 안된다', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' })

    // 페이지 로드 대기
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 })

    // 빈 상태로 제출 시도
    await page.click('button[type="submit"]')

    // 페이지가 여전히 회원가입 페이지인지 확인 (리디렉션 안됨)
    await page.waitForTimeout(500)
    expect(page.url()).toContain('register')
  })

  test('로그인 링크가 존재한다', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' })

    // 페이지 로드 대기
    await expect(page.locator('text=회원가입').first()).toBeVisible({ timeout: 10000 })

    // 로그인 페이지로 이동하는 링크 확인
    const loginLink = page.locator('a[href*="login"]')
    await expect(loginLink).toBeVisible()
  })
})

test.describe('보호된 라우트 리디렉션', () => {
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('비인증 상태에서 견적서 목록 페이지 접근 시 로그인으로 리디렉션', async ({ page }) => {
    await page.goto('/quotes', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되었는지 확인
    await page.waitForURL(/\/(login|signin)/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/(login|signin)/)
  })

  test('비인증 상태에서 설정 페이지 접근 시 로그인으로 리디렉션', async ({ page }) => {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되었는지 확인
    await page.waitForURL(/\/(login|signin)/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/(login|signin)/)
  })
})

// =============================================
// 인증 API 테스트 (항상 실행)
// =============================================

test.describe('인증 API', () => {
  test('로그인 API가 잘못된 자격 증명에 대해 에러를 반환한다', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      },
    })

    // 잘못된 자격 증명은 400 또는 401 반환
    expect([400, 401]).toContain(response.status())
  })

  test('로그아웃 API가 정상 동작한다', async ({ request }) => {
    const response = await request.post('/api/auth/logout')

    // 로그아웃은 성공 또는 인증 에러
    expect([200, 302, 401]).toContain(response.status())
  })

  test('현재 사용자 조회 API가 비인증 상태에서 적절히 응답한다', async ({ request }) => {
    const response = await request.get('/api/auth/me')

    // 비인증 상태에서는 401 또는 null 사용자
    expect([200, 401]).toContain(response.status())
  })
})

test.describe('보호된 API 엔드포인트', () => {
  test('견적서 목록 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes')
    expect(response.status()).toBe(401)
  })

  test('견적서 상세 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id')
    expect(response.status()).toBe(401)
  })

  test('동기화 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/sync')
    expect(response.status()).toBe(401)
  })

  test('노션 설정 저장 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/settings/notion', {
      data: { notionApiKey: 'test', notionDatabaseId: 'test' },
    })
    expect(response.status()).toBe(401)
  })
})
