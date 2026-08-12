-- 참고용 마이그레이션 SQL. Flyway 등으로 자동 실행되지 않으며, 실제 적용은 이 작업 범위 밖입니다.
-- 반영 내용:
--   1) tbl_crew 삭제, instructor/student의 crew_id 컬럼 제거
--   2) 모든 PK/FK를 char(36) UUID -> BIGINT AUTO_INCREMENT 로 전환
--   3) instructor.kakao_id 제거, email UNIQUE NOT NULL 로 변경 (이메일 인증 로그인 전환)
--   4) tbl_refresh_token 신규 생성 (Redis 대체)
--
-- 주의: 기존 데이터가 있는 상태에서 PK 타입을 char(36) -> BIGINT 로 직접 변경하는 것은 불가능합니다.
-- (UUID 문자열을 BIGINT로 그대로 캐스팅할 수 없기 때문) 운영 DB에 적용할 때는
-- 새 테이블을 만들어 데이터를 이관하거나, 서비스 초기 단계라 데이터가 없다면 DROP 후 재생성하는 방식을 권장합니다.
-- 아래는 데이터가 없는 상태를 가정한 DROP & CREATE 형태로 정리했습니다.

-- 1) crew 도메인 삭제
DROP TABLE IF EXISTS tbl_crew;

-- 2) tbl_instructor 재생성 (crew_id, kakao_id 제거 / PK를 BIGINT로 변경 / email UNIQUE NOT NULL)
DROP TABLE IF EXISTS tbl_instructor;
CREATE TABLE tbl_instructor (
    instructor_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20),
    profile_image_url   VARCHAR(500),
    name                VARCHAR(100) NOT NULL,
    content             TEXT,
    created_at          DATETIME NOT NULL,
    modified_at         DATETIME NOT NULL
);

-- 3) tbl_student 재생성 (crew_id 제거 / PK, instructor_id를 BIGINT로 변경)
DROP TABLE IF EXISTS tbl_student;
CREATE TABLE tbl_student (
    student_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id   BIGINT NOT NULL,
    phone           VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    content         TEXT,
    deleted         CHAR(1) NOT NULL,
    created_at      DATETIME NOT NULL,
    modified_at     DATETIME NOT NULL
);

-- 4) tbl_lesson 재생성 (PK, instructor_id를 BIGINT로 변경)
DROP TABLE IF EXISTS tbl_lesson;
CREATE TABLE tbl_lesson (
    lesson_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id   BIGINT NOT NULL,
    title           VARCHAR(100) NOT NULL,
    location        VARCHAR(100) NOT NULL,
    lesson_date     DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    max_students    SMALLINT NOT NULL,
    fee             INT NOT NULL,
    content         TEXT,
    status          VARCHAR(20) NOT NULL,
    created_at      DATETIME NOT NULL,
    modified_at     DATETIME NOT NULL
);

-- 5) tbl_enrollment 재생성 (PK, lesson_id, student_id를 BIGINT로 변경)
DROP TABLE IF EXISTS tbl_enrollment;
CREATE TABLE tbl_enrollment (
    enrollment_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id       BIGINT NOT NULL,
    student_id      BIGINT NOT NULL,
    payment_status  VARCHAR(20) NOT NULL,
    requested_at    DATETIME NOT NULL,
    modified_at     DATETIME NOT NULL
);

-- 6) tbl_refresh_token 신규 생성 (Redis 대체, 로그아웃/재발급 시 행 삭제로 무효화)
DROP TABLE IF EXISTS tbl_refresh_token;
CREATE TABLE tbl_refresh_token (
    refresh_token_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id       BIGINT NOT NULL,
    token                VARCHAR(500) NOT NULL,
    expires_at           DATETIME NOT NULL,
    created_at           DATETIME NOT NULL
);
