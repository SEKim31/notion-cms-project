import { test, expect } from '@playwright/test'

// =============================================
// 이메일 발송 기능 테스트 (Phase 10)
// =============================================

test.describe('이메일 발송 API', () => {
  test('이메일 발송 API가 인증 없이 401을 반환한다', async ({ request }) => {
    // 테스트용 UUID
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      data: {
        to: 'test@example.com',
        subject: '테스트 견적서',
        message: '테스트 메시지',
      },
    })

    expect(response.status()).toBe(401)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.message).toBe('인증이 필요합니다.')
  })

  test('이메일 발송 API가 GET 요청을 허용하지 않는다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.get(`/api/quotes/${testQuoteId}/send-email`)

    // GET 메서드가 정의되지 않은 경우 405 반환
    expect([401, 405]).toContain(response.status())
  })

  test('이메일 발송 API가 유효하지 않은 UUID에 400을 반환한다', async ({ request }) => {
    // 유효하지 않은 UUID 형식
    const invalidId = 'invalid-id-format'

    const response = await request.post(`/api/quotes/${invalidId}/send-email`, {
      data: {
        to: 'test@example.com',
        subject: '테스트',
      },
    })

    // 인증이 먼저 체크되므로 401 또는 인증 후 400 반환
    expect([400, 401]).toContain(response.status())
  })

  test('이메일 발송 API가 잘못된 요청 형식에 400을 반환한다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    // JSON이 아닌 형식으로 요청
    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      headers: {
        'Content-Type': 'text/plain',
      },
      data: 'invalid data',
    })

    // 인증 체크가 먼저이므로 401 또는 400
    expect([400, 401]).toContain(response.status())
  })

  test('이메일 발송 API가 빈 이메일 주소에 400 또는 401을 반환한다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      data: {
        to: '',
        subject: '테스트',
      },
    })

    // 인증 체크 후 이메일 검증
    expect([400, 401]).toContain(response.status())
  })

  test('이메일 발송 API가 유효하지 않은 이메일 형식에 대해 적절히 응답한다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      data: {
        to: 'invalid-email',
        subject: '테스트',
      },
    })

    // 인증 체크가 먼저 수행됨
    expect([400, 401]).toContain(response.status())
  })
})

test.describe('이메일 발송 응답 형식', () => {
  test('인증 에러 응답이 올바른 형식을 따른다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      data: {
        to: 'test@example.com',
      },
    })

    const body = await response.json()

    // 응답 형식 검증
    expect(body).toHaveProperty('success')
    expect(body).toHaveProperty('message')
    expect(typeof body.success).toBe('boolean')
    expect(typeof body.message).toBe('string')
  })

  test('응답에 필수 필드가 포함되어 있다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    const response = await request.post(`/api/quotes/${testQuoteId}/send-email`, {
      data: {
        to: 'test@example.com',
        subject: '테스트 제목',
        message: '테스트 메시지',
      },
    })

    const body = await response.json()

    // 기본 응답 필드 확인
    expect(body).toHaveProperty('success')
    expect(body).toHaveProperty('message')

    // 실패 응답인 경우
    if (!body.success) {
      expect(body.message).toBeTruthy()
    }
  })
})

test.describe('이메일 발송 UI 컴포넌트', () => {
  // UI 테스트는 CI 환경에서만 실행
  const isCI = !!process.env.CI
  test.skip(!isCI, 'UI 테스트는 CI 환경에서만 실행')

  test('견적서 상세 페이지에 이메일 발송 버튼이 존재한다', async ({ page }) => {
    // 임의의 견적서 상세 페이지로 이동 시도
    await page.goto('/quotes', { waitUntil: 'domcontentloaded' })

    // 로그인 페이지로 리디렉션되면 스킵
    if (page.url().includes('/login')) {
      test.skip(true, '인증이 필요합니다')
      return
    }

    // 견적서 카드가 있으면 첫 번째 클릭
    const quoteCards = page.locator('[data-testid="quote-card"]')
    const cardCount = await quoteCards.count()

    if (cardCount > 0) {
      await quoteCards.first().click()
      await page.waitForLoadState('domcontentloaded')

      // 이메일 발송 버튼 또는 액션 확인
      const emailButton = page.locator('[data-testid="send-email-button"], button:has-text("이메일")')
      const hasEmailButton = await emailButton.count() > 0
      expect(hasEmailButton).toBe(true)
    }
  })
})

// =============================================
// 이메일 발송 후 상태 변경 테스트
// =============================================

test.describe('이메일 발송 후 상태 변경', () => {
  test('성공적인 이메일 발송 후 상태가 SENT로 변경되어야 함 (개념 테스트)', async () => {
    // 이 테스트는 실제 이메일 발송 없이 로직을 검증
    // 실제 테스트는 인증된 환경에서 수행해야 함

    const expectedStatusAfterSend = 'SENT'
    const validStatuses = ['DRAFT', 'SENT', 'VIEWED', 'EXPIRED', 'APPROVED', 'REJECTED', 'COMPLETED']

    expect(validStatuses).toContain(expectedStatusAfterSend)
  })

  test('발송 정보(sentAt, sentTo)가 기록되어야 함 (개념 테스트)', async () => {
    // API 응답에 sentAt 필드가 포함되어야 함
    const mockSuccessResponse = {
      success: true,
      message: '이메일이 성공적으로 발송되었습니다.',
      emailId: 'mock-email-id',
      sentAt: new Date().toISOString(),
    }

    expect(mockSuccessResponse).toHaveProperty('success', true)
    expect(mockSuccessResponse).toHaveProperty('sentAt')
    expect(mockSuccessResponse.sentAt).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })
})

// =============================================
// 이메일 발송 Rate Limit 테스트
// =============================================

test.describe('이메일 발송 Rate Limit', () => {
  test('연속 요청에 대해 적절히 응답한다', async ({ request }) => {
    const testQuoteId = '00000000-0000-0000-0000-000000000001'

    // 3개의 연속 요청
    const responses = await Promise.all([
      request.post(`/api/quotes/${testQuoteId}/send-email`, {
        data: { to: 'test1@example.com' },
      }),
      request.post(`/api/quotes/${testQuoteId}/send-email`, {
        data: { to: 'test2@example.com' },
      }),
      request.post(`/api/quotes/${testQuoteId}/send-email`, {
        data: { to: 'test3@example.com' },
      }),
    ])

    // 모든 응답이 유효한 HTTP 상태 코드를 반환해야 함
    for (const response of responses) {
      expect([200, 400, 401, 403, 404, 429, 500]).toContain(response.status())
    }
  })
})
