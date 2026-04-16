-- ① 실제 컬럼 존재 여부 확인 (먼저 실행)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'events'
ORDER BY ordinal_position;

-- ② 컬럼 추가 (위 결과에 duration/set_duration/set_start_time 이 없을 때 실행)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS set_duration INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS set_start_time BIGINT DEFAULT NULL;

-- ③ 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';
