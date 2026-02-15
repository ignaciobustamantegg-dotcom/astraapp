import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 32 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = new Set(["paid", "approved", "refunded", "chargeback", "canceled", "pending"]);

function generateToken(length = 48): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, length);
}

function badReq(code: string) {
  return new Response(JSON.stringify({ error: code }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function safeStr(val: unknown, max: number): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string" && typeof val !== "number") return null;
  return String(val).slice(0, max);
}

function getParams(req: Request, body: Record<string, any> | null): Record<string, string | null> {
  const url = new URL(req.url);
  const get = (key: string) => body?.[key]?.toString() || url.searchParams.get(key) || null;

  return {
    order_id: get("order_id") || get("id") || get("external_id"),
    email: get("email") || get("customer_email") || get("buyer_email"),
    total_price: get("total_price"),
    amount_net: get("amount_net"),
    currency: get("currency"),
    product_id: get("product_id"),
    product_name: get("product_name"),
    order_type: get("order_type"),
    upsell_no: get("upsell_no"),
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
    campaignkey: get("campaignkey"),
    cid: get("cid"),
    gclid: get("gclid"),
    is_test: get("is_test"),
    datetime_unix: get("datetime_unix"),
    country: get("country"),
    status: get("status") || get("payment_status") || get("financial_status"),
    session_id: get("session_id"),
    token: get("token"),
  };
}

async function logEvent(supabase: any, session_id: string | null, event_name: string, payload: any) {
  if (!session_id) return;
  try {
    await supabase.from("events").insert({ session_id, event_name, event_payload: payload });
  } catch (e) {
    console.warn(`Failed to log event ${event_name}:`, e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ──────────────────────────────────────────────────────────────────
    // AUTH IS MANDATORY. The webhook MUST be authenticated on every
    // request. If the secret is not configured the endpoint fails
    // closed (503). If the secret is wrong it returns 401. No DB
    // operations happen in either case.
    //
    // Previous security scanner warning "webhook_weak_auth" is OUTDATED
    // — authentication was made unconditional in this version.
    //
    // CartPanda supports sending the secret as a query-param (`token`).
    // We also accept the header `X-Cartpanda-Webhook-Secret` so either
    // method works. Header is preferred when the caller supports it.
    // ──────────────────────────────────────────────────────────────────
    const webhookSecret = Deno.env.get("CARTPANDA_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("CARTPANDA_WEBHOOK_SECRET not configured — rejecting request");
      return new Response(JSON.stringify({ error: "configuration_error" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Body size check (before JSON parse)
    let body: Record<string, any> | null = null;
    if (req.method === "POST") {
      const raw = await req.text();
      if (raw.length > MAX_BODY_BYTES) return badReq("body_too_large");
      try { body = JSON.parse(raw); } catch { /* fallback to query params */ }
    }

    const params = getParams(req, body);

    // Prefer header, fall back to query-param `token`
    const providedSecret =
      req.headers.get("x-cartpanda-webhook-secret") || params.token;

    if (providedSecret !== webhookSecret) {
      console.error("Invalid or missing webhook secret");
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate order_id
    const external_order_id = safeStr(params.order_id, 64);
    if (!external_order_id) return badReq("missing_order_id");

    // Validate email format if provided
    let email = safeStr(params.email, 254);
    if (email) {
      email = email.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) email = null;
    }

    // Validate status if provided
    const rawStatus = safeStr(params.status, 32);
    if (rawStatus && !VALID_STATUSES.has(rawStatus.toLowerCase())) {
      return badReq("invalid_status");
    }

    // Validate session_id format if provided
    const session_id = safeStr(params.session_id, 128);
    if (session_id && !UUID_RE.test(session_id)) {
      return badReq("invalid_session_id");
    }

    // Sanitize remaining fields
    const utm_source = safeStr(params.utm_source, 250);
    const utm_medium = safeStr(params.utm_medium, 250);
    const utm_campaign = safeStr(params.utm_campaign, 250);
    const utm_term = safeStr(params.utm_term, 250);
    const utm_content = safeStr(params.utm_content, 250);
    const campaignkey = safeStr(params.campaignkey, 250);
    const cid = safeStr(params.cid, 250);
    const gclid = safeStr(params.gclid, 250);
    const country = safeStr(params.country, 64);
    const amount_net = safeStr(params.amount_net, 32);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const now = new Date().toISOString();
    // Set token expiration to 1 year from purchase for lifecycle management
    const tokenExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const eventMeta = { external_order_id, email };

    await logEvent(supabase, session_id, "webhook_received", { ...eventMeta, status: rawStatus });

    const { data: existing } = await supabase
      .from("orders")
      .select("id, access_token, status")
      .eq("external_order_id", external_order_id)
      .maybeSingle();

    let access_token: string;

    if (existing) {
      access_token = existing.access_token || generateToken();
      const updates: Record<string, any> = {
        status: "paid",
        updated_at: now,
        paid_at: now,
        customer_email: email || undefined,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        campaignkey, cid, gclid, country, amount_net,
      };
      if (!existing.access_token) {
        updates.access_token = access_token;
        updates.token_expires_at = tokenExpiresAt;
      }
      await supabase.from("orders").update(updates).eq("id", existing.id);
    } else {
      access_token = generateToken();
      await supabase.from("orders").insert({
        external_order_id, status: "paid", customer_email: email,
        session_id, access_token, paid_at: now,
        token_expires_at: tokenExpiresAt,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        campaignkey, cid, gclid, country, amount_net,
      });
    }

    await logEvent(supabase, session_id, "order_paid", eventMeta);
    if (!existing?.access_token) {
      await logEvent(supabase, session_id, "token_generated", { ...eventMeta, token_prefix: access_token.slice(0, 8) });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
