import { Header, Footer } from "@/components/layout"

interface MarketingLayoutProps {
  children: React.ReactNode
}

// 마케팅 페이지 레이아웃
// Header + Content + Footer 구조
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
