"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Eye, EyeOff, HelpCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  notionSettingsSchema,
  type NotionSettingsFormData,
} from "@/lib/validations/settings"
import type { ApiResponse, SettingsResponse, NotionTestResponse } from "@/types/api"

interface NotionSettingsFormProps {
  initialData?: Partial<NotionSettingsFormData>
  onSuccess?: (databaseName?: string) => void
}

// 설정 저장 API 호출
async function saveSettings(data: NotionSettingsFormData): Promise<SettingsResponse> {
  const response = await fetch("/api/settings/notion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result: ApiResponse<SettingsResponse> = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.error || "설정 저장에 실패했습니다.")
  }

  return result.data
}

// 연동 테스트 API 호출
async function testConnection(data: NotionSettingsFormData): Promise<NotionTestResponse> {
  const response = await fetch("/api/settings/notion/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result: ApiResponse<NotionTestResponse> = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.error || "연동 테스트에 실패했습니다.")
  }

  return result.data
}

// 노션 연동 설정 폼 컴포넌트
export function NotionSettingsForm({
  initialData,
  onSuccess,
}: NotionSettingsFormProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [lastTestResult, setLastTestResult] = useState<NotionTestResponse | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<NotionSettingsFormData>({
    resolver: zodResolver(notionSettingsSchema),
    defaultValues: {
      notionApiKey: initialData?.notionApiKey ?? "",
      notionDatabaseId: initialData?.notionDatabaseId ?? "",
    },
  })

  // 연동 테스트 mutation
  const testMutation = useMutation({
    mutationFn: testConnection,
    onSuccess: (data) => {
      setLastTestResult(data)
      toast.success("연동 테스트 성공", {
        description: data.databaseName
          ? `"${data.databaseName}" 데이터베이스에 연결되었습니다.${data.pageCount !== undefined ? ` (${data.pageCount}개 항목)` : ""}`
          : "노션 데이터베이스에 정상적으로 연결되었습니다.",
      })
    },
    onError: (error: Error) => {
      setLastTestResult(null)
      toast.error("연동 테스트 실패", {
        description: error.message,
      })
    },
  })

  // 설정 저장 mutation
  const saveMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      // 설정 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["notionSettings"] })

      toast.success("설정 저장 완료", {
        description: "노션 연동 설정이 저장되었습니다.",
      })

      onSuccess?.(lastTestResult?.databaseName)
    },
    onError: (error: Error) => {
      toast.error("설정 저장 실패", {
        description: error.message,
      })
    },
  })

  // 연동 테스트 핸들러
  async function handleTest() {
    const isValid = await form.trigger()
    if (!isValid) return

    const data = form.getValues()
    testMutation.mutate(data)
  }

  // 설정 저장 핸들러
  async function onSubmit(data: NotionSettingsFormData) {
    saveMutation.mutate(data)
  }

  const isLoading = saveMutation.isPending
  const isTesting = testMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="notionApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                노션 API 키 (Integration Token)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        노션 Integrations 페이지에서 생성한 Internal Integration
                        Token입니다. secret_ 또는 ntn_ 으로 시작합니다.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="secret_xxxxxxxxxxxxxxxx"
                    disabled={isLoading || isTesting}
                    className="pr-10"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      // 입력 변경 시 테스트 결과 초기화
                      setLastTestResult(null)
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                <a
                  href="https://www.notion.so/my-integrations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  노션 Integrations 페이지
                </a>
                에서 새 Integration을 생성하고 토큰을 복사하세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notionDatabaseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                데이터베이스 ID
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        견적서가 저장된 노션 데이터베이스의 ID입니다.
                        데이터베이스 URL에서 추출하거나 32자리 UUID를 직접 입력하세요.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  disabled={isLoading || isTesting}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    // 입력 변경 시 테스트 결과 초기화
                    setLastTestResult(null)
                  }}
                />
              </FormControl>
              <FormDescription>
                데이터베이스 URL의 마지막 32자리가 ID입니다. 예: notion.so/.../<strong>abc123...</strong>?v=...
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 테스트 성공 결과 표시 */}
        {lastTestResult?.success && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              연결됨: {lastTestResult.databaseName}
              {lastTestResult.pageCount !== undefined && ` (${lastTestResult.pageCount}개 항목)`}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleTest}
            disabled={isLoading || isTesting}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            연동 테스트
          </Button>
          <Button type="submit" disabled={isLoading || isTesting}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            설정 저장
          </Button>
        </div>
      </form>
    </Form>
  )
}
