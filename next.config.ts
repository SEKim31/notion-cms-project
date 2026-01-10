import type { NextConfig } from "next"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  // 실험적 기능: 패키지 임포트 최적화 (tree-shaking 개선)
  experimental: {
    optimizePackageImports: [
      // 아이콘 라이브러리
      "lucide-react",
      // Radix UI 컴포넌트
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      // 유틸리티 라이브러리
      "class-variance-authority",
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
