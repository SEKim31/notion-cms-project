import {
  Settings,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react"

// 네비게이션 아이템 타입
export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
  external?: boolean
  badge?: string
}

// 네비게이션 그룹 타입
export interface NavGroup {
  title: string
  items: NavItem[]
}

// 마케팅 페이지 네비게이션
export const mainNav: NavItem[] = [
  { title: "홈", href: "/" },
  { title: "기능", href: "/features" },
  { title: "예제", href: "/examples" },
  { title: "소개", href: "/about" },
]

// 대시보드 사이드바 네비게이션
export const dashboardNav: NavGroup[] = [
  {
    title: "메뉴",
    items: [
      { title: "대시보드", href: "/dashboard", icon: LayoutDashboard },
      { title: "설정", href: "/settings", icon: Settings },
    ],
  },
]

// 푸터 링크 타입
export interface FooterNavItem {
  title: string
  href: string
  disabled?: boolean
}

// 푸터 링크
export const footerNav: Record<string, FooterNavItem[]> = {
  product: [
    { title: "기능", href: "/features" },
    { title: "예제", href: "/examples" },
  ],
  company: [
    { title: "소개", href: "/about" },
  ],
  legal: [
    { title: "개인정보처리방침", href: "/privacy" },
    { title: "이용약관", href: "/terms" },
  ],
}
