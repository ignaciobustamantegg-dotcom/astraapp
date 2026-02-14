
-- Add UTM and tracking fields to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_term text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_content text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS campaignkey text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cid text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS gclid text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS amount_net text;
