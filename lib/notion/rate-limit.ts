// 노션 API Rate Limit 처리
// 초당 3 requests 제한 대응

import { APIErrorCode, APIResponseError, isNotionClientError } from "@notionhq/client"

/**
 * Rate Limit 설정
 */
export const RATE_LIMIT_CONFIG = {
  // 노션 API Rate Limit: 초당 3 requests
  REQUESTS_PER_SECOND: 3,
  // 요청 간 최소 간격 (ms)
  MIN_REQUEST_INTERVAL: 334, // 1000ms / 3
  // 최대 재시도 횟수
  MAX_RETRIES: 5,
  // 기본 재시도 대기 시간 (ms)
  BASE_RETRY_DELAY: 1000,
  // 최대 재시도 대기 시간 (ms)
  MAX_RETRY_DELAY: 32000,
} as const

/**
 * Rate Limit 에러 타입
 */
export class NotionRateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message)
    this.name = "NotionRateLimitError"
  }
}

/**
 * 노션 API 에러 타입
 */
export class NotionApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = "NotionApiError"
  }
}

/**
 * 지정된 시간만큼 대기
 * @param ms - 대기 시간 (밀리초)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Exponential Backoff 계산
 * @param attempt - 현재 시도 횟수 (0부터 시작)
 * @param baseDelay - 기본 대기 시간
 * @param maxDelay - 최대 대기 시간
 * @returns 대기 시간 (ms)
 */
export function calculateBackoff(
  attempt: number,
  baseDelay: number = RATE_LIMIT_CONFIG.BASE_RETRY_DELAY,
  maxDelay: number = RATE_LIMIT_CONFIG.MAX_RETRY_DELAY
): number {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * 0.3 * exponentialDelay // 0-30% jitter
  const delay = Math.min(exponentialDelay + jitter, maxDelay)
  return Math.floor(delay)
}

/**
 * 노션 API 에러가 Rate Limit 에러인지 확인
 * @param error - 에러 객체
 * @returns Rate Limit 에러 여부
 */
export function isRateLimitError(error: unknown): boolean {
  if (isNotionClientError(error)) {
    if (error instanceof APIResponseError) {
      return error.code === APIErrorCode.RateLimited
    }
  }
  return false
}

/**
 * 노션 API 에러가 재시도 가능한 에러인지 확인
 * @param error - 에러 객체
 * @returns 재시도 가능 여부
 */
export function isRetryableError(error: unknown): boolean {
  if (isNotionClientError(error)) {
    if (error instanceof APIResponseError) {
      // Rate Limit, 서버 에러, 서비스 불가 시 재시도
      return (
        error.code === APIErrorCode.RateLimited ||
        error.code === APIErrorCode.InternalServerError ||
        error.code === APIErrorCode.ServiceUnavailable
      )
    }
  }
  return false
}

/**
 * Retry-After 헤더 값 추출
 * @param error - 에러 객체
 * @returns Retry-After 시간 (초) 또는 undefined
 */
export function getRetryAfter(error: unknown): number | undefined {
  if (isNotionClientError(error) && error instanceof APIResponseError) {
    // 노션 API는 Retry-After 헤더를 제공하지 않을 수 있음
    // 기본적으로 1초 후 재시도
    return 1
  }
  return undefined
}

/**
 * Rate Limit을 고려한 API 호출 래퍼
 * Exponential Backoff로 자동 재시도
 * @param fn - 실행할 비동기 함수
 * @param maxRetries - 최대 재시도 횟수
 * @returns 함수 실행 결과
 */
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = RATE_LIMIT_CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // 재시도 불가능한 에러면 즉시 throw
      if (!isRetryableError(error)) {
        throw error
      }

      // 마지막 시도였으면 에러 throw
      if (attempt === maxRetries) {
        throw new NotionRateLimitError(
          `노션 API 호출 실패 (${maxRetries}회 재시도 후): ${error instanceof Error ? error.message : String(error)}`
        )
      }

      // Rate Limit 에러면 Retry-After 또는 backoff 대기
      const retryAfter = getRetryAfter(error)
      const delay = retryAfter
        ? retryAfter * 1000
        : calculateBackoff(attempt)

      console.warn(
        `노션 API Rate Limit 감지. ${delay}ms 후 재시도 (${attempt + 1}/${maxRetries})`
      )

      await sleep(delay)
    }
  }

  // 이 코드에 도달하면 안 됨
  throw lastError
}

/**
 * 요청 큐를 사용한 Rate Limiter 클래스
 * 초당 3 requests 제한 준수
 */
export class NotionRateLimiter {
  private lastRequestTime: number = 0
  private requestQueue: Array<() => void> = []
  private isProcessing: boolean = false

  /**
   * Rate Limit을 준수하며 요청 실행
   * @param fn - 실행할 비동기 함수
   * @returns 함수 실행 결과
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await withRateLimitRetry(fn)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  /**
   * 요청 큐 처리
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.requestQueue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime
      const waitTime = Math.max(
        0,
        RATE_LIMIT_CONFIG.MIN_REQUEST_INTERVAL - timeSinceLastRequest
      )

      if (waitTime > 0) {
        await sleep(waitTime)
      }

      const request = this.requestQueue.shift()
      if (request) {
        this.lastRequestTime = Date.now()
        await request()
      }
    }

    this.isProcessing = false
  }

  /**
   * 큐 초기화
   */
  clear(): void {
    this.requestQueue = []
  }
}

// 전역 Rate Limiter 인스턴스
export const globalRateLimiter = new NotionRateLimiter()
