"use client"

import { CalendarDays, Hash, Clock, Mail } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Quote } from "@/types"
import {
  formatDate,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/mock/quotes"

interface QuoteHeaderProps {
  quote: Quote
  companyName?: string
}

// 견적서 헤더 정보 컴포넌트
export function QuoteHeader({ quote, companyName }: QuoteHeaderProps) {
  // 유효기간 만료 여부 확인
  const isExpired =
    quote.validUntil && new Date(quote.validUntil) < new Date()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {companyName && (
              <p className="text-lg font-semibold text-primary">
                {companyName}
              </p>
            )}
            <CardTitle className="text-2xl">견적서</CardTitle>
          </div>
          <Badge
            variant={getStatusBadgeVariant(quote.status)}
            className="w-fit"
          >
            {getStatusLabel(quote.status)}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 견적서 번호 */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                견적서 번호
              </p>
              <p className="font-semibold">{quote.quoteNumber}</p>
            </div>
          </div>

          {/* 발행일 */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                발행일
              </p>
              <p className="font-semibold">{formatDate(quote.issueDate)}</p>
            </div>
          </div>

          {/* 유효기간 */}
          {quote.validUntil && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  유효기간
                </p>
                <p
                  className={
                    isExpired
                      ? "font-semibold text-destructive"
                      : "font-semibold"
                  }
                >
                  {formatDate(quote.validUntil)}
                  {isExpired && " (만료됨)"}
                </p>
              </div>
            </div>
          )}

          {/* 발송 이력 */}
          {quote.sentAt && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  이메일 발송
                </p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatDate(quote.sentAt)}
                </p>
                {quote.sentTo && (
                  <p className="text-xs text-muted-foreground">
                    {quote.sentTo}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
