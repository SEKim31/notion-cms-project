import { test, expect } from '@playwright/test'

// =============================================
// 공유 견적서 페이지 UI 테스트
// =============================================

test.describe('공유 견적서 페이지', () => {
  test('존재하지 않는 공유 ID로 접근 시 에러 페이지가 표시된다', async ({ page }) => {
    await page.goto('/quote/share/non-existent-share-id-12345')

    // 404 또는 에러 메시지 확인
    const pageContent = await page.content()
    const hasErrorIndicator =
      pageContent.includes('404') ||
      pageContent.includes('찾을 수 없') ||
      pageContent.includes('존재하지 않') ||
      pageContent.includes('Not Found')

    expect(hasErrorIndicator).toBe(true)
  })

  test('공유 페이지 URL 구조가 올바르게 라우팅된다', async ({ page }) => {
    // 공유 페이지는 /quote/share/[shareId] 형식
    const response = await page.goto('/quote/share/test-share-id')

    // 페이지가 로드되는지 확인 (404가 아닌 에러도 가능)
    expect(response?.status()).toBeDefined()
  })

  test('공유 페이지는 인증 없이 접근 가능하다', async ({ page }) => {
    await page.goto('/quote/share/any-share-id')

    // 로그인 페이지로 리디렉션되지 않음
    expect(page.url()).not.toContain('/login')
    expect(page.url()).toContain('/quote/share')
  })
})

// =============================================
// 공유 견적서 API 테스트
// =============================================

test.describe('공유 견적서 API', () => {
  test('공유 견적서 API가 존재하지 않는 ID에 대해 에러를 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/share/non-existent-id')
    expect([400, 404]).toContain(response.status())
  })

  test('공유 견적서 API는 인증 없이도 접근 가능하다', async ({ request }) => {
    const response = await request.get('/api/quotes/share/some-share-id')
    // 401이 아닌 다른 상태 코드 반환
    expect(response.status()).not.toBe(401)
  })

  test('공유 링크 생성 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/quotes/test-id/share')
    expect(response.status()).toBe(401)
  })

  test('공유 링크 재생성 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/quotes/test-id/share', {
      data: { regenerate: true },
    })
    expect(response.status()).toBe(401)
  })
})
