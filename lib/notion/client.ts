// 노션 API 클라이언트 설정
// @notionhq/client 래퍼

import { Client } from "@notionhq/client"
import type { NotionClientConfig } from "@/types"

/**
 * 환경 변수에서 노션 API 키 가져오기
 * 단일 사용자/간단한 배포용
 */
export function getEnvNotionApiKey(): string | null {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey || apiKey === "여기에_노션_API_키_입력") {
    return null
  }
  return apiKey
}

/**
 * 환경 변수에서 노션 데이터베이스 ID 가져오기
 * 단일 사용자/간단한 배포용
 */
export function getEnvDatabaseId(): string | null {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId || databaseId === "여기에_데이터베이스_ID_입력") {
    return null
  }
  return databaseId
}

/**
 * 환경 변수 기반 기본 노션 클라이언트 생성
 * 환경 변수가 설정되지 않은 경우 null 반환
 */
export function getDefaultNotionClient(): Client | null {
  const apiKey = getEnvNotionApiKey()
  if (!apiKey) {
    return null
  }
  return getNotionClient(apiKey)
}

/**
 * 환경 변수가 설정되어 있는지 확인
 */
export function hasEnvNotionConfig(): boolean {
  return getEnvNotionApiKey() !== null && getEnvDatabaseId() !== null
}

/**
 * 노션 클라이언트 캐시
 * API 키별로 클라이언트 인스턴스를 캐시하여 재사용
 */
const clientCache = new Map<string, Client>()

/**
 * 노션 클라이언트 생성 또는 캐시에서 반환
 * @param apiKey - 노션 API 키 (Integration Token)
 * @returns Notion Client 인스턴스
 */
export function getNotionClient(apiKey: string): Client {
  // 캐시된 클라이언트 확인
  const cached = clientCache.get(apiKey)
  if (cached) {
    return cached
  }

  // 새 클라이언트 생성
  const client = new Client({
    auth: apiKey,
    // 타임아웃 설정 (기본 60초)
    timeoutMs: 60000,
  })

  // 캐시에 저장
  clientCache.set(apiKey, client)

  return client
}

/**
 * 캐시에서 클라이언트 제거
 * API 키 변경 시 호출
 * @param apiKey - 제거할 API 키
 */
export function clearClientCache(apiKey?: string): void {
  if (apiKey) {
    clientCache.delete(apiKey)
  } else {
    clientCache.clear()
  }
}

/**
 * 노션 클라이언트 설정으로 클라이언트 생성
 * @param config - 클라이언트 설정 (apiKey, databaseId)
 * @returns Notion Client 인스턴스
 */
export function createNotionClient(config: NotionClientConfig): Client {
  return getNotionClient(config.apiKey)
}

/**
 * API 키 유효성 검증
 * 간단한 형식 검사만 수행 (실제 유효성은 API 호출로 확인)
 * @param apiKey - 노션 API 키
 * @returns 유효한 형식인지 여부
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  // 노션 Internal Integration Token 형식: secret_xxx... 또는 ntn_xxx...
  // 최소 길이 체크
  if (!apiKey || apiKey.length < 20) {
    return false
  }

  // secret_ 또는 ntn_ 접두사 확인
  return apiKey.startsWith("secret_") || apiKey.startsWith("ntn_")
}

/**
 * 데이터베이스 ID 유효성 검증
 * UUID 형식 또는 노션 URL에서 추출한 ID 형식 확인
 * @param databaseId - 노션 데이터베이스 ID
 * @returns 유효한 형식인지 여부
 */
export function isValidDatabaseIdFormat(databaseId: string): boolean {
  if (!databaseId || databaseId.length < 32) {
    return false
  }

  // UUID 형식 (하이픈 포함/미포함)
  const uuidRegex =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

  return uuidRegex.test(databaseId)
}

/**
 * 노션 URL에서 데이터베이스 ID 추출
 * @param url - 노션 데이터베이스 URL
 * @returns 추출된 데이터베이스 ID 또는 null
 */
export function extractDatabaseIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)

    // notion.so 또는 notion.site 도메인 확인
    if (
      !urlObj.hostname.includes("notion.so") &&
      !urlObj.hostname.includes("notion.site")
    ) {
      return null
    }

    // URL 경로에서 ID 추출 (마지막 32자리 또는 UUID 형식)
    const pathParts = urlObj.pathname.split("/")
    const lastPart = pathParts[pathParts.length - 1]

    // ?v= 쿼리 파라미터 앞부분 추출
    const idPart = lastPart.split("?")[0]

    // 하이픈 제거 후 32자리 확인
    const cleanId = idPart.replace(/-/g, "")

    if (cleanId.length >= 32) {
      // 마지막 32자리 추출 (페이지 제목이 앞에 붙어있을 수 있음)
      return cleanId.slice(-32)
    }

    return null
  } catch {
    return null
  }
}

/**
 * 데이터베이스 ID를 표준 UUID 형식으로 변환
 * @param databaseId - 노션 데이터베이스 ID (하이픈 유무 무관)
 * @returns UUID 형식의 데이터베이스 ID
 */
export function formatDatabaseId(databaseId: string): string {
  // 하이픈 제거
  const clean = databaseId.replace(/-/g, "")

  if (clean.length !== 32) {
    return databaseId // 원본 반환
  }

  // UUID 형식으로 변환: 8-4-4-4-12
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`
}
