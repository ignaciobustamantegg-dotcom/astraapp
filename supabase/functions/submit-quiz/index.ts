import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { session_id, answers } = await req.json();
    if (!session_id || !answers) return new Response(JSON.stringify({ error: "session_id and answers required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Upsert session
    await supabase.from("sessions").upsert({ id: session_id }, { onConflict: "id" });

    // Insert quiz submission
    const { error } = await supabase.from("quiz_submissions").insert({ session_id, answers_json: answers });
    if (error) throw error;

    // Track event
    await supabase.from("events").insert({ session_id, event_name: "quiz_completed" });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("submit-quiz error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
