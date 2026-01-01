"use client"

import { Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { QuoteItem } from "@/types"
import { formatAmount } from "@/lib/mock/quotes"

interface QuoteItemsTableProps {
  items: QuoteItem[]
  totalAmount: number
}

// 품목 테이블 컴포넌트
export function QuoteItemsTable({ items, totalAmount }: QuoteItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          품목 내역
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40%]">품목명</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatAmount(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatAmount(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="text-right font-semibold">
                  총 금액
                </TableCell>
                <TableCell className="text-right text-lg font-bold tabular-nums">
                  {formatAmount(totalAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* 모바일용 카드 레이아웃 */}
        <div className="mt-4 space-y-3 sm:hidden">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <div className="text-sm text-muted-foreground">
                  {item.quantity}개 × {formatAmount(item.unitPrice)}
                </div>
                <div className="font-semibold">{formatAmount(item.amount)}</div>
              </div>
            </div>
          ))}

          {/* 모바일 총합계 */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="font-semibold">총 금액</span>
            <span className="text-lg font-bold">{formatAmount(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
