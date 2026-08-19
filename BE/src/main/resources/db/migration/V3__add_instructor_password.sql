-- 참고용 마이그레이션 SQL. Flyway 등으로 자동 실행되지 않으며, 실제 적용은 이 작업 범위 밖입니다.
-- 반영 내용:
--   1) tbl_instructor에 password 컬럼 추가 (BCrypt 암호화된 값 저장, 평문 저장 금지)
--
-- 기존 강사 데이터는 비밀번호가 없으므로 NULL 허용으로 추가합니다.
-- 추후 비밀번호 설정 API가 생기면 NOT NULL 전환을 검토합니다.

ALTER TABLE tbl_instructor
    ADD COLUMN password VARCHAR(255) NULL AFTER email;
