import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 16 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_EVENTS = new Set([
  "page_view", "start_quiz", "answer", "complete_quiz",
  "submit_lead_step1", "submit_lead_step2",
  "view_checkout", "initiate_checkout", "purchase", "error",
  "quiz_started", "quiz_completed", "lead_captured",
  "checkout_redirect", "app_access_granted", "webhook_received",
  "order_paid", "token_generated",
]);

const ALLOWED_KEYS = new Set(["session_id", "event_name", "payload"]);

function badReq(code: string) {
  return new Response(JSON.stringify({ error: code }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    // Body size check
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return badReq("body_too_large");

    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return badReq("invalid_json"); }

    if (typeof body !== "object" || body === null || Array.isArray(body)) return badReq("invalid_json");

    // Reject unknown keys
    for (const k of Object.keys(body)) {
      if (!ALLOWED_KEYS.has(k)) return badReq("unknown_field");
    }

    const { session_id, event_name, payload } = body as Record<string, any>;

    if (typeof session_id !== "string" || !UUID_RE.test(session_id)) return badReq("invalid_session_id");
    if (typeof event_name !== "string" || !ALLOWED_EVENTS.has(event_name)) return badReq("invalid_event_name");
    if (payload !== undefined && payload !== null && typeof payload !== "object") return badReq("invalid_payload");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    await supabase.from("sessions").upsert({ id: session_id }, { onConflict: "id" });
    await supabase.from("events").insert({ session_id, event_name, event_payload: payload || null });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("track error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
