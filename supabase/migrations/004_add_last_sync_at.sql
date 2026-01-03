-- =============================================
-- 004: last_sync_at 컬럼 추가
-- 마지막 동기화 시간을 저장하는 컬럼
-- =============================================

-- users 테이블에 last_sync_at 컬럼 추가
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ;

-- 컬럼 코멘트 추가
COMMENT ON COLUMN public.users.last_sync_at IS '마지막 노션 동기화 시간';

-- 인덱스 추가 (동기화 상태 조회용)
CREATE INDEX IF NOT EXISTS idx_users_last_sync_at ON public.users(last_sync_at DESC);
