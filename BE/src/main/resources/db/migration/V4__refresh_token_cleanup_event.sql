-- 참고용 마이그레이션 SQL. Flyway 등으로 자동 실행되지 않으며, 실제 적용은 이 작업 범위 밖입니다.
-- 반영 내용:
--   1) 만료된 tbl_refresh_token row를 매일 자정에 삭제하는 DB 이벤트 생성
--
-- 실행 전 event_scheduler가 켜져 있어야 합니다.
-- RDS는 SET GLOBAL event_scheduler = ON 권한이 없으므로,
-- 파라미터 그룹에서 event_scheduler = ON 으로 설정한 뒤 재부팅이 필요합니다.

CREATE EVENT IF NOT EXISTS evt_cleanup_expired_refresh_token
    ON SCHEDULE EVERY 1 DAY
    STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY)
    DO
        DELETE FROM tbl_refresh_token WHERE expires_at < NOW();
