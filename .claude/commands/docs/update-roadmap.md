---
description: 'ROADMAP.md에서 완료된 작업을 체크하고 업데이트합니다'
allowed-tools: ['Read', 'Edit']
---

# Claude 명령어: Update Roadmap

ROADMAP.md 파일에서 작업 상태를 확인하고 완료된 작업을 업데이트합니다.

## 사용법

```
/docs/update-roadmap [task-number]  # 특정 Task 완료 표시
/docs/update-roadmap               # 전체 상태 확인 및 업데이트
```

인자: $ARGUMENTS

## 프로세스

1. `docs/ROADMAP.md` 파일 읽기
2. 현재 작업 상태 분석 및 요약 출력
3. 인자로 Task 번호가 제공된 경우 해당 Task를 "완료"로 표시
4. 인자가 없는 경우 사용자에게 완료할 작업 확인

## 상태 표기 규칙

ROADMAP.md에서 Task 상태는 다음과 같이 표기됨:
- `- 완료` : 완료된 작업
- `- 우선순위` : 현재 진행 예정인 작업
- 표기 없음 : 대기 중인 작업

## 출력 포맷

현재 진행 상황 요약:
- 완료: N개
- 진행중/우선순위: N개
- 대기중: N개

Phase별 상세 상태 표시

## 업데이트 방법

Edit 도구를 사용하여 해당 Task 라인에 `- 완료` 추가:
- 변경 전: `- **Task XXX: 설명**`
- 변경 후: `- **Task XXX: 설명** - 완료`
