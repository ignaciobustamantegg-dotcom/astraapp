
-- 1) events: Replace WITH CHECK(true) with session_id NOT NULL + event_name length check
DROP POLICY "Allow anon insert events" ON public.events;
CREATE POLICY "Allow anon insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL
    AND event_name IS NOT NULL
    AND length(event_name) <= 64
  );

-- 2) leads: Replace WITH CHECK(true) with session_id NOT NULL + contact required
DROP POLICY "Allow anon insert leads" ON public.leads;
CREATE POLICY "Allow anon insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL
    AND (email IS NOT NULL OR whatsapp IS NOT NULL)
    AND (email IS NULL OR length(email) <= 254)
    AND (whatsapp IS NULL OR length(whatsapp) <= 13)
  );

-- 3) quiz_submissions: Replace WITH CHECK(true) with session_id NOT NULL + answers required
DROP POLICY "Allow anon insert quiz_submissions" ON public.quiz_submissions;
CREATE POLICY "Allow anon insert quiz_submissions"
  ON public.quiz_submissions
  FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL
    AND answers_json IS NOT NULL
  );

-- 4) sessions: Replace WITH CHECK(true) with id NOT NULL
DROP POLICY "Allow anon insert sessions" ON public.sessions;
CREATE POLICY "Allow anon insert sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (
    id IS NOT NULL
  );
