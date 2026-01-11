// 견적서 발송용 이메일 템플릿
// React Email 컴포넌트 기반

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components"

/**
 * 견적서 이메일 템플릿 Props
 */
export interface QuoteEmailTemplateProps {
  companyName: string // 발신자 회사명
  clientName: string // 수신자(클라이언트) 이름
  quoteNumber: string // 견적서 번호
  totalAmount: string // 총 금액 (포맷팅된 문자열)
  validUntil: string // 유효기간 (포맷팅된 문자열)
  shareUrl: string // 공유 링크 URL
  customMessage?: string // 추가 메시지 (선택)
}

/**
 * 견적서 발송 이메일 템플릿
 */
export function QuoteEmailTemplate({
  companyName,
  clientName,
  quoteNumber,
  totalAmount,
  validUntil,
  shareUrl,
  customMessage,
}: QuoteEmailTemplateProps) {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>
        {companyName}에서 견적서({quoteNumber})를 보내드립니다
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* 헤더 */}
          <Section style={styles.header}>
            <Text style={styles.companyName}>{companyName}</Text>
          </Section>

          <Hr style={styles.hr} />

          {/* 본문 */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              안녕하세요, {clientName}님.
            </Text>
            <Text style={styles.intro}>
              {companyName}에서 요청하신 견적서를 보내드립니다.
            </Text>

            {/* 추가 메시지 (있는 경우) */}
            {customMessage && (
              <Text style={styles.customMessage}>{customMessage}</Text>
            )}

            {/* 견적서 정보 카드 */}
            <Section style={styles.quoteCard}>
              <Text style={styles.quoteTitle}>견적서 정보</Text>
              <table style={styles.quoteTable}>
                <tbody>
                  <tr>
                    <td style={styles.quoteLabel}>견적서 번호</td>
                    <td style={styles.quoteValue}>{quoteNumber}</td>
                  </tr>
                  <tr>
                    <td style={styles.quoteLabel}>총 금액</td>
                    <td style={styles.quoteAmount}>{totalAmount}</td>
                  </tr>
                  <tr>
                    <td style={styles.quoteLabel}>유효기간</td>
                    <td style={styles.quoteValue}>{validUntil}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA 버튼 */}
            <Section style={styles.buttonSection}>
              <Button style={styles.button} href={shareUrl}>
                견적서 확인하기
              </Button>
            </Section>

            <Text style={styles.notice}>
              위 버튼을 클릭하시면 견적서 상세 내용을 확인하실 수 있으며,
              <br />
              PDF로 다운로드하실 수 있습니다.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* 푸터 */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              본 메일은 {companyName}에서 발송되었습니다.
            </Text>
            <Text style={styles.footerSubText}>
              문의사항이 있으시면 답장으로 연락해 주세요.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// 인라인 스타일 정의 (이메일 클라이언트 호환성)
const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
    margin: 0,
    padding: "40px 0",
  } as React.CSSProperties,

  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    margin: "0 auto",
    maxWidth: "600px",
    overflow: "hidden",
  } as React.CSSProperties,

  header: {
    backgroundColor: "#18181b",
    padding: "32px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  companyName: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  } as React.CSSProperties,

  hr: {
    borderColor: "#e4e4e7",
    borderTop: "1px solid #e4e4e7",
    margin: 0,
  } as React.CSSProperties,

  content: {
    padding: "40px",
  } as React.CSSProperties,

  greeting: {
    color: "#18181b",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 16px 0",
  } as React.CSSProperties,

  intro: {
    color: "#52525b",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 24px 0",
  } as React.CSSProperties,

  customMessage: {
    backgroundColor: "#f4f4f5",
    borderLeft: "4px solid #3b82f6",
    color: "#3f3f46",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 24px 0",
    padding: "16px",
  } as React.CSSProperties,

  quoteCard: {
    backgroundColor: "#fafafa",
    border: "1px solid #e4e4e7",
    borderRadius: "8px",
    margin: "0 0 24px 0",
    padding: "24px",
  } as React.CSSProperties,

  quoteTitle: {
    color: "#18181b",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 16px 0",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  quoteTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,

  quoteLabel: {
    color: "#71717a",
    fontSize: "14px",
    padding: "8px 0",
    width: "120px",
  } as React.CSSProperties,

  quoteValue: {
    color: "#18181b",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 0",
  } as React.CSSProperties,

  quoteAmount: {
    color: "#2563eb",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "8px 0",
  } as React.CSSProperties,

  buttonSection: {
    textAlign: "center" as const,
    margin: "32px 0",
  } as React.CSSProperties,

  button: {
    backgroundColor: "#18181b",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: "600",
    padding: "14px 32px",
    textDecoration: "none",
  } as React.CSSProperties,

  notice: {
    color: "#71717a",
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
    textAlign: "center" as const,
  } as React.CSSProperties,

  footer: {
    backgroundColor: "#fafafa",
    padding: "24px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  footerText: {
    color: "#71717a",
    fontSize: "13px",
    margin: "0 0 4px 0",
  } as React.CSSProperties,

  footerSubText: {
    color: "#a1a1aa",
    fontSize: "12px",
    margin: 0,
  } as React.CSSProperties,
}

export default QuoteEmailTemplate
