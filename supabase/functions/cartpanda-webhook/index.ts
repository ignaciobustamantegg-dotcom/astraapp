import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateAccessToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = Deno.env.get("CARTPANDA_WEBHOOK_SECRET");
    if (webhookSecret) {
      const authHeader = req.headers.get("x-webhook-secret") || req.headers.get("authorization");
      if (authHeader !== webhookSecret) {
        console.error("Invalid webhook secret");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const body = await req.json();
    console.log("Webhook payload:", JSON.stringify(body));

    // Extract fields — adapt to Cartpanda's actual payload structure
    const externalOrderId =
      body.order_id?.toString() ||
      body.id?.toString() ||
      body.data?.order_id?.toString() ||
      body.data?.id?.toString();

    const paymentStatus =
      body.status || body.payment_status || body.data?.status || body.data?.payment_status;

    const customerEmail =
      body.customer?.email || body.email || body.data?.customer?.email;

    const sessionId =
      body.metadata?.session_id ||
      body.data?.metadata?.session_id ||
      body.note_attributes?.session_id ||
      null;

    if (!externalOrderId) {
      console.error("No order ID found in payload");
      return new Response(JSON.stringify({ error: "Missing order ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const isPaid = ["paid", "approved", "completed", "confirmed"].includes(
      paymentStatus?.toLowerCase() ?? ""
    );

    // Check if order exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, access_token, status")
      .eq("external_order_id", externalOrderId)
      .maybeSingle();

    const ttlDays = parseInt(Deno.env.get("TOKEN_TTL_DAYS") || "90", 10);
    const tokenExpiresAt = new Date(Date.now() + ttlDays * 86400000).toISOString();

    if (existingOrder) {
      // Update existing order
      const updateData: Record<string, unknown> = {
        status: isPaid ? "paid" : paymentStatus?.toLowerCase() ?? existingOrder.status,
        customer_email: customerEmail || undefined,
      };
      if (isPaid) {
        updateData.paid_at = new Date().toISOString();
        if (!existingOrder.access_token) {
          updateData.access_token = generateAccessToken();
          updateData.token_expires_at = tokenExpiresAt;
        }
      }
      await supabase
        .from("orders")
        .update(updateData)
        .eq("id", existingOrder.id);
    } else {
      // Create new order
      const insertData: Record<string, unknown> = {
        external_order_id: externalOrderId,
        session_id: sessionId,
        provider: "cartpanda",
        status: isPaid ? "paid" : (paymentStatus?.toLowerCase() ?? "pending"),
        customer_email: customerEmail,
      };
      if (isPaid) {
        insertData.paid_at = new Date().toISOString();
        insertData.access_token = generateAccessToken();
        insertData.token_expires_at = tokenExpiresAt;
      }
      await supabase.from("orders").insert(insertData);
    }

    // Track event
    if (sessionId) {
      await supabase.from("events").insert({
        session_id: sessionId,
        event_name: isPaid ? "purchase_confirmed" : "webhook_received",
        event_payload: { external_order_id: externalOrderId, status: paymentStatus },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
