"use client"

import { FileText } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuoteNotesCardProps {
  notes?: string | null
}

// 견적서 비고/특이사항 카드 컴포넌트
export function QuoteNotesCard({ notes }: QuoteNotesCardProps) {
  if (!notes) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          비고
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
          {notes}
        </div>
      </CardContent>
    </Card>
  )
}
