
-- App state singleton table
CREATE TABLE public.app_state (
  id integer PRIMARY KEY,
  view_mode text NOT NULL DEFAULT 'TIMETABLE',
  announcement text NOT NULL DEFAULT '',
  announcement_timestamp bigint NOT NULL DEFAULT 0,
  bonus_score_a integer NOT NULL DEFAULT 0,
  bonus_score_b integer NOT NULL DEFAULT 0
);

-- Events table
CREATE TABLE public.events (
  id text PRIMARY KEY,
  name text NOT NULL,
  time text NOT NULL,
  icon text NOT NULL DEFAULT 'Circle',
  status text NOT NULL DEFAULT 'UPCOMING',
  team_a text,
  team_b text,
  score_a integer NOT NULL DEFAULT 0,
  score_b integer NOT NULL DEFAULT 0,
  actual_start_time bigint
);

-- Disable RLS for public display (no auth needed)
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Anyone can read app_state" ON public.app_state FOR SELECT USING (true);
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);

-- Allow anyone to insert/update (admin will be added later)
CREATE POLICY "Anyone can insert app_state" ON public.app_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update app_state" ON public.app_state FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Seed initial app state
INSERT INTO public.app_state (id, view_mode, announcement, announcement_timestamp, bonus_score_a, bonus_score_b)
VALUES (1, 'TIMETABLE', '🎉 제25회 체육대회에 오신 것을 환영합니다! 안전하고 즐거운 대회가 되길 바랍니다.', 0, 0, 0);
