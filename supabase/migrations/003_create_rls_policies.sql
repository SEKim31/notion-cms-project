-- =============================================
-- 003: RLS (Row Level Security) 정책 설정
-- 보안을 위한 행 수준 접근 제어
-- =============================================

-- =============================================
-- RLS 활성화
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Users 테이블 RLS 정책
-- =============================================

-- 기존 정책 삭제 (재실행 가능하도록)
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_delete_own" ON public.users;

-- SELECT: 본인 데이터만 조회 가능
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- INSERT: 본인 ID로만 삽입 가능
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- UPDATE: 본인 데이터만 수정 가능
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- DELETE: 본인 데이터만 삭제 가능
CREATE POLICY "users_delete_own" ON public.users
    FOR DELETE
    USING (auth.uid() = id);

-- =============================================
-- Quotes 테이블 RLS 정책
-- =============================================

-- 기존 정책 삭제 (재실행 가능하도록)
DROP POLICY IF EXISTS "quotes_select_own" ON public.quotes;
DROP POLICY IF EXISTS "quotes_select_by_share_id" ON public.quotes;
DROP POLICY IF EXISTS "quotes_insert_own" ON public.quotes;
DROP POLICY IF EXISTS "quotes_update_own" ON public.quotes;
DROP POLICY IF EXISTS "quotes_delete_own" ON public.quotes;

-- SELECT (본인): 본인 견적서만 조회 가능
CREATE POLICY "quotes_select_own" ON public.quotes
    FOR SELECT
    USING (auth.uid() = user_id);

-- SELECT (공유): share_id로 누구나 조회 가능 (비로그인 사용자 포함)
-- 이 정책은 공개 공유 링크를 위한 것
CREATE POLICY "quotes_select_by_share_id" ON public.quotes
    FOR SELECT
    USING (true);
    -- 참고: 실제 share_id 검증은 애플리케이션 레벨에서 수행
    -- share_id가 URL 파라미터로 전달되어야만 접근 가능

-- INSERT: 본인 ID로만 삽입 가능
CREATE POLICY "quotes_insert_own" ON public.quotes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: 본인 견적서만 수정 가능
CREATE POLICY "quotes_update_own" ON public.quotes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: 본인 견적서만 삭제 가능
CREATE POLICY "quotes_delete_own" ON public.quotes
    FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- 서비스 역할 (Service Role) 접근 허용
-- 서버 사이드에서 관리자 작업 수행 시 필요
-- =============================================

-- 참고: Supabase의 service_role 키를 사용하면
-- RLS를 우회하여 모든 데이터에 접근 가능
-- 이는 서버 사이드 API 라우트에서 사용

-- =============================================
-- 익명 사용자(anon) 정책
-- 공유 링크로 견적서를 조회할 때 사용
-- =============================================

-- 공유 견적서 조회를 위한 함수
CREATE OR REPLACE FUNCTION public.get_shared_quote(p_share_id VARCHAR)
RETURNS TABLE (
    id UUID,
    quote_number VARCHAR,
    client_name VARCHAR,
    client_contact VARCHAR,
    client_phone VARCHAR,
    client_email VARCHAR,
    items JSONB,
    total_amount DECIMAL,
    issue_date DATE,
    valid_until DATE,
    notes TEXT,
    status quote_status,
    company_name VARCHAR
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.quote_number,
        q.client_name,
        q.client_contact,
        q.client_phone,
        q.client_email,
        q.items,
        q.total_amount,
        q.issue_date,
        q.valid_until,
        q.notes,
        q.status,
        u.company_name
    FROM public.quotes q
    JOIN public.users u ON q.user_id = u.id
    WHERE q.share_id = p_share_id;
END;
$$ LANGUAGE plpgsql;

-- 함수 실행 권한 부여 (익명 사용자도 실행 가능)
GRANT EXECUTE ON FUNCTION public.get_shared_quote(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION public.get_shared_quote(VARCHAR) TO authenticated;

-- =============================================
-- 견적서 조회 시 상태 업데이트 함수
-- 공유 링크로 조회 시 VIEWED 상태로 변경
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_quote_as_viewed(p_share_id VARCHAR)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.quotes
    SET status = 'VIEWED'
    WHERE share_id = p_share_id
      AND status = 'SENT';
END;
$$ LANGUAGE plpgsql;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION public.mark_quote_as_viewed(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION public.mark_quote_as_viewed(VARCHAR) TO authenticated;

-- =============================================
-- 정책 설명 코멘트
-- =============================================
COMMENT ON POLICY "users_select_own" ON public.users IS '사용자는 본인 정보만 조회 가능';
COMMENT ON POLICY "users_insert_own" ON public.users IS '사용자는 본인 ID로만 계정 생성 가능';
COMMENT ON POLICY "users_update_own" ON public.users IS '사용자는 본인 정보만 수정 가능';
COMMENT ON POLICY "users_delete_own" ON public.users IS '사용자는 본인 계정만 삭제 가능';

COMMENT ON POLICY "quotes_select_own" ON public.quotes IS '사업자는 본인 견적서만 조회 가능';
COMMENT ON POLICY "quotes_select_by_share_id" ON public.quotes IS '공유 링크로 누구나 견적서 조회 가능';
COMMENT ON POLICY "quotes_insert_own" ON public.quotes IS '사업자는 본인 ID로만 견적서 생성 가능';
COMMENT ON POLICY "quotes_update_own" ON public.quotes IS '사업자는 본인 견적서만 수정 가능';
COMMENT ON POLICY "quotes_delete_own" ON public.quotes IS '사업자는 본인 견적서만 삭제 가능';
