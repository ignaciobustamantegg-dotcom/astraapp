

# Funnel Hardening Fixes

Six targeted fixes to improve checkout URL construction, tracking alignment, ad attribution capture, webhook status mapping, and post-checkout safety. No UI/styling changes.

---

## Fix 1: Checkout URL Construction

**Files:** `src/pages/Checkout.tsx`

Replace string concatenation (`CHECKOUT_URL + "?sid=..."`) with the `URL` API so it works whether `CHECKOUT_URL` already has query params or not.

```text
Before:  const params = new URLSearchParams({ sid, ...utms });
         const url = `${CHECKOUT_URL}?${params.toString()}`;

After:   const url = new URL(CHECKOUT_URL);
         url.searchParams.set("sid", sid);
         // set each UTM + click ID param individually
```

Also read `quiz_click_ids` from localStorage and append those (`fbclid`, `ttclid`, `gclid`, `cid`, `campaignkey`) to the checkout URL.

---

## Fix 2: Tracking Event Alignment

**Files:** `src/pages/Checkout.tsx`, `src/components/quiz/ResultsScreen.tsx`

- Replace `trackEvent("click_checkout", ...)` with `trackEvent("initiate_checkout", ...)`
- Replace `trackEvent("click_checkout_from_results")` with `trackEvent("checkout_redirect")`
- Both `initiate_checkout` and `checkout_redirect` are already in the `ALLOWED_EVENTS` whitelist in `track/index.ts` -- no backend change needed.

---

## Fix 3: Capture Click IDs for Ads Attribution

**File:** `src/lib/session.ts`

Extend `captureUtms()` to also capture `fbclid`, `ttclid`, `gclid`, `cid`, `campaignkey` from the URL query string and persist them to `localStorage` under `quiz_click_ids`. Add a new exported helper `getClickIds()` for retrieval.

```text
const CLICK_ID_PARAMS = ["fbclid", "ttclid", "gclid", "cid", "campaignkey"];
// captured on landing, stored in localStorage("quiz_click_ids")
```

---

## Fix 4: Webhook Status Mapping

**File:** `supabase/functions/cartpanda-webhook/index.ts`

Replace the hardcoded `status: "paid"` with a mapping function:

```text
function mapStatus(raw: string | null): string {
  if (!raw) return "pending";
  const s = raw.toLowerCase();
  if (["paid","approved","completed"].includes(s)) return "paid";
  if (["refunded","chargeback"].includes(s)) return "refunded";
  if (["canceled","cancelled"].includes(s)) return "canceled";
  return "pending";
}
```

Key logic changes:
- Use the mapped status for both insert and update.
- Only generate/assign `access_token` when mapped status is `"paid"`.
- On `"refunded"` or `"canceled"`, nullify `access_token` and `token_expires_at` to revoke access (row preserved).
- Add `"completed"` and `"cancelled"` to `VALID_STATUSES`.

---

## Fix 5: Post-Checkout Safety Check

**File:** `src/pages/PostCheckout.tsx`

Currently, if `orderId` is missing, the code sets status to `"timeout"` which is misleading. Change to:
- If `orderId` is empty, set status to `"error"` immediately with a clear message.
- Add `console.warn("PostCheckout: order_id missing from query params")`.

---

## Summary of Changed Files

| File | Fix |
|---|---|
| `src/lib/session.ts` | Add click ID capture (#3) |
| `src/pages/Checkout.tsx` | URL construction (#1) + event name (#2) + click IDs (#3) |
| `src/components/quiz/ResultsScreen.tsx` | Event name alignment (#2) |
| `supabase/functions/cartpanda-webhook/index.ts` | Status mapping (#4) |
| `src/pages/PostCheckout.tsx` | Missing order_id guard (#5) |

No UI/styling changes. No new dependencies. Backward compatible.

