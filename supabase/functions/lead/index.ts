import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse, getClientIp } from "../_shared/rate-limit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 16 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_KEYS = new Set([
  "session_id", "email", "whatsapp",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "variant", "referrer", "landing_path", "user_agent",
]);

function badReq(code: string) {
  return new Response(JSON.stringify({ error: code }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function optStr(val: unknown, max: number): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string") return undefined as any; // signal invalid
  return val.slice(0, max);
}

function validateWhatsapp(val: unknown): string | null | false {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string") return false;
  const digits = val.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return false;
  return digits;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  // Rate limit: 10 requests/min per IP for lead submissions
  if (!checkRateLimit(getClientIp(req), 10)) return rateLimitResponse(corsHeaders);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return badReq("body_too_large");

    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return badReq("invalid_json"); }

    if (typeof body !== "object" || body === null || Array.isArray(body)) return badReq("invalid_json");

    for (const k of Object.keys(body)) {
      if (!ALLOWED_KEYS.has(k)) return badReq("unknown_field");
    }

    const session_id = body.session_id;
    if (typeof session_id !== "string" || !UUID_RE.test(session_id)) return badReq("invalid_session_id");

    // Email validation
    let email: string | null = null;
    if (body.email !== undefined && body.email !== null) {
      if (typeof body.email !== "string") return badReq("invalid_email");
      email = body.email.trim().toLowerCase();
      if (email.length > 254 || !EMAIL_RE.test(email)) return badReq("invalid_email");
    }

    // WhatsApp validation
    const whatsapp = validateWhatsapp(body.whatsapp);
    if (whatsapp === false) return badReq("invalid_whatsapp");

    if (!email && !whatsapp) return badReq("email_or_whatsapp_required");

    // String fields with max lengths
    const utm_source = optStr(body.utm_source, 250);
    const utm_medium = optStr(body.utm_medium, 250);
    const utm_campaign = optStr(body.utm_campaign, 250);
    const utm_content = optStr(body.utm_content, 250);
    const utm_term = optStr(body.utm_term, 250);
    const variant = optStr(body.variant, 250);
    const referrer = optStr(body.referrer, 250);
    const landing_path = optStr(body.landing_path, 250);
    const user_agent = optStr(body.user_agent, 1024);

    // Check none returned undefined (invalid type)
    const opts = [utm_source, utm_medium, utm_campaign, utm_content, utm_term, variant, referrer, landing_path, user_agent];
    if (opts.some((v) => v === undefined)) return badReq("invalid_field_type");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    await supabase.from("sessions").upsert(
      { id: session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, variant, referrer, landing_path, user_agent },
      { onConflict: "id" }
    );

    const { error: leadErr } = await supabase.from("leads").insert({ session_id, email, whatsapp });
    if (leadErr) throw leadErr;

    await supabase.from("events").insert({ session_id, event_name: "lead_captured", event_payload: { email: !!email, whatsapp: !!whatsapp } });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("lead error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
