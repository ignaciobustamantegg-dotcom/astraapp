import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { token, user_id } = await req.json();

    if (!token || typeof token !== "string" || token.length > 128) {
      return new Response(JSON.stringify({ error: "invalid_token" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!user_id || typeof user_id !== "string" || !/^[0-9a-f-]{36}$/.test(user_id)) {
      return new Response(JSON.stringify({ error: "invalid_user_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { error } = await supabase
      .from("orders")
      .update({ user_id })
      .eq("access_token", token)
      .eq("status", "paid")
      .is("user_id", null);

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("link-order error:", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
