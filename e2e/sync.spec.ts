import { test, expect } from '@playwright/test'

// UI 테스트는 CI 환경에서만 실행 (로컬에서 브라우저 통신 문제 방지)
const isCI = !!process.env.CI

// =============================================
// 동기화 API 테스트
// =============================================

test.describe('동기화 API', () => {
  test('동기화 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/sync')
    expect(response.status()).toBe(401)
  })

  test('동기화 API가 GET 요청을 허용하지 않는다', async ({ request }) => {
    const response = await request.get('/api/sync')
    expect([401, 405]).toContain(response.status())
  })
})

// =============================================
// 노션 설정 API 테스트
// =============================================

test.describe('노션 설정 API', () => {
  test('노션 설정 조회 API가 요청을 처리한다', async ({ request }) => {
    const response = await request.get('/api/settings/notion')
    expect([200, 401]).toContain(response.status())
  })

  test('노션 설정 저장 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/settings/notion', {
      data: { notionApiKey: 'test', notionDatabaseId: 'test' },
    })
    expect(response.status()).toBe(401)
  })

  test('노션 연동 테스트 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/settings/notion/test', {
      data: { notionApiKey: 'test', notionDatabaseId: 'test' },
    })
    expect(response.status()).toBe(401)
  })
})

// =============================================
// 설정 페이지 접근 제어 테스트
// =============================================

test.describe('설정 페이지 접근 제어', () => {
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('비인증 상태에서 설정 페이지 접근 시 로그인으로 리디렉션', async ({ page }) => {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되었는지 확인
    await page.waitForURL(/\/(login|signin)/, { timeout: 15000 })
    expect(page.url()).toMatch(/\/(login|signin)/)
  })
})
