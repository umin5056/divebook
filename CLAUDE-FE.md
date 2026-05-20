# Coding Conventions

## 공통

- 언어: TypeScript
- 들여쓰기: 2 spaces
- 따옴표: 더블쿼트 (`"`)
- 컴포넌트 파일명: PascalCase (`StudentPage.tsx`)
- 유틸/훅 파일명: camelCase (`useIsMobile.ts`)

## React

- 함수형 컴포넌트만 사용
- props 타입은 인터페이스로 정의
- 이벤트 핸들러 네이밍: `handle` prefix (`handleLogin`, `handleCancel`)
- 페이지 컴포넌트: `default export`
- 공통 컴포넌트: named export

## TanStack Query

- Query Key 배열 형식: `["students", { status: "pending" }]`
- 커스텀 훅으로 분리: `useStudents()`, `useSchedules()` 등

## Zustand

- 스토어 파일명: `useXxxStore.ts`
- UI 상태만 담당 — 서버 데이터는 TanStack Query로 처리

## TailwindCSS

- 인라인 스타일 사용 금지, Tailwind 클래스 우선
