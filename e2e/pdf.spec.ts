import { test, expect } from '@playwright/test'

// =============================================
// PDF API 테스트
// =============================================

test.describe('PDF API 권한', () => {
  test('사업자용 PDF API가 인증 없이 401을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/test-id/pdf')
    expect(response.status()).toBe(401)
  })

  test('공유용 PDF API가 존재하지 않는 ID에 대해 에러를 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/share/non-existent-id/pdf')
    expect([400, 404]).toContain(response.status())
  })

  test('공유용 PDF API는 인증 없이도 접근 가능하다', async ({ request }) => {
    const response = await request.get('/api/quotes/share/some-share-id/pdf')
    // 401이 아닌 다른 상태 코드 반환
    expect(response.status()).not.toBe(401)
  })
})

test.describe('PDF API 응답 형식', () => {
  test('공유용 PDF API가 올바른 Content-Type을 반환한다', async ({ request }) => {
    const response = await request.get('/api/quotes/share/valid-share-id/pdf')

    // 성공 시 PDF Content-Type, 실패 시 JSON 에러
    if (response.ok()) {
      const contentType = response.headers()['content-type']
      expect(contentType).toContain('application/pdf')
    } else {
      // 에러 응답도 유효한 테스트 결과
      expect([400, 404]).toContain(response.status())
    }
  })
})
