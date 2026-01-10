import { test, expect } from '@playwright/test'

test.describe('견적서 상세 API', () => {
  test('견적서 상세 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id')
    expect(response.status()).toBe(401)
  })

  test('견적서 PDF API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id/pdf')
    expect(response.status()).toBe(401)
  })

  test('공유 링크 생성 API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.post('/api/quotes/test-id/share')
    expect(response.status()).toBe(401)
  })
})

test.describe('공유 견적서 페이지', () => {
  test('존재하지 않는 공유 ID로 접근 시 404 페이지가 표시된다', async ({ page }) => {
    await page.goto('/quote/share/non-existent-share-id-12345')

    // 404 또는 에러 메시지 확인
    const pageContent = await page.content()
    const hasErrorIndicator =
      pageContent.includes('404') ||
      pageContent.includes('찾을 수 없') ||
      pageContent.includes('존재하지 않')

    expect(hasErrorIndicator).toBe(true)
  })
})
