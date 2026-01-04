// PDF 폰트 등록 설정
import { Font } from "@react-pdf/renderer"

// 폰트 등록 여부 플래그
let fontsRegistered = false

/**
 * 한글 폰트 등록
 * Noto Sans KR 폰트 사용
 */
export function registerFonts() {
  if (fontsRegistered) return

  Font.register({
    family: "NotoSansKR",
    fonts: [
      {
        src: "/fonts/NotoSansKR-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: "/fonts/NotoSansKR-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  })

  // 하이픈 처리 콜백 설정 (한글은 하이픈 사용 안함)
  Font.registerHyphenationCallback((word) => [word])

  fontsRegistered = true
}

// 기본 폰트 패밀리
export const FONT_FAMILY = "NotoSansKR"
