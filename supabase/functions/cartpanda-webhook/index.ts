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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    // Validate webhook secret
    const webhookSecret = Deno.env.get("CARTPANDA_WEBHOOK_SECRET");
    const authHeader = req.headers.get("x-webhook-secret") || req.headers.get("authorization");
    if (webhookSecret && authHeader !== webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      console.error("Invalid webhook secret");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    console.log("Webhook payload:", JSON.stringify(body));

    // Extract fields - adapt to Cartpanda's actual payload structure
    const external_order_id = body.id?.toString() || body.order_id?.toString() || body.external_id?.toString();
    if (!external_order_id) {
      return new Response(JSON.stringify({ error: "Missing order ID" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const status = body.status || body.payment_status || body.financial_status;
    const isPaid = ["paid", "approved", "completed", "captured"].includes(status?.toLowerCase?.() || "");
    const customer_email = body.customer?.email || body.email || body.buyer_email || null;
    const session_id = body.metadata?.session_id || body.note_attributes?.find?.((n: any) => n.name === "session_id")?.value || body.session_id || null;

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Check if order exists
    const { data: existing } = await supabase.from("orders").select("id, access_token, status").eq("external_order_id", external_order_id).maybeSingle();

    if (existing) {
      // Update existing order
      const updates: Record<string, any> = { status: isPaid ? "paid" : status?.toLowerCase() || existing.status, updated_at: new Date().toISOString() };
      if (isPaid && !existing.access_token) {
        updates.access_token = generateToken();
        updates.paid_at = new Date().toISOString();
      }
      if (customer_email) updates.customer_email = customer_email;

      await supabase.from("orders").update(updates).eq("id", existing.id);
    } else {
      // Insert new order
      const newOrder: Record<string, any> = {
        external_order_id,
        status: isPaid ? "paid" : status?.toLowerCase() || "pending",
        customer_email,
        session_id,
      };
      if (isPaid) {
        newOrder.access_token = generateToken();
        newOrder.paid_at = new Date().toISOString();
      }
      await supabase.from("orders").insert(newOrder);
    }

    // Track event
    if (session_id) {
      await supabase.from("events").insert({ session_id, event_name: "purchase_webhook", event_payload: { external_order_id, status, isPaid } });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("webhook error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
