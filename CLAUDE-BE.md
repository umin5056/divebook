# Backend Skills

## 리팩토링 원칙

- 새 메서드나 클래스를 만들기 전에 기존 코드베이스에 유사한 동작을 하는 것이 있는지 먼저 확인한다
- 기존 것을 재사용하거나 소폭 수정하는 비용이 새로 만드는 비용보다 크다고 판단될 때만 새로 만든다
- 재사용 시 기존 인터페이스를 최대한 유지하고, 필요한 경우에만 오버로드나 선택적 파라미터를 추가한다

> MVP 경량화 과정에서 제외/제거한 항목(Crew, 카카오 로그인, Redis, Docker, TypeScript 등)은 `../고도화.md` 참고.

## 프로젝트 개요

프리다이빙 강습 관리 어드민 API 서버

## 기술 스택

- **Java** + **Spring Boot**
- **Spring Security** + **JWT** (인증)
- **JPA** / **Hibernate** (ORM)
- **MariaDB** (메인 DB)
- **AWS** EC2 + RDS + S3 (인프라)
- **GitHub Actions** (CI/CD)

## 프로젝트 구조

```
src/
└── main/
    ├── java/com/diving/admin/
    │   ├── domain/
    │   │   ├── auth/          # 이메일 인증코드 로그인, refresh token
    │   │   ├── instructor/
    │   │   ├── student/
    │   │   ├── lesson/
    │   │   └── enrollment/
    │   ├── global/
    │   │   ├── config/
    │   │   │   └── SecurityConfig.java
    │   │   ├── jwt/
    │   │   │   ├── JwtProvider.java
    │   │   │   ├── JwtFilter.java
    │   │   │   └── JwtProperties.java
    │   │   └── exception/
    │   │       ├── GlobalExceptionHandler.java
    │   │       └── ErrorResponse.java
    │   └── AdminApplication.java
    └── resources/
        ├── application.yml
        └── application-db.yml
```

## DB 설계

모든 PK는 `bigint auto_increment`이며, FK는 참조 테이블의 PK 값을 담는 `bigint` 컬럼이다 (JPA 연관관계 매핑 없이 순수 필드로만 연결).

### tbl_instructor (강사)

| 컬럼              | 타입         | 설명                |
| ----------------- | ------------ | ------------------- |
| instructor_id     | bigint       | PK, auto_increment  |
| email             | varchar(255) | 이메일 (UNI, 로그인 식별자) |
| phone             | varchar(20)  | 전화번호            |
| profile_image_url | varchar(500) | 프로필 이미지       |
| name              | varchar(100) | 이름                |
| content           | text         | 내용                |
| created_at        | datetime     | 생성일              |
| modified_at       | datetime     | 수정일              |

### tbl_student (수강생)

| 컬럼          | 타입         | 설명                 |
| ------------- | ------------ | -------------------- |
| student_id    | bigint       | PK, auto_increment   |
| instructor_id | bigint       | FK → tbl_instructor  |
| phone         | varchar(20)  | 전화번호 (UNI)       |
| name          | varchar(100) | 이름                 |
| email         | varchar(255) | 이메일               |
| content       | text         | 내용                 |
| deleted       | char(1)      | 소프트 삭제 플래그   |
| created_at    | datetime     | 생성일               |
| modified_at   | datetime     | 수정일               |

### tbl_lesson (수업)

| 컬럼          | 타입         | 설명                      |
| ------------- | ------------ | ------------------------- |
| lesson_id     | bigint       | PK, auto_increment        |
| instructor_id | bigint       | FK → tbl_instructor       |
| title         | varchar(100) | 수업명                    |
| location      | varchar(100) | 장소                      |
| lesson_date   | date         | 수업 날짜                 |
| start_time    | time         | 시작 시간                 |
| end_time      | time         | 종료 시간                 |
| max_students  | smallint     | 최대 수강 인원            |
| fee           | int          | 수강료                    |
| content       | text         | 내용                      |
| status        | enum         | open / closed / cancelled |
| created_at    | datetime     | 생성일                    |
| modified_at   | datetime     | 수정일                    |

### tbl_enrollment (수업-수강생 배정)

| 컬럼           | 타입     | 설명                      |
| -------------- | -------- | ------------------------- |
| enrollment_id  | bigint   | PK, auto_increment        |
| lesson_id      | bigint   | FK → tbl_lesson           |
| student_id     | bigint   | FK → tbl_student          |
| payment_status | enum     | pending / paid / refunded |
| requested_at   | datetime | 배정일                    |
| modified_at    | datetime | 수정일                    |

### tbl_refresh_token (리프레시 토큰)

| 컬럼             | 타입         | 설명                     |
| ---------------- | ------------ | ------------------------ |
| refresh_token_id | bigint       | PK, auto_increment       |
| instructor_id    | bigint       | FK → tbl_instructor      |
| token            | varchar(500) | refresh token 값         |
| expires_at       | datetime     | 만료 시각                |
| created_at       | datetime     | 생성일                   |

로그아웃 시 해당 레코드를 DB에서 삭제하는 방식으로 무효화한다 (블랙리스트 테이블 없음).

## API 설계

### 인증

```
POST /api/auth/email/send    # 이메일로 인증코드 발송
POST /api/auth/email/verify  # 인증코드 검증 후 JWT 발급
POST /api/auth/refresh
POST /api/auth/logout
```

### 강사

```
GET    /api/instructors           # 강사 목록
POST   /api/instructors           # 강사 추가
GET    /api/instructors/:id       # 강사 상세
PUT    /api/instructors/:id       # 강사 수정
DELETE /api/instructors/:id       # 강사 삭제
```

### 수강생

```
GET    /api/students           # 수강생 목록
POST   /api/students           # 수강생 추가
GET    /api/students/:id       # 수강생 상세
PUT    /api/students/:id       # 수강생 수정
DELETE /api/students/:id       # 수강생 삭제
```

### 수업

```
GET    /api/lessons           # 수업 목록
POST   /api/lessons           # 수업 생성
GET    /api/lessons/:id       # 수업 상세
PUT    /api/lessons/:id       # 수업 수정
DELETE /api/lessons/:id       # 수업 삭제
```

### 수업-수강생 배정

```
POST   /api/lessons/:id/enrollments              # 수강생 배정
DELETE /api/lessons/:id/enrollments/:studentId   # 배정 취소
PATCH  /api/lessons/:id/enrollments/:studentId   # 결제 상태 변경
```

## 인프라

```
GitHub Push
    ↓
GitHub Actions (CI/CD)
    ↓
AWS EC2 배포
    ├── Nginx (리버스 프록시)
    │   ├── / → React 앱 (S3)
    │   └── /api → Spring Boot
    └── RDS (MariaDB)
```

Docker는 현재 미사용 (추후 인프라 완성 시 도입 예정, [[고도화]] 참고).
