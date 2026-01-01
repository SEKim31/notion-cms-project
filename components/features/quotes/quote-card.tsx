"use client"

import Link from "next/link"
import { Copy, ExternalLink, MoreVertical } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuoteSummary } from "@/types"
import {
  formatAmount,
  formatDate,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/mock/quotes"

interface QuoteCardProps {
  quote: QuoteSummary
}

// 견적서 카드 컴포넌트
export function QuoteCard({ quote }: QuoteCardProps) {
  // 공유 링크 복사 기능
  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/quote/share/${quote.shareId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("공유 링크가 클립보드에 복사되었습니다.")
    } catch (err) {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {quote.quoteNumber}
            </p>
            <h3 className="font-semibold leading-tight">{quote.clientName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(quote.status)}>
              {getStatusLabel(quote.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/quotes/${quote.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    상세 보기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyShareLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  공유 링크 복사
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/quote/share/${quote.shareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    공유 페이지 열기
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">총 금액</span>
            <span className="text-xl font-bold">
              {formatAmount(quote.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>발행일</span>
            <span>{formatDate(quote.issueDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-4">
        <Button asChild className="flex-1" variant="outline">
          <Link href={`/quotes/${quote.id}`}>상세 보기</Link>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleCopyShareLink}
          title="공유 링크 복사"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
