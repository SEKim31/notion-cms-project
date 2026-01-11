-- =============================================
-- 005: quote_status ENUM에 새 상태값 추가
-- APPROVED (승인), REJECTED (거절), COMPLETED (작성완료)
-- =============================================

-- 새 상태값 추가
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'REJECTED';
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'COMPLETED';

-- 테이블 코멘트 업데이트
COMMENT ON COLUMN public.quotes.status IS '견적서 상태 (DRAFT, SENT, VIEWED, EXPIRED, APPROVED, REJECTED, COMPLETED)';
