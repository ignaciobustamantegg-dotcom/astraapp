import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 32 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_KEYS = new Set(["session_id", "answers"]);

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
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return badReq("body_too_large");

    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return badReq("invalid_json"); }

    if (typeof body !== "object" || body === null || Array.isArray(body)) return badReq("invalid_json");

    for (const k of Object.keys(body)) {
      if (!ALLOWED_KEYS.has(k)) return badReq("unknown_field");
    }

    const { session_id, answers } = body as Record<string, any>;

    if (typeof session_id !== "string" || !UUID_RE.test(session_id)) return badReq("invalid_session_id");
    if (answers === undefined || answers === null || typeof answers !== "object") return badReq("invalid_answers");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    await supabase.from("sessions").upsert({ id: session_id }, { onConflict: "id" });

    const { error } = await supabase.from("quiz_submissions").insert({ session_id, answers_json: answers });
    if (error) throw error;

    await supabase.from("events").insert({ session_id, event_name: "quiz_completed" });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("submit-quiz error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
