#!/bin/bash
# 권한 요청 시 Slack 알림

# 디버깅 로그 파일
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/hooks/debug.log"

# stdin에서 JSON 읽기
INPUT=$(cat)

# 디버깅: 입력 데이터 로깅
echo "$(date): Received input:" >> "$LOG_FILE"
echo "$INPUT" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# jq로 메시지 추출 (PermissionRequest 이벤트 구조)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input // "{}"')

# 디버깅: 파싱된 값 로깅
echo "$(date): TOOL_NAME=$TOOL_NAME" >> "$LOG_FILE"

# Slack 알림 전송
"$CLAUDE_PROJECT_DIR/.claude/hooks/slack-notify.sh" \
  "🔐 도구 사용 권한 요청: $TOOL_NAME" \
  "권한 요청"
echo "$(date): Slack notification sent for $TOOL_NAME" >> "$LOG_FILE"

exit 0
