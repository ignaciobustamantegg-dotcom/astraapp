
-- ============================================================
-- 1) FIX: Recreate trigger for handle_new_user on auth.users
-- ============================================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2) NEW TABLE: sessions (anonymous tracking)
-- ============================================================
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  variant text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_path text,
  user_agent text
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from edge functions via service role, or anon for session creation)
CREATE POLICY "Allow anon insert sessions"
  ON public.sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Block all client reads — only service_role (edge functions) can read
CREATE POLICY "Block client select sessions"
  ON public.sessions FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE INDEX idx_sessions_created_at ON public.sessions (created_at);

-- ============================================================
-- 3) NEW TABLE: quiz_submissions
-- ============================================================
CREATE TABLE public.quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
  answers_json jsonb NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert quiz_submissions"
  ON public.quiz_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Block client select quiz_submissions"
  ON public.quiz_submissions FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE INDEX idx_quiz_submissions_session_id ON public.quiz_submissions (session_id);

-- ============================================================
-- 4) NEW TABLE: leads
-- ============================================================
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
  email text,
  whatsapp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Block client select leads"
  ON public.leads FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE INDEX idx_leads_session_id ON public.leads (session_id);

-- Validation trigger: at least email or whatsapp must be provided
CREATE OR REPLACE FUNCTION public.validate_lead_contact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL AND NEW.whatsapp IS NULL THEN
    RAISE EXCEPTION 'Either email or whatsapp must be provided';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_lead_contact
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_lead_contact();

-- ============================================================
-- 5) NEW TABLE: orders
-- ============================================================
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE RESTRICT,
  provider text NOT NULL DEFAULT 'cartpanda',
  external_order_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  customer_email text,
  paid_at timestamptz,
  access_token text UNIQUE,
  token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- No client access at all — managed exclusively via edge functions (service_role)
CREATE POLICY "Block client select orders"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Block client insert orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE INDEX idx_orders_external_order_id ON public.orders (external_order_id);
CREATE INDEX idx_orders_session_id ON public.orders (session_id);
CREATE INDEX idx_orders_status_paid ON public.orders (status, paid_at);
CREATE INDEX idx_orders_access_token ON public.orders (access_token);

-- updated_at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6) NEW TABLE: events (analytics)
-- ============================================================
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
  event_name text NOT NULL,
  event_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert events"
  ON public.events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Block client select events"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE INDEX idx_events_session_id_created ON public.events (session_id, created_at);
