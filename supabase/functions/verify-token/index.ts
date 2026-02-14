import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return new Response(JSON.stringify({ error: "token required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data, error } = await supabase.from("orders").select("session_id, external_order_id, status, token_expires_at").eq("access_token", token).maybeSingle();

    if (error) throw error;

    if (!data || data.status !== "paid") {
      return new Response(JSON.stringify({ ok: false }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check expiration
    if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
      return new Response(JSON.stringify({ ok: false, reason: "expired" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Log access granted
    if (data.session_id) {
      try {
        await supabase.from("events").insert({
          session_id: data.session_id,
          event_name: "app_access_granted",
          event_payload: { external_order_id: data.external_order_id },
        });
      } catch {}
    }

    return new Response(JSON.stringify({ ok: true, session_id: data.session_id, external_order_id: data.external_order_id }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("verify-token error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
