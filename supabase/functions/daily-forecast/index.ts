import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    // Check if forecast already exists today
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("daily_forecasts")
      .select("forecast_text, emotion, energy, intention, guide")
      .eq("user_id", userId)
      .eq("forecast_date", today)
      .maybeSingle();

    if (existing?.forecast_text) {
      return new Response(
        JSON.stringify({ already_exists: true, text: existing.forecast_text, guide: existing.guide }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse body
    const { emotion, energy, intention, guide, profile } = await req.json();
    if (!emotion || !energy || !intention || !guide) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build system prompt per guide personality
    const guidePersonalities: Record<string, string> = {
      luana:
        "Você é Luana, uma guia espiritual jovem, vibrante e acolhedora. Fala com carinho e entusiasmo, usando metáforas de luz, flores e natureza. Tom otimista e encorajador.",
      selene:
        "Você é Selene, uma guia espiritual madura e mística. Fala com profundidade e serenidade, usando referências à lua, aos ciclos e às estrelas. Tom introspectivo e sábio.",
      rafael:
        "Você é Rafael, um guia espiritual jovem e direto. Fala com clareza e força, usando metáforas de fogo, caminho e coragem. Tom motivador e protetor.",
      thiago:
        "Você é Thiago, um guia espiritual maduro e filosófico. Fala com calma e profundidade, usando referências a raízes, montanhas e tempo. Tom reflexivo e ancorado.",
    };

    const personality = guidePersonalities[guide.toLowerCase()] || guidePersonalities.luana;

    let profileContext = "";
    if (profile) {
      profileContext = `\n\nVocê conhece o perfil emocional desta pessoa:\n- Arquétipo: ${profile.archetype || "?"}\n- Sentimento dominante: ${profile.sentimento || "?"}\n- Medo principal: ${profile.medoPrincipal || "?"}\n- Bloqueio energético: ${profile.bloqueio || "?"}`;
    }

    const systemPrompt = `${personality}${profileContext}

A pessoa escolheu:
- Estado emocional: ${emotion}
- Energia dominante: ${energy}
- Intenção do dia: ${intention}

Gere uma previsão diária personalizada em português brasileiro. Deve ter 2-3 parágrafos curtos (máximo 150 palavras total). Seja específica para as escolhas dela. Inclua uma orientação prática para o dia. Fale diretamente com ela usando "você".`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Gere minha previsão do dia de hoje." },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const forecastText = aiData.choices?.[0]?.message?.content || "";

    // Save to DB
    const { error: insertError } = await supabase.from("daily_forecasts").insert({
      user_id: userId,
      forecast_date: today,
      emotion,
      energy,
      intention,
      guide: guide.toLowerCase(),
      forecast_text: forecastText,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      // If duplicate, fetch existing
      if (insertError.code === "23505") {
        const { data: dup } = await supabase
          .from("daily_forecasts")
          .select("forecast_text, guide")
          .eq("user_id", userId)
          .eq("forecast_date", today)
          .single();
        return new Response(
          JSON.stringify({ already_exists: true, text: dup?.forecast_text, guide: dup?.guide }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ already_exists: false, text: forecastText, guide: guide.toLowerCase() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-forecast error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
