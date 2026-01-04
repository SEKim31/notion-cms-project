// 견적서 PDF 문서 컴포넌트
import { Document, Page, Text, View } from "@react-pdf/renderer"

import { registerFonts } from "./fonts"
import { styles } from "./styles"
import type { Quote, QuoteItem } from "@/types/database"

// 폰트 등록
registerFonts()

// Props 타입
interface QuoteDocumentProps {
  quote: Quote
  companyName: string
}

/**
 * 금액 포맷팅 (원화)
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원"
}

/**
 * 날짜 포맷팅
 */
function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 견적서 헤더 컴포넌트
 */
function QuoteHeader({
  quote,
  companyName,
}: {
  quote: Quote
  companyName: string
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>견 적 서</Text>
      <View style={styles.headerInfo}>
        <Text style={styles.headerInfoItem}>견적번호: {quote.quoteNumber}</Text>
        <Text style={styles.headerInfoItem}>
          발행일: {formatDate(quote.issueDate)}
        </Text>
      </View>
      <View style={styles.companySection}>
        <Text style={styles.companyLabel}>발행처</Text>
        <Text style={styles.companyName}>{companyName}</Text>
      </View>
    </View>
  )
}

/**
 * 클라이언트 정보 컴포넌트
 */
function ClientInfo({ quote }: { quote: Quote }) {
  return (
    <View style={styles.clientSection}>
      <Text style={styles.sectionTitle}>수신처 정보</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>회사명</Text>
        <Text style={styles.infoValue}>{quote.clientName}</Text>
      </View>
      {quote.clientContact && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>담당자</Text>
          <Text style={styles.infoValue}>{quote.clientContact}</Text>
        </View>
      )}
      {quote.clientPhone && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>연락처</Text>
          <Text style={styles.infoValue}>{quote.clientPhone}</Text>
        </View>
      )}
      {quote.clientEmail && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이메일</Text>
          <Text style={styles.infoValue}>{quote.clientEmail}</Text>
        </View>
      )}
      {quote.validUntil && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>유효기간</Text>
          <Text style={styles.infoValue}>{formatDate(quote.validUntil)}</Text>
        </View>
      )}
    </View>
  )
}

/**
 * 품목 테이블 헤더
 */
function TableHeader() {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, styles.colNo]}>No.</Text>
      <Text style={[styles.tableHeaderCell, styles.colName]}>품목명</Text>
      <Text style={[styles.tableHeaderCell, styles.colQty]}>수량</Text>
      <Text style={[styles.tableHeaderCell, styles.colPrice]}>단가</Text>
      <Text style={[styles.tableHeaderCell, styles.colAmount]}>금액</Text>
    </View>
  )
}

/**
 * 품목 테이블 행
 */
function TableRow({
  item,
  index,
  isAlt,
}: {
  item: QuoteItem
  index: number
  isAlt: boolean
}) {
  return (
    <View style={isAlt ? styles.tableRowAlt : styles.tableRow}>
      <Text style={[styles.tableCell, styles.colNo]}>{index + 1}</Text>
      <Text style={[styles.tableCell, styles.colName]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.colQty]}>
        {item.quantity.toLocaleString()}
      </Text>
      <Text style={[styles.tableCell, styles.colPrice]}>
        {formatCurrency(item.unitPrice)}
      </Text>
      <Text style={[styles.tableCell, styles.colAmount]}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  )
}

/**
 * 품목 테이블 컴포넌트
 */
function ItemsTable({ items }: { items: QuoteItem[] }) {
  return (
    <View style={styles.table}>
      <Text style={styles.sectionTitle}>품목 내역</Text>
      <TableHeader />
      {items.map((item, index) => (
        <TableRow
          key={index}
          item={item}
          index={index}
          isAlt={index % 2 === 1}
        />
      ))}
    </View>
  )
}

/**
 * 합계 섹션 컴포넌트
 */
function TotalSection({ totalAmount }: { totalAmount: number }) {
  // 부가세 계산 (10%)
  const vat = Math.round(totalAmount * 0.1)
  const grandTotal = totalAmount + vat

  return (
    <View style={styles.totalSection}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>공급가액</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>부가세 (10%)</Text>
        <Text style={styles.totalValue}>{formatCurrency(vat)}</Text>
      </View>
      <View style={styles.grandTotalRow}>
        <Text style={styles.grandTotalLabel}>총 합계</Text>
        <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
      </View>
    </View>
  )
}

/**
 * 비고 섹션 컴포넌트
 */
function NotesSection({ notes }: { notes: string | null | undefined }) {
  if (!notes) return null

  return (
    <View style={styles.notesSection}>
      <Text style={styles.notesTitle}>비고</Text>
      <Text style={styles.notesText}>{notes}</Text>
    </View>
  )
}

/**
 * 푸터 컴포넌트
 */
function Footer({ companyName }: { companyName: string }) {
  return (
    <View style={styles.footer}>
      <Text>
        본 견적서는 {companyName}에서 발행되었습니다. | 문의사항은 발행처로
        연락해 주세요.
      </Text>
    </View>
  )
}

/**
 * 견적서 PDF 문서 컴포넌트
 */
export function QuoteDocument({ quote, companyName }: QuoteDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <QuoteHeader quote={quote} companyName={companyName} />
        <ClientInfo quote={quote} />
        <ItemsTable items={quote.items} />
        <TotalSection totalAmount={quote.totalAmount} />
        <NotesSection notes={quote.notes} />
        <Footer companyName={companyName} />
      </Page>
    </Document>
  )
}
