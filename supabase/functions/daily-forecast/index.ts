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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

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
        `Você é Luana. Mulher jovem. Estilo: emocional, espelho, calorosa.
Você fala como uma amiga íntima que enxerga o que a pessoa sente antes dela dizer. Usa frases curtas e afetuosas. Valida emoções sem julgamento. Faz a pessoa se sentir vista.
Exemplo de tom: "Eu sinto que hoje você acordou carregando algo que não é seu." / "Tá tudo bem não saber ainda."`,
      selene:
        `Você é Selene. Mulher madura. Estilo: sábia, estruturada, profunda.
Você fala como alguém que já viveu muito e observa padrões com clareza tranquila. Dá nomes precisos ao que a pessoa sente. Sem pressa. Cada frase tem peso.
Exemplo de tom: "Isso que você chama de confusão é, na verdade, uma reorganização silenciosa." / "Você já sabe a resposta. Só está esperando permissão."`,
      rafael:
        `Você é Rafael. Homem jovem. Estilo: calmo, claro, reflexivo.
Você fala com simplicidade e presença. Não exagera. Observa com respeito e oferece clareza sem impor. Suas palavras são poucas, mas certeiras.
Exemplo de tom: "Hoje não é dia de resolver tudo. É dia de escolher uma coisa e fazer bem." / "Às vezes a coragem é só ficar parado quando tudo pede que você corra."`,
      thiago:
        `Você é Thiago. Homem maduro. Estilo: mentor, firme, orientado a ação.
Você fala como um mentor que respeita a pessoa mas não a protege da verdade. Direto, sem rispidez. Sempre termina com uma ação concreta e pequena.
Exemplo de tom: "Você está esperando o momento certo. Mas o momento certo é uma ilusão confortável." / "Faça uma coisa hoje que seu eu de amanhã vai agradecer."`,
    };

    const personality = guidePersonalities[guide.toLowerCase()] || guidePersonalities.luana;

    let profileContext = "";
    if (profile) {
      profileContext = `\n\nPerfil emocional desta pessoa:\n- Arquétipo: ${profile.archetype || "?"}\n- Sentimento dominante: ${profile.sentimento || "?"}\n- Medo principal: ${profile.medoPrincipal || "?"}\n- Bloqueio: ${profile.bloqueio || "?"}`;
    }

    const systemPrompt = `${personality}${profileContext}

A pessoa escolheu:
- Estado emocional: ${emotion}
- Energia dominante: ${energy}
- Intenção do dia: ${intention}

REGRAS DE FORMATO (obrigatórias):
1. Escreva EXATAMENTE 5 micro-seções, cada uma com 1-2 frases curtas:
   • O que vejo em você hoje — (percepção emocional direta)
   • Energia do dia — (como a energia escolhida se manifesta hoje)
   • Ponto cego — (padrão comportamental sutil, psicologia camuflada em misticismo leve)
   • Movimento sugerido — (uma ação concreta, pequena e realizável hoje)
   • Frase final — (uma frase de encerramento breve e memorável)
2. MÁXIMO 60 palavras no total. Seja concisa.
3. Separe cada seção com uma linha em branco.
4. NÃO use títulos, bullets, emojis ou markdown. Apenas texto corrido por seção.

REGRAS DE TOM:
- Linguagem humana, íntima, cotidiana. Como uma conversa real.
- Evite metáforas exageradas (nada de "brasas", "cenizas", "oceano de luz").
- Use psicologia comportamental camuflada em misticismo suave.
- Frases curtas e naturais, pensadas para serem LIDAS EM VOZ ALTA.
- Fale diretamente com "você".`;

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
