"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSendEmail } from "@/hooks/use-send-email"
import { sendEmailSchema, type SendEmailFormData } from "@/lib/validations/email"

interface SendEmailDialogProps {
  quoteId: string
  clientEmail?: string | null
  quoteNumber: string
  isOpen: boolean
  onClose: () => void
}

// 이메일 발송 다이얼로그 컴포넌트
export function SendEmailDialog({
  quoteId,
  clientEmail,
  quoteNumber,
  isOpen,
  onClose,
}: SendEmailDialogProps) {
  const sendEmailMutation = useSendEmail()

  // 폼 초기화
  const form = useForm<SendEmailFormData>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      to: clientEmail || "",
      subject: `[견적서] ${quoteNumber} 견적서 안내드립니다.`,
      message: "",
    },
  })

  // 폼 제출 처리
  const onSubmit = async (data: SendEmailFormData) => {
    try {
      const result = await sendEmailMutation.mutateAsync({
        quoteId,
        data: {
          to: data.to,
          subject: data.subject,
          message: data.message || undefined,
        },
      })

      if (result.success) {
        toast.success("견적서 이메일이 발송되었습니다.")
        form.reset()
        onClose()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "이메일 발송에 실패했습니다."
      toast.error(errorMessage)
    }
  }

  // 다이얼로그 닫기 시 폼 리셋
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            견적서 이메일 발송
          </DialogTitle>
          <DialogDescription>
            견적서 PDF를 첨부하여 고객에게 이메일을 발송합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 수신자 이메일 */}
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수신자 이메일 *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="client@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 제목 */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일 제목 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="견적서 안내 메일 제목"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 추가 메시지 */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>추가 메시지</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="고객에게 전달할 추가 메시지를 입력해주세요. (선택사항)"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    이메일 본문에 추가로 표시될 메시지입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={sendEmailMutation.isPending}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={sendEmailMutation.isPending}
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    이메일 발송
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
