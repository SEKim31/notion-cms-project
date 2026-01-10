// 노션 데이터베이스 쿼리 함수
// 페이지네이션 및 Rate Limit 처리 포함

import type {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  GetPageResponse,
  GetDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { NotionSyncOptions } from "@/types"
import {
  getNotionClient,
  formatDatabaseId,
  getEnvNotionApiKey,
  getEnvDatabaseId,
  hasEnvNotionConfig,
} from "./client"
import { withRateLimitRetry, globalRateLimiter } from "./rate-limit"

/**
 * 데이터베이스 쿼리 결과 타입
 */
export interface DatabaseQueryResult {
  results: QueryDatabaseResponse["results"]
  hasMore: boolean
  nextCursor: string | null
  totalFetched: number
}

/**
 * 모든 페이지 조회 결과 타입
 */
export interface AllPagesResult {
  pages: QueryDatabaseResponse["results"]
  totalCount: number
}

/**
 * 노션 데이터베이스 쿼리 (단일 페이지)
 * @param apiKey - 노션 API 키
 * @param databaseId - 데이터베이스 ID
 * @param options - 쿼리 옵션
 * @returns 쿼리 결과
 */
export async function queryDatabase(
  apiKey: string,
  databaseId: string,
  options?: {
    startCursor?: string
    pageSize?: number
    filter?: QueryDatabaseParameters["filter"]
    sorts?: QueryDatabaseParameters["sorts"]
  }
): Promise<DatabaseQueryResult> {
  const client = getNotionClient(apiKey)
  const formattedDatabaseId = formatDatabaseId(databaseId)

  const response = await globalRateLimiter.execute(() =>
    withRateLimitRetry(() =>
      client.databases.query({
        database_id: formattedDatabaseId,
        start_cursor: options?.startCursor,
        page_size: options?.pageSize ?? 100,
        filter: options?.filter,
        sorts: options?.sorts,
      })
    )
  )

  return {
    results: response.results,
    hasMore: response.has_more,
    nextCursor: response.next_cursor ?? null,
    totalFetched: response.results.length,
  }
}

/**
 * 노션 데이터베이스의 모든 페이지 조회 (자동 페이지네이션)
 * @param apiKey - 노션 API 키
 * @param databaseId - 데이터베이스 ID
 * @param options - 동기화 옵션
 * @returns 모든 페이지 목록
 */
export async function queryAllPages(
  apiKey: string,
  databaseId: string,
  options?: NotionSyncOptions
): Promise<AllPagesResult> {
  const allPages: QueryDatabaseResponse["results"] = []
  let cursor: string | undefined = options?.startCursor
  let hasMore = true

  while (hasMore) {
    const result = await queryDatabase(apiKey, databaseId, {
      startCursor: cursor,
      pageSize: options?.pageSize ?? 100,
    })

    allPages.push(...result.results)
    hasMore = result.hasMore
    cursor = result.nextCursor ?? undefined

    // 진행 상황 로깅 (개발용)
    if (process.env.NODE_ENV === "development") {
      console.log(`노션 페이지 조회 중... (${allPages.length}개)`)
    }
  }

  return {
    pages: allPages,
    totalCount: allPages.length,
  }
}

/**
 * 노션 페이지 단건 조회
 * @param apiKey - 노션 API 키
 * @param pageId - 페이지 ID
 * @returns 페이지 정보
 */
export async function getPage(
  apiKey: string,
  pageId: string
): Promise<GetPageResponse> {
  const client = getNotionClient(apiKey)

  return globalRateLimiter.execute(() =>
    withRateLimitRetry(() => client.pages.retrieve({ page_id: pageId }))
  )
}

/**
 * 여러 노션 페이지 일괄 조회
 * @param apiKey - 노션 API 키
 * @param pageIds - 페이지 ID 목록
 * @returns 페이지 정보 목록 (조회 실패한 페이지는 제외)
 */
export async function getPages(
  apiKey: string,
  pageIds: string[]
): Promise<GetPageResponse[]> {
  if (pageIds.length === 0) return []

  const results: GetPageResponse[] = []

  // 순차적으로 조회 (Rate Limit 고려)
  for (const pageId of pageIds) {
    try {
      const page = await getPage(apiKey, pageId)
      results.push(page)
    } catch (error) {
      console.error(`페이지 조회 실패 (${pageId}):`, error)
      // 실패한 페이지는 건너뜀
    }
  }

  return results
}

/**
 * 노션 데이터베이스 정보 조회
 * @param apiKey - 노션 API 키
 * @param databaseId - 데이터베이스 ID
 * @returns 데이터베이스 정보
 */
export async function getDatabase(
  apiKey: string,
  databaseId: string
): Promise<GetDatabaseResponse> {
  const client = getNotionClient(apiKey)
  const formattedDatabaseId = formatDatabaseId(databaseId)

  return globalRateLimiter.execute(() =>
    withRateLimitRetry(() =>
      client.databases.retrieve({ database_id: formattedDatabaseId })
    )
  )
}

/**
 * 노션 연동 테스트
 * API 키와 데이터베이스 ID가 유효한지 확인
 * @param apiKey - 노션 API 키
 * @param databaseId - 데이터베이스 ID
 * @returns 테스트 결과
 */
export async function testConnection(
  apiKey: string,
  databaseId: string
): Promise<{
  success: boolean
  message: string
  databaseName?: string
  pageCount?: number
}> {
  try {
    // 데이터베이스 정보 조회
    const database = await getDatabase(apiKey, databaseId)

    // 데이터베이스 제목 추출
    const title =
      "title" in database
        ? (database.title as Array<{ plain_text: string }>)
            .map((t) => t.plain_text)
            .join("")
        : "Untitled"

    // 첫 페이지만 조회하여 페이지 수 확인
    const queryResult = await queryDatabase(apiKey, databaseId, {
      pageSize: 1,
    })

    return {
      success: true,
      message: "노션 연동 성공",
      databaseName: title,
      // 실제 전체 개수는 알 수 없으므로 hasMore 여부로 표시
      pageCount: queryResult.hasMore ? -1 : queryResult.totalFetched,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."

    return {
      success: false,
      message: `노션 연동 실패: ${message}`,
    }
  }
}

/**
 * 특정 날짜 이후 수정된 페이지만 조회
 * @param apiKey - 노션 API 키
 * @param databaseId - 데이터베이스 ID
 * @param lastSyncAt - 마지막 동기화 시간
 * @returns 수정된 페이지 목록
 */
export async function queryModifiedPages(
  apiKey: string,
  databaseId: string,
  lastSyncAt: Date
): Promise<AllPagesResult> {
  const allPages: QueryDatabaseResponse["results"] = []
  let cursor: string | undefined
  let hasMore = true

  while (hasMore) {
    const result = await queryDatabase(apiKey, databaseId, {
      startCursor: cursor,
      pageSize: 100,
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: {
          after: lastSyncAt.toISOString(),
        },
      },
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
    })

    allPages.push(...result.results)
    hasMore = result.hasMore
    cursor = result.nextCursor ?? undefined
  }

  return {
    pages: allPages,
    totalCount: allPages.length,
  }
}

/**
 * 페이지가 데이터베이스 페이지 타입인지 확인하는 타입 가드
 */
export function isDatabasePage(
  page: QueryDatabaseResponse["results"][number]
): page is Extract<
  QueryDatabaseResponse["results"][number],
  { object: "page"; properties: Record<string, unknown> }
> {
  return page.object === "page" && "properties" in page
}

// ============================================
// 환경 변수 기반 편의 함수 (단일 사용자용)
// ============================================

/**
 * 환경 변수 기반 노션 연동 테스트
 * .env.local에 설정된 API 키와 데이터베이스 ID 사용
 */
export async function testConnectionWithEnv(): Promise<{
  success: boolean
  message: string
  databaseName?: string
  pageCount?: number
}> {
  const apiKey = getEnvNotionApiKey()
  const databaseId = getEnvDatabaseId()

  if (!apiKey) {
    return {
      success: false,
      message: "환경 변수에 NOTION_API_KEY가 설정되지 않았습니다.",
    }
  }

  if (!databaseId) {
    return {
      success: false,
      message: "환경 변수에 NOTION_DATABASE_ID가 설정되지 않았습니다.",
    }
  }

  return testConnection(apiKey, databaseId)
}

/**
 * 환경 변수 기반 데이터베이스의 모든 페이지 조회
 */
export async function queryAllPagesWithEnv(
  options?: NotionSyncOptions
): Promise<AllPagesResult | null> {
  const apiKey = getEnvNotionApiKey()
  const databaseId = getEnvDatabaseId()

  if (!apiKey || !databaseId) {
    return null
  }

  return queryAllPages(apiKey, databaseId, options)
}

/**
 * 환경 변수 기반 데이터베이스 정보 조회
 */
export async function getDatabaseWithEnv(): Promise<GetDatabaseResponse | null> {
  const apiKey = getEnvNotionApiKey()
  const databaseId = getEnvDatabaseId()

  if (!apiKey || !databaseId) {
    return null
  }

  return getDatabase(apiKey, databaseId)
}

/**
 * 환경 변수가 설정되어 있는지 확인 (re-export)
 */
export { hasEnvNotionConfig }
