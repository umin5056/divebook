# Coding Conventions

> MVP 경량화 과정에서 제외/제거한 항목(Crew, 카카오 로그인, Redis, Docker, TypeScript 등)은 `../고도화.md` 참고.

## 공통

- 언어: JavaScript
- 들여쓰기: 2 spaces
- 따옴표: 더블쿼트 (`"`)
- 컴포넌트 파일명: PascalCase (`StudentPage.jsx`)
- 유틸/훅 파일명: camelCase (`useIsMobile.js`)

## React

- 함수형 컴포넌트만 사용
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
- 컬러 팔레트: 버튼/배경 등 색이 필요하면 기본으로 아래 컬러를 사용한다
  - 기본(버튼/배경): `#008080`
  - 강조 글자: `#003366`
  - 연한 배경: `#E0F2F1`
  - 하얀색에 가까운 배경: `#F8FAFC`

## Konsta UI

- Konsta 컴포넌트를 우선 사용하고, 없는 경우에만 직접 구현
- `App` 래퍼로 전체를 감싸야 테마 적용됨
- Tailwind와 혼용 가능하지만 Konsta 컴포넌트 내부 스타일은 건드리지 않기

## 리팩토링 원칙

- 새 함수나 컴포넌트를 만들기 전에 기존 코드베이스에 유사한 동작을 하는 함수/컴포넌트가 있는지 먼저 확인한다
- 기존 것을 재사용하거나 소폭 수정하는 비용이 새로 만드는 비용보다 크다고 판단될 때만 새로 만든다
- 재사용 시 기존 인터페이스를 최대한 유지하고, 필요한 경우에만 선택적 prop을 추가한다
