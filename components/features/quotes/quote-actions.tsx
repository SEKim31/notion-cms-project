"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Link2, Loader2, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRegenerateShareLink, copyShareLinkToClipboard } from "@/hooks/use-share"
import { usePdfDownload, useSharedPdfDownload } from "@/hooks/use-pdf"

interface QuoteActionsProps {
  quoteId: string
  shareId: string
  quoteNumber: string
  showBackButton?: boolean
}

// 견적서 액션 버튼 컴포넌트 (PDF 다운로드, 공유 링크 복사, 재생성)
export function QuoteActions({
  quoteId,
  shareId: initialShareId,
  quoteNumber,
  showBackButton = true,
}: QuoteActionsProps) {
  const [currentShareId, setCurrentShareId] = useState(initialShareId)
  const regenerateMutation = useRegenerateShareLink()
  const { isDownloading, download: downloadPdf } = usePdfDownload()

  // 공유 링크 복사
  const handleCopyShareLink = async () => {
    const success = await copyShareLinkToClipboard(currentShareId)
    if (success) {
      toast.success("공유 링크가 클립보드에 복사되었습니다.")
    } else {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  // 공유 링크 재생성
  const handleRegenerateShareLink = async () => {
    try {
      const result = await regenerateMutation.mutateAsync(quoteId)
      setCurrentShareId(result.shareId)
      toast.success("공유 링크가 재생성되었습니다. 기존 링크는 더 이상 유효하지 않습니다.")
    } catch (error) {
      toast.error("공유 링크 재생성에 실패했습니다.")
    }
  }

  // PDF 다운로드
  const handleDownloadPdf = async () => {
    const result = await downloadPdf(quoteId, quoteNumber)
    if (result.success) {
      toast.success("PDF 다운로드가 완료되었습니다.")
    } else {
      toast.error(result.error || "PDF 다운로드에 실패했습니다. 다시 시도해주세요.")
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

        {/* 공유 링크 재생성 버튼 */}
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={regenerateMutation.isPending}
                >
                  {regenerateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="sr-only">공유 링크 재생성</span>
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>공유 링크를 재생성합니다 (기존 링크 무효화)</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>공유 링크를 재생성하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                새로운 공유 링크가 생성되며, 기존에 공유된 링크는 더 이상 유효하지 않게 됩니다.
                클라이언트에게 새 링크를 다시 전달해야 합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerateShareLink}>
                재생성
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 공유 페이지 열기 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link
                href={`/quote/share/${currentShareId}`}
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
  shareId: string
  quoteNumber: string
}

export function SharedQuoteActions({
  shareId,
  quoteNumber,
}: SharedQuoteActionsProps) {
  const { isDownloading, download: downloadSharedPdf } = useSharedPdfDownload()

  // PDF 다운로드
  const handleDownloadPdf = async () => {
    const result = await downloadSharedPdf(shareId, quoteNumber)
    if (result.success) {
      toast.success("PDF 다운로드가 완료되었습니다.")
    } else {
      toast.error(result.error || "PDF 다운로드에 실패했습니다. 다시 시도해주세요.")
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
