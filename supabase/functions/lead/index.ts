import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { session_id, email, whatsapp, utm_source, utm_medium, utm_campaign, utm_content, utm_term, variant, referrer, landing_path, user_agent } =
      await req.json();

    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email && !whatsapp) {
      return new Response(JSON.stringify({ error: "email or whatsapp required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert session
    const { error: sessErr } = await supabase
      .from("sessions")
      .upsert(
        {
          id: session_id,
          variant,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          referrer,
          landing_path,
          user_agent,
        },
        { onConflict: "id" }
      );

    if (sessErr) {
      console.error("Session upsert error:", sessErr);
    }

    // Insert lead
    const { error: leadErr } = await supabase
      .from("leads")
      .insert({ session_id, email, whatsapp });

    if (leadErr) {
      console.error("Lead insert error:", leadErr);
      return new Response(JSON.stringify({ error: leadErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Track event
    await supabase
      .from("events")
      .insert({ session_id, event_name: "lead_captured", event_payload: { email, whatsapp } });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Lead error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
