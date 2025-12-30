"use client"

import { useSyncExternalStore } from "react"

// 빈 구독 함수 (외부 상태가 변하지 않으므로)
const emptySubscribe = () => () => {}

// SSR 하이드레이션 이슈 방지를 위한 마운트 상태 훅
// 클라이언트에서만 렌더링해야 하는 컴포넌트에 사용
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // 클라이언트: true
    () => false  // 서버: false
  )
}
