-- =============================================
-- 001: Users 테이블 생성
-- 사업자 계정 정보를 저장하는 테이블
-- =============================================

-- UUID 확장 활성화 (Supabase에서 기본 제공)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pgcrypto 확장 활성화 (암호화용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- Users 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    -- 기본 키: Supabase Auth의 user id와 동일하게 사용
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 이메일 (Supabase Auth와 동기화, 고유값)
    email VARCHAR(255) NOT NULL UNIQUE,

    -- 사업자명/회사명
    company_name VARCHAR(255) NOT NULL,

    -- 노션 API 키 (암호화하여 저장)
    -- 실제 암호화는 애플리케이션 레벨에서 처리
    notion_api_key TEXT,

    -- 노션 데이터베이스 ID
    notion_database_id VARCHAR(255),

    -- 타임스탬프
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 인덱스
-- =============================================

-- 이메일 검색 인덱스 (UNIQUE 제약조건으로 자동 생성되지만 명시적으로)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 생성일 기준 정렬 인덱스
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- =============================================
-- updated_at 자동 업데이트 트리거
-- =============================================

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블에 트리거 적용
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 테이블 코멘트
-- =============================================
COMMENT ON TABLE public.users IS '사업자 계정 정보';
COMMENT ON COLUMN public.users.id IS 'Supabase Auth user ID와 동일';
COMMENT ON COLUMN public.users.email IS '로그인 이메일 (고유값)';
COMMENT ON COLUMN public.users.company_name IS '사업자명/회사명';
COMMENT ON COLUMN public.users.notion_api_key IS '노션 API 키 (암호화 저장)';
COMMENT ON COLUMN public.users.notion_database_id IS '노션 데이터베이스 ID';
COMMENT ON COLUMN public.users.created_at IS '계정 생성일';
COMMENT ON COLUMN public.users.updated_at IS '정보 수정일';
