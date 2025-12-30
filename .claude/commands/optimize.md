---
description: '프론트엔드 성능 최적화 분석 및 제안'
allowed-tools: ['Read', 'Glob', 'Grep']
---

# Claude 명령어: Optimize

프론트엔드 성능 최적화 포인트를 분석하고 개선 제안을 제공합니다.

## 사용법

```
/optimize [경로]    # 특정 파일/폴더 분석
/optimize           # 전체 프로젝트 분석
```

인자: $ARGUMENTS

## 분석 프로세스

1. 대상 경로의 컴포넌트 파일 스캔 (`.tsx`, `.jsx`)
2. 각 분석 영역별 패턴 검사
3. 우선순위별 최적화 제안 출력

## 분석 영역

### 1. React 컴포넌트 최적화

- **React.memo 필요 여부**: props가 자주 변경되지 않는 컴포넌트
- **useMemo/useCallback**: 비용이 큰 계산이나 콜백 함수
- **불필요한 리렌더링**: 상태 관리 패턴 검토

### 2. 렌더링 성능

- **조건부 렌더링**: 불필요한 DOM 조작 최소화
- **리스트 렌더링**: key 속성, virtualization 필요 여부
- **Lazy Loading**: 무거운 컴포넌트 분리

### 3. 번들 사이즈 최적화

- **Dynamic Import**: 큰 컴포넌트/라이브러리 분할
- **라이브러리 대체**: 경량 대안 제안 (moment → dayjs 등)
- **Tree Shaking**: 불필요한 import 제거

### 4. Next.js 최적화

- `<img>` → `next/image` 변환 필요 여부
- `<a>` → `next/link` 변환 필요 여부

## 출력 포맷

우선순위별로 정리하여 출력:

- 🔴 **높음**: 즉시 수정 권장
- 🟡 **중간**: 개선 시 효과적
- 🟢 **낮음**: 선택적 개선

각 제안에 포함:
- 파일 경로 및 라인 번호
- 문제 설명
- 구체적인 수정 방안

## 검사 패턴

```
# React.memo 미사용 컴포넌트
export default function Component

# 인라인 객체/함수
style={{ ... }}
onClick={() => ...}

# 일반 img 태그
<img src=

# 일반 a 태그
<a href=

# 큰 라이브러리 import
import moment
import lodash
```
