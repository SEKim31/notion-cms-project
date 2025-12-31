// 사이트 전역 설정
export const siteConfig = {
  name: "노션 견적서 뷰어",
  description: "노션에서 작성한 견적서를 웹에서 확인하고 PDF로 다운로드할 수 있는 시스템",
  url: "https://example.com",
  ogImage: "https://example.com/og.jpg",
  links: {
    github: "https://github.com",
  },
  creator: "Notion Quote Viewer",
  keywords: ["노션", "견적서", "PDF", "Notion", "Quote", "Invoice", "Next.js"],
} as const

export type SiteConfig = typeof siteConfig
