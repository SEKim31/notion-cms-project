// 노션 API 유틸리티 모듈
// 모든 노션 관련 함수 re-export

// 클라이언트 관련
export {
  getNotionClient,
  clearClientCache,
  createNotionClient,
  isValidApiKeyFormat,
  isValidDatabaseIdFormat,
  extractDatabaseIdFromUrl,
  formatDatabaseId,
} from "./client"

// 쿼리 함수
export {
  queryDatabase,
  queryAllPages,
  getPage,
  getPages,
  getDatabase,
  testConnection,
  queryModifiedPages,
  isDatabasePage,
  type DatabaseQueryResult,
  type AllPagesResult,
} from "./queries"

// Rate Limit 처리
export {
  RATE_LIMIT_CONFIG,
  NotionRateLimitError,
  NotionApiError,
  sleep,
  calculateBackoff,
  isRateLimitError,
  isRetryableError,
  getRetryAfter,
  withRateLimitRetry,
  NotionRateLimiter,
  globalRateLimiter,
} from "./rate-limit"

// 매퍼 함수
export {
  getTitle,
  getRichText,
  getNumber,
  getSelect,
  getDate,
  getCheckbox,
  getUrl,
  getEmail,
  getPhone,
  getRelation,
  mapNotionPageToQuote,
  mapNotionPagesToQuotes,
  mapNotionItemPageToQuoteItem,
  mapNotionItemPagesToQuoteItems,
  parseItemsFromText,
  parseItemsFromJson,
  propertyExtractor,
} from "./mapper"
