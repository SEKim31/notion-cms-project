// PDF 폰트 등록 설정
import { Font } from "@react-pdf/renderer"

// 폰트 등록 여부 플래그
let fontsRegistered = false

// CDN에서 폰트 로드 (fontsource via jsdelivr)
const FONT_URLS = {
  regular:
    "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-400-normal.ttf",
  bold: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf",
}

/**
 * 한글 폰트 등록
 * Noto Sans KR 폰트 사용 (CDN)
 */
export function registerFonts() {
  if (fontsRegistered) return

  Font.register({
    family: "NotoSansKR",
    fonts: [
      {
        src: FONT_URLS.regular,
        fontWeight: "normal",
      },
      {
        src: FONT_URLS.bold,
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
