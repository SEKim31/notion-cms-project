// 사이트 전역 설정
export const siteConfig = {
  name: "스타터킷",
  description: "Next.js 모던 웹 스타터킷 - 빠르게 웹 개발을 시작하세요",
  url: "https://example.com",
  ogImage: "https://example.com/og.jpg",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  creator: "Your Name",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
} as const

export type SiteConfig = typeof siteConfig
