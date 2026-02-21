-- Add user_id column to orders table to link purchases with user accounts
ALTER TABLE public.orders
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for faster lookups by user
CREATE INDEX idx_orders_user_id ON public.orders(user_id);