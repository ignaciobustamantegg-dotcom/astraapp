import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateToken(length = 48): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, length);
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
    let body: Record<string, any> | null = null;
    if (req.method === "POST") {
      try { body = await req.json(); } catch { /* fallback to query params */ }
    }

    const params = getParams(req, body);
    console.log("Webhook params:", JSON.stringify(params));

    // Validate token
    const webhookSecret = Deno.env.get("CARTPANDA_WEBHOOK_SECRET");
    if (webhookSecret && params.token !== webhookSecret) {
      console.error("Invalid or missing token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const external_order_id = params.order_id;
    if (!external_order_id) {
      return new Response(JSON.stringify({ error: "Missing order_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const now = new Date().toISOString();
    const eventMeta = { external_order_id, email: params.email };

    // Log webhook received
    await logEvent(supabase, params.session_id, "webhook_received", { ...eventMeta, raw_params: params });

    // Idempotent upsert: check existing order
    const { data: existing } = await supabase
      .from("orders")
      .select("id, access_token, status")
      .eq("external_order_id", external_order_id)
      .maybeSingle();

    let access_token: string;

    if (existing) {
      // Keep existing token (idempotency)
      access_token = existing.access_token || generateToken();
      const updates: Record<string, any> = {
        status: "paid",
        updated_at: now,
        paid_at: now,
        customer_email: params.email || undefined,
        utm_source: params.utm_source,
        utm_medium: params.utm_medium,
        utm_campaign: params.utm_campaign,
        utm_term: params.utm_term,
        utm_content: params.utm_content,
        campaignkey: params.campaignkey,
        cid: params.cid,
        gclid: params.gclid,
        country: params.country,
        amount_net: params.amount_net,
      };
      if (!existing.access_token) updates.access_token = access_token;
      await supabase.from("orders").update(updates).eq("id", existing.id);
    } else {
      access_token = generateToken();
      await supabase.from("orders").insert({
        external_order_id,
        status: "paid",
        customer_email: params.email,
        session_id: params.session_id,
        access_token,
        paid_at: now,
        utm_source: params.utm_source,
        utm_medium: params.utm_medium,
        utm_campaign: params.utm_campaign,
        utm_term: params.utm_term,
        utm_content: params.utm_content,
        campaignkey: params.campaignkey,
        cid: params.cid,
        gclid: params.gclid,
        country: params.country,
        amount_net: params.amount_net,
      });
    }

    // Log lifecycle events
    await logEvent(supabase, params.session_id, "order_paid", eventMeta);
    if (!existing?.access_token) {
      await logEvent(supabase, params.session_id, "token_generated", { ...eventMeta, token_prefix: access_token.slice(0, 8) });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
