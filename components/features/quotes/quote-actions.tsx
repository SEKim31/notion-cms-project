"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Link2, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface QuoteActionsProps {
  quoteId: string
  shareId: string
  showBackButton?: boolean
}

// 견적서 액션 버튼 컴포넌트 (PDF 다운로드, 공유 링크 복사)
export function QuoteActions({
  quoteId,
  shareId,
  showBackButton = true,
}: QuoteActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // 공유 링크 복사
  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/quote/share/${shareId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("공유 링크가 클립보드에 복사되었습니다.")
    } catch (err) {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  // PDF 다운로드 (TODO: 실제 API 연동)
  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    try {
      // TODO: 실제 PDF 생성 API 호출
      // const response = await fetch(`/api/quotes/${quoteId}/pdf`)
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement("a")
      // a.href = url
      // a.download = `quote-${quoteId}.pdf`
      // a.click()
      // window.URL.revokeObjectURL(url)

      // 더미 다운로드 (2초 대기)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("PDF 다운로드가 완료되었습니다.")
    } catch (err) {
      toast.error("PDF 다운로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* 목록으로 돌아가기 버튼 */}
        {showBackButton && (
          <Button variant="outline" asChild>
            <Link href="/quotes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
        )}

        {/* 공유 링크 복사 버튼 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={handleCopyShareLink}>
              <Link2 className="mr-2 h-4 w-4" />
              공유 링크 복사
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>클라이언트에게 전달할 공유 링크를 복사합니다</p>
          </TooltipContent>
        </Tooltip>

        {/* 공유 페이지 열기 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link
                href={`/quote/share/${shareId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">공유 페이지 열기</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>공유 페이지를 새 탭에서 열기</p>
          </TooltipContent>
        </Tooltip>

        {/* PDF 다운로드 버튼 */}
        <Button onClick={handleDownloadPdf} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              다운로드 중...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              PDF 다운로드
            </>
          )}
        </Button>
      </div>
    </TooltipProvider>
  )
}

// 공유 페이지용 액션 버튼 (PDF 다운로드만)
interface SharedQuoteActionsProps {
  quoteId: string
  quoteNumber: string
}

export function SharedQuoteActions({
  quoteId,
  quoteNumber,
}: SharedQuoteActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // PDF 다운로드 (TODO: 실제 API 연동)
  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    try {
      // TODO: 실제 PDF 생성 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("PDF 다운로드가 완료되었습니다.")
    } catch (err) {
      toast.error("PDF 다운로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownloadPdf}
      disabled={isDownloading}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          다운로드 중...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          PDF 다운로드
        </>
      )}
    </Button>
  )
}
