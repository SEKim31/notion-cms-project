-- 이메일 발송 이력 필드 추가
-- quotes 테이블에 발송 일시 및 수신자 이메일 컬럼 추가

-- 발송 일시 컬럼 추가
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

-- 수신자 이메일 컬럼 추가
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sent_to TEXT;

-- 인덱스 추가 (발송된 견적서 조회 시 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_quotes_sent_at ON quotes(sent_at) WHERE sent_at IS NOT NULL;

-- 코멘트 추가
COMMENT ON COLUMN quotes.sent_at IS '이메일 발송 일시';
COMMENT ON COLUMN quotes.sent_to IS '이메일 수신자 주소';
