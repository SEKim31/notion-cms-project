"use client"

import { useState, useCallback } from "react"

// PDF 다운로드 상태 타입
interface PdfDownloadState {
  isDownloading: boolean
  error: string | null
}

// PDF 다운로드 결과 타입
interface PdfDownloadResult {
  success: boolean
  error?: string
}

/**
 * 사업자용 PDF 다운로드 함수
 * @param quoteId 견적서 ID
 * @param quoteNumber 견적서 번호 (파일명용)
 */
export async function downloadPdf(
  quoteId: string,
  quoteNumber: string
): Promise<PdfDownloadResult> {
  try {
    const response = await fetch(`/api/quotes/${quoteId}/pdf`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "PDF 다운로드에 실패했습니다.")
    }

    // Blob으로 변환
    const blob = await response.blob()

    // 다운로드 트리거
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `견적서-${quoteNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    return { success: false, error: message }
  }
}

/**
 * 공유 페이지용 PDF 다운로드 함수
 * @param shareId 공유 ID
 * @param quoteNumber 견적서 번호 (파일명용)
 */
export async function downloadSharedPdf(
  shareId: string,
  quoteNumber: string
): Promise<PdfDownloadResult> {
  try {
    const response = await fetch(`/api/quotes/share/${shareId}/pdf`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "PDF 다운로드에 실패했습니다.")
    }

    // Blob으로 변환
    const blob = await response.blob()

    // 다운로드 트리거
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `견적서-${quoteNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    return { success: false, error: message }
  }
}

/**
 * 사업자용 PDF 다운로드 훅
 */
export function usePdfDownload() {
  const [state, setState] = useState<PdfDownloadState>({
    isDownloading: false,
    error: null,
  })

  const download = useCallback(async (quoteId: string, quoteNumber: string) => {
    setState({ isDownloading: true, error: null })

    const result = await downloadPdf(quoteId, quoteNumber)

    setState({
      isDownloading: false,
      error: result.error || null,
    })

    return result
  }, [])

  return {
    ...state,
    download,
  }
}

/**
 * 공유 페이지용 PDF 다운로드 훅
 */
export function useSharedPdfDownload() {
  const [state, setState] = useState<PdfDownloadState>({
    isDownloading: false,
    error: null,
  })

  const download = useCallback(async (shareId: string, quoteNumber: string) => {
    setState({ isDownloading: true, error: null })

    const result = await downloadSharedPdf(shareId, quoteNumber)

    setState({
      isDownloading: false,
      error: result.error || null,
    })

    return result
  }, [])

  return {
    ...state,
    download,
  }
}
