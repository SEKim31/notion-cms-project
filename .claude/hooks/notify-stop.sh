#!/bin/bash
# 작업 완료 시 Slack 알림

"$CLAUDE_PROJECT_DIR/.claude/hooks/slack-notify.sh" \
  "✅ Claude가 작업을 완료했습니다. 확인해주세요." \
  "작업 완료"

exit 0
