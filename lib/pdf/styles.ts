// PDF 스타일 정의
import { StyleSheet } from "@react-pdf/renderer"
import { FONT_FAMILY } from "./fonts"

// 공통 색상
const colors = {
  primary: "#1a1a1a",
  secondary: "#666666",
  border: "#e5e5e5",
  background: "#f5f5f5",
  white: "#ffffff",
}

// PDF 스타일시트
export const styles = StyleSheet.create({
  // 페이지 레이아웃
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
    color: colors.primary,
  },

  // 헤더 섹션
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  headerInfoItem: {
    fontSize: 10,
    color: colors.secondary,
  },

  // 회사 정보 섹션
  companySection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyLabel: {
    fontSize: 9,
    color: colors.secondary,
    marginBottom: 2,
  },

  // 클라이언트 정보 섹션
  clientSection: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    width: 80,
    fontSize: 10,
    color: colors.secondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
  },

  // 테이블 스타일
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 8,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.white,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 8,
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 10,
  },

  // 테이블 컬럼 너비
  colNo: { width: "8%" },
  colName: { width: "32%" },
  colQty: { width: "12%", textAlign: "right" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "28%", textAlign: "right" },

  // 합계 섹션
  totalSection: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    marginRight: 20,
    color: colors.secondary,
  },
  totalValue: {
    fontSize: 12,
    width: 120,
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 20,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    width: 120,
    textAlign: "right",
  },

  // 비고 섹션
  notesSection: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.secondary,
  },

  // 푸터
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
})
