// 이메일 템플릿 관리
// 견적서 이메일 발송을 위한 HTML 템플릿 생성

/**
 * 견적서 이메일 데이터 타입
 */
export interface QuoteEmailData {
  // 견적서 정보
  quoteNumber: string
  issueDate: string
  validUntil?: string
  totalAmount: string // 포맷팅된 금액 문자열

  // 발신자(사업자) 정보
  companyName: string
  companyEmail?: string
  companyPhone?: string

  // 수신자(클라이언트) 정보
  clientName: string
  clientContact?: string

  // 공유 링크
  shareUrl: string

  // 추가 메시지 (선택)
  customMessage?: string
}

/**
 * 이메일 템플릿 옵션
 */
export interface EmailTemplateOptions {
  // 기본 스타일 색상 (선택)
  primaryColor?: string
  backgroundColor?: string
}

// 기본 색상 값
const DEFAULT_PRIMARY_COLOR = "#2563eb" // blue-600
const DEFAULT_BACKGROUND_COLOR = "#f8fafc" // slate-50

/**
 * 공통 이메일 스타일
 */
function getCommonStyles(options?: EmailTemplateOptions) {
  const primaryColor = options?.primaryColor || DEFAULT_PRIMARY_COLOR
  const backgroundColor = options?.backgroundColor || DEFAULT_BACKGROUND_COLOR

  return {
    container: `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background-color: ${backgroundColor};
      padding: 20px;
    `,
    card: `
      background-color: #ffffff;
      border-radius: 8px;
      padding: 32px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `,
    header: `
      text-align: center;
      margin-bottom: 32px;
    `,
    title: `
      color: #1e293b;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 8px 0;
    `,
    subtitle: `
      color: #64748b;
      font-size: 14px;
      margin: 0;
    `,
    section: `
      margin-bottom: 24px;
    `,
    sectionTitle: `
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    `,
    infoRow: `
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    `,
    infoLabel: `
      color: #64748b;
      font-size: 14px;
    `,
    infoValue: `
      color: #1e293b;
      font-size: 14px;
      font-weight: 500;
    `,
    totalAmount: `
      color: ${primaryColor};
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      margin: 24px 0;
    `,
    button: `
      display: inline-block;
      background-color: ${primaryColor};
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    `,
    buttonContainer: `
      text-align: center;
      margin: 32px 0;
    `,
    message: `
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 16px;
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    `,
    footer: `
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      padding: 20px;
    `,
    footerLink: `
      color: #64748b;
      text-decoration: none;
    `,
    primaryColor,
  }
}

/**
 * 견적서 발송 이메일 HTML 템플릿 생성
 *
 * @param data - 견적서 이메일 데이터
 * @param options - 템플릿 옵션 (선택)
 * @returns HTML 문자열
 */
