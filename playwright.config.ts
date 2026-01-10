import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: './e2e',

  // 병렬 테스트 실행 비활성화 (개발 서버 안정성)
  fullyParallel: false,

  // CI에서 retry 실패 방지
  forbidOnly: !!process.env.CI,

  // 재시도 횟수 (CI에서는 2번, 로컬에서는 1번)
  retries: process.env.CI ? 2 : 1,

  // 병렬 워커 수 (1개로 제한하여 서버 안정성 확보)
  workers: 1,

  // 테스트 타임아웃 증가 (90초)
  timeout: 90000,

  // expect 타임아웃 설정
  expect: {
    timeout: 10000,
  },

  // 테스트 결과 리포터
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  // 공통 설정
  use: {
    // 기본 URL (127.0.0.1 사용으로 IPv6 문제 방지)
    baseURL: 'http://127.0.0.1:3000',

    // 네비게이션 타임아웃 증가
    navigationTimeout: 30000,

    // 액션 타임아웃
    actionTimeout: 15000,

    // 실패 시 스크린샷 촬영
    screenshot: 'only-on-failure',

    // 실패 시 트레이스 수집
    trace: 'on-first-retry',

    // 비디오 녹화 비활성화
    video: 'off',
  },

  // 프로젝트 설정 (브라우저별)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 개발 서버 자동 시작
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240 * 1000, // 서버 시작 타임아웃 4분
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
