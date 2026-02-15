

# Fix: Force Checkout URL into Build

## Problem
The secret `VITE_CARTPANDA_CHECKOUT_URL` was added after the last build. Since Vite replaces `import.meta.env.VITE_*` at **build time**, the running app still has an empty string.

## Solution
Make a trivial no-op edit to `src/pages/Checkout.tsx` (e.g., add a comment) to trigger a rebuild. The new build will embed the env var correctly.

No logic changes, no UI changes -- just a rebuild trigger.

## Technical Details

**File:** `src/pages/Checkout.tsx`
- Add a timestamp comment at the top to force Vite to rebuild with the now-configured `VITE_CARTPANDA_CHECKOUT_URL` secret.

After rebuild, line 6 (`const CHECKOUT_URL = import.meta.env.VITE_CARTPANDA_CHECKOUT_URL || ...`) will resolve to the configured URL instead of falling through to the empty string.