export function generateQuoteEmailHtml(
  data: QuoteEmailData,
  options?: EmailTemplateOptions
): string {
  const styles = getCommonStyles(options)

  // 커스텀 메시지 섹션 (있는 경우에만)
  const customMessageSection = data.customMessage
    ? `<div style="${styles.message}">${escapeHtml(data.customMessage).replace(/\n/g, "<br>")}</div>`
    : ""

  // 유효기간 섹션 (있는 경우에만)
  const validUntilRow = data.validUntil
    ? `
      <tr>
        <td style="${styles.infoLabel}">유효기간</td>
        <td style="${styles.infoValue}">${escapeHtml(data.validUntil)}</td>
      </tr>
    `
    : ""

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>견적서 - ${escapeHtml(data.quoteNumber)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${styles.primaryColor}10;">
  <div style="${styles.container}">
    <!-- 메인 카드 -->
    <div style="${styles.card}">
      <!-- 헤더 -->
      <div style="${styles.header}">
        <h1 style="${styles.title}">견적서가 도착했습니다</h1>
        <p style="${styles.subtitle}">${escapeHtml(data.companyName)}에서 보낸 견적서입니다</p>
      </div>

      <!-- 커스텀 메시지 -->
      ${customMessageSection}

      <!-- 견적서 요약 정보 -->
      <div style="${styles.section}">
        <div style="${styles.sectionTitle}">견적서 정보</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="${styles.infoLabel}">견적번호</td>
            <td style="${styles.infoValue}">${escapeHtml(data.quoteNumber)}</td>
          </tr>
          <tr>
            <td style="${styles.infoLabel}">발행일</td>
            <td style="${styles.infoValue}">${escapeHtml(data.issueDate)}</td>
          </tr>
          ${validUntilRow}
          <tr>
            <td style="${styles.infoLabel}">수신</td>
            <td style="${styles.infoValue}">${escapeHtml(data.clientName)}${data.clientContact ? ` (${escapeHtml(data.clientContact)})` : ""}</td>
          </tr>
        </table>
      </div>

      <!-- 총 금액 -->
      <div style="${styles.section}">
        <div style="${styles.sectionTitle}">총 견적 금액</div>
        <div style="${styles.totalAmount}">${escapeHtml(data.totalAmount)}</div>
      </div>

      <!-- CTA 버튼 -->
      <div style="${styles.buttonContainer}">
        <a href="${escapeHtml(data.shareUrl)}" style="${styles.button}" target="_blank">
          견적서 상세 보기
        </a>
      </div>

      <!-- 안내 문구 -->
      <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0;">
        버튼을 클릭하면 웹에서 견적서 상세 내용을 확인하고<br>
        PDF로 다운로드 받으실 수 있습니다.
      </p>
    </div>

    <!-- 푸터 -->
    <div style="${styles.footer}">
      <p style="margin: 0 0 8px 0;">
        본 이메일은 ${escapeHtml(data.companyName)}에서 발송되었습니다.
      </p>
      ${
        data.companyEmail
          ? `<p style="margin: 0;">문의: <a href="mailto:${escapeHtml(data.companyEmail)}" style="${styles.footerLink}">${escapeHtml(data.companyEmail)}</a></p>`
          : ""
      }
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * 견적서 발송 이메일 텍스트 버전 생성
 * (HTML을 지원하지 않는 이메일 클라이언트용 폴백)
 *
 * @param data - 견적서 이메일 데이터
 * @returns 텍스트 문자열
 */
export function generateQuoteEmailText(data: QuoteEmailData): string {
  const lines = [
    `견적서가 도착했습니다`,
    ``,
    `${data.companyName}에서 보낸 견적서입니다.`,
    ``,
  ]

  if (data.customMessage) {
    lines.push(data.customMessage, ``)
  }

  lines.push(
    `[견적서 정보]`,
    `견적번호: ${data.quoteNumber}`,
    `발행일: ${data.issueDate}`
  )

  if (data.validUntil) {
    lines.push(`유효기간: ${data.validUntil}`)
  }

  lines.push(
    `수신: ${data.clientName}${data.clientContact ? ` (${data.clientContact})` : ""}`,
    ``,
    `[총 견적 금액]`,
    data.totalAmount,
    ``,
    `[견적서 상세 보기]`,
    data.shareUrl,
    ``,
    `위 링크를 클릭하시면 웹에서 견적서 상세 내용을 확인하고`,
    `PDF로 다운로드 받으실 수 있습니다.`,
    ``,
    `---`,
    `본 이메일은 ${data.companyName}에서 발송되었습니다.`
  )

  if (data.companyEmail) {
    lines.push(`문의: ${data.companyEmail}`)
  }

  return lines.join("\n")
}

/**
 * 이메일 제목 생성
 *
 * @param data - 견적서 이메일 데이터
 * @returns 이메일 제목 문자열
 */
export function generateQuoteEmailSubject(data: QuoteEmailData): string {
  return `[견적서] ${data.companyName} - ${data.quoteNumber}`
}

/**
 * HTML 특수문자 이스케이프
 * XSS 방지를 위해 사용자 입력값 처리
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}
