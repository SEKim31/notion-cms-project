-- =============================================
-- 002: Quotes 테이블 생성
-- 견적서 데이터를 저장하는 테이블
-- =============================================

-- =============================================
-- 견적서 상태 ENUM 타입
-- =============================================
DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- Quotes 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS public.quotes (
    -- 기본 키
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 사업자 ID (users 테이블 참조)
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- 노션 페이지 ID (원본 연결, 고유값)
    notion_page_id VARCHAR(255) NOT NULL UNIQUE,

    -- 견적서 번호
    quote_number VARCHAR(100) NOT NULL,

    -- 클라이언트 정보
    client_name VARCHAR(255) NOT NULL,
    client_contact VARCHAR(255),
    client_phone VARCHAR(50),
    client_email VARCHAR(255),

    -- 품목 목록 (JSONB 배열)
    -- 구조: [{ name, quantity, unitPrice, amount, description }, ...]
    items JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- 금액
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- 날짜
    issue_date DATE NOT NULL,
    valid_until DATE,

    -- 비고/특이사항
    notes TEXT,

    -- 공유 링크 고유 ID (UUID 형태, 고유값)
    share_id VARCHAR(255) NOT NULL UNIQUE DEFAULT uuid_generate_v4()::text,

    -- 견적서 상태
    status quote_status NOT NULL DEFAULT 'DRAFT',

    -- 타임스탬프
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 인덱스
-- =============================================

-- 사용자별 견적서 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON public.quotes(user_id);

-- 견적서 번호 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON public.quotes(quote_number);

-- 클라이언트명 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON public.quotes(client_name);

-- 공유 ID 검색 인덱스 (UNIQUE 제약조건으로 자동 생성되지만 명시적으로)
CREATE INDEX IF NOT EXISTS idx_quotes_share_id ON public.quotes(share_id);

-- 상태별 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);

-- 발행일 기준 정렬 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_issue_date ON public.quotes(issue_date DESC);

-- 생성일 기준 정렬 인덱스
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);

-- 복합 인덱스: 사용자별 최신 견적서 조회
CREATE INDEX IF NOT EXISTS idx_quotes_user_issue_date ON public.quotes(user_id, issue_date DESC);

-- =============================================
-- updated_at 자동 업데이트 트리거
-- =============================================

-- quotes 테이블에 트리거 적용
DROP TRIGGER IF EXISTS set_quotes_updated_at ON public.quotes;
CREATE TRIGGER set_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- JSONB 검증 함수 (품목 배열 구조 검증)
-- =============================================
CREATE OR REPLACE FUNCTION public.validate_quote_items(items JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- 배열인지 확인
    IF jsonb_typeof(items) != 'array' THEN
        RETURN FALSE;
    END IF;

    -- 빈 배열은 허용
    IF jsonb_array_length(items) = 0 THEN
        RETURN TRUE;
    END IF;

    -- 각 요소가 필수 필드를 가지고 있는지 확인
    RETURN NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(items) AS item
        WHERE NOT (
            item ? 'name' AND
            item ? 'quantity' AND
            item ? 'unitPrice' AND
            item ? 'amount'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- items 컬럼에 검증 제약조건 추가
ALTER TABLE public.quotes
    DROP CONSTRAINT IF EXISTS check_quote_items_valid;
ALTER TABLE public.quotes
    ADD CONSTRAINT check_quote_items_valid
    CHECK (public.validate_quote_items(items));

-- =============================================
-- 테이블 코멘트
-- =============================================
COMMENT ON TABLE public.quotes IS '견적서 데이터';
COMMENT ON COLUMN public.quotes.id IS '견적서 고유 ID';
COMMENT ON COLUMN public.quotes.user_id IS '사업자 ID (users.id 참조)';
COMMENT ON COLUMN public.quotes.notion_page_id IS '노션 페이지 ID (원본 연결)';
COMMENT ON COLUMN public.quotes.quote_number IS '견적서 번호';
COMMENT ON COLUMN public.quotes.client_name IS '클라이언트 회사명';
COMMENT ON COLUMN public.quotes.client_contact IS '클라이언트 담당자';
COMMENT ON COLUMN public.quotes.client_phone IS '클라이언트 연락처';
COMMENT ON COLUMN public.quotes.client_email IS '클라이언트 이메일';
COMMENT ON COLUMN public.quotes.items IS '품목 목록 (JSONB 배열)';
COMMENT ON COLUMN public.quotes.total_amount IS '총 금액';
COMMENT ON COLUMN public.quotes.issue_date IS '발행일';
COMMENT ON COLUMN public.quotes.valid_until IS '유효기간';
COMMENT ON COLUMN public.quotes.notes IS '비고/특이사항';
COMMENT ON COLUMN public.quotes.share_id IS '공유 링크 고유 ID';
COMMENT ON COLUMN public.quotes.status IS '견적서 상태 (DRAFT, SENT, VIEWED, EXPIRED)';
COMMENT ON COLUMN public.quotes.created_at IS '데이터 생성일';
COMMENT ON COLUMN public.quotes.updated_at IS '마지막 동기화 시간';
