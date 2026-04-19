-- 기존의 전체 개방 (INSERT/UPDATE/DELETE) Policy 삭제
DROP POLICY IF EXISTS "Anyone can insert app_state" ON public.app_state;
DROP POLICY IF EXISTS "Anyone can update app_state" ON public.app_state;
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;

-- 인증된 관리자만 쓰기/수정/삭제가 가능하도록 새로운 Policy 추가
CREATE POLICY "Authenticated users can insert app_state" ON public.app_state FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update app_state" ON public.app_state FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE TO authenticated USING (true);
