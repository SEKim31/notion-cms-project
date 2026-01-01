"use client"

import { Building2, User, Phone, Mail } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "@/types"

interface ClientInfoCardProps {
  quote: Quote
}

// 클라이언트 정보 카드 컴포넌트
export function ClientInfoCard({ quote }: ClientInfoCardProps) {
  const hasContactInfo =
    quote.clientContact || quote.clientPhone || quote.clientEmail

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" />
          클라이언트 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 회사명 */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                회사명
              </p>
              <p className="font-semibold">{quote.clientName}</p>
            </div>
          </div>

          {/* 담당자 */}
          {quote.clientContact && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  담당자
                </p>
                <p className="font-semibold">{quote.clientContact}</p>
              </div>
            </div>
          )}

          {/* 연락처 */}
          {quote.clientPhone && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  연락처
                </p>
                <p className="font-semibold">
                  <a
                    href={`tel:${quote.clientPhone}`}
                    className="hover:underline"
                  >
                    {quote.clientPhone}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* 이메일 */}
          {quote.clientEmail && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  이메일
                </p>
                <p className="font-semibold">
                  <a
                    href={`mailto:${quote.clientEmail}`}
                    className="hover:underline"
                  >
                    {quote.clientEmail}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* 연락처 정보가 없는 경우 */}
          {!hasContactInfo && (
            <p className="text-sm text-muted-foreground sm:col-span-2">
              등록된 연락처 정보가 없습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
