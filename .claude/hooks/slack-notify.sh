#!/bin/bash
# Slack 알림 전송 스크립트

# 프로젝트 환경변수 파일 로드
ENV_FILE="$CLAUDE_PROJECT_DIR/.claude/hooks/.env"
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

# SLACK_WEBHOOK_URL 검증
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "Error: SLACK_WEBHOOK_URL이 설정되지 않았습니다." >&2
  exit 1
fi

MESSAGE="$1"
TITLE="${2:-Claude Code 알림}"

curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-type: application/json' \
  -d "{
    \"blocks\": [
      {
        \"type\": \"section\",
        \"text\": {
          \"type\": \"mrkdwn\",
          \"text\": \"*${TITLE}*\n${MESSAGE}\"
        }
      }
    ]
  }"
