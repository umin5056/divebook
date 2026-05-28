# Git Convention

## 브랜치 전략

GitHub Flow를 사용한다.

- `main` 브랜치는 항상 동작하는 상태를 유지한다.
- 모든 작업은 브랜치를 생성하여 진행하고, PR을 통해 main에 머지한다.
- 브랜치를 생성하기 전 항상 브랜치 이름을 제시한 뒤 확인 받는다.

### 브랜치 네이밍

```
feat/login
feat/booking
feat/user
feat/student
fix/schedule-date-parsing
refactor/use-schedules-hook
chore/spring-security-setup
```

### 작업 흐름

```bash
# 1. main 최신화
git checkout main
git pull origin main

# 2. 브랜치 생성
git checkout -b feat/기능명

# 3. 작업 후 커밋
git add .
git commit -m "feat: 내용"

# 4. push
git push origin feat/기능명

# 5. GitHub에서 PR 생성 → main 머지
```

## 커밋 컨벤션

```
type: 내용
```

### Type

| type       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 새 기능                  |
| `fix`      | 버그 수정                |
| `refactor` | 동작 변경 없는 코드 개선 |
| `chore`    | 빌드, 의존성, 설정       |
| `docs`     | 문서, 주석               |

### 예시

```
feat: 수업 예약 API 추가
fix: 예약 날짜 파싱 오류 수정
refactor: useSchedules 훅 분리
chore: Spring Security 의존성 추가
docs: API 명세 주석 추가
```

## 브랜치 보호 규칙

`main` 브랜치에 적용한다.

- **Restrict deletions** — main 브랜치 삭제 차단
- **Require a pull request before merging** — 직접 push 차단, PR 필수
- **Block force pushes** — force push 차단
