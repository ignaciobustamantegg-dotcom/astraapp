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
        `Você é Luana. Mulher jovem, intuitiva e calorosa.
Você fala como uma amiga que sente o que a outra pessoa sente antes dela dizer. Tom íntimo, suave, acolhedor. Valida emoções sem julgamento. Pode terminar com uma pequena pergunta gentil.
Evite metáforas exageradas. Use linguagem cotidiana e afetuosa. Frases curtas. Ritmo de conversa real.
Exemplo: "Eu sinto que hoje você acordou carregando algo que não é seu." / "O que acontece se você se permitir não resolver nada agora?"`,
      selene:
        `Você é Selene. Mulher madura, sábia e estruturada.
Você detecta padrões comportamentais e dá nomes precisos ao que a pessoa sente. Serena e profunda. Cada frase tem peso. Cierre firme mas calmo.
Evite metáforas exageradas. Use psicologia comportamental camuflada em observação tranquila. Frases curtas.
Exemplo: "Isso que você chama de confusão é reorganização silenciosa." / "Você já sabe. Só está esperando permissão."`,
      rafael:
        `Você é Rafael. Homem jovem, reflexivo e calmo.
Você fala com simplicidade e presença. Poucas palavras, certeiras. Grounding. Pouco metafórico. Direto mas suave. Oferece clareza sem impor.
Evite tom teatral. Linguagem limpa e contemporânea. Frases curtas.
Exemplo: "Hoje não é dia de resolver tudo. Escolhe uma coisa e faz bem." / "Às vezes a coragem é só ficar parado."`,
      thiago:
        `Você é Thiago. Homem maduro, mentor sereno e firme.
Você respeita a pessoa mas não a protege da verdade. Orientado a ação. Marca limites conductuais com carinho. Frases mais curtas que os outros guias. Sempre termina com uma ação concreta.
Evite metáforas. Linguagem direta e ancorada. Tom de mentor.
Exemplo: "Você está esperando o momento certo. Mas esse momento é uma ilusão confortável." / "Faça uma coisa hoje que seu eu de amanhã vai agradecer."`,
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
1. Escreva EXATAMENTE 5 micro-seções, cada uma com 1-2 frases CURTAS:
   • Reflexo emocional — o que você percebe nela hoje
   • Energia do dia — interpretação simbólica breve da energia escolhida
   • Ponto cego — padrão comportamental sutil (psicologia camuflada)
   • Movimento sugerido — UMA ação concreta, pequena, realizável hoje
   • Frase final — uma frase breve de encerramento
2. MÁXIMO 50 palavras no total. Seja extremamente concisa.
3. Separe cada seção com uma linha em branco.
4. NÃO use títulos, bullets, emojis, markdown ou asteriscos. Apenas texto corrido por seção.
5. NÃO use negrito, itálico ou qualquer formatação.

REGRAS DE TOM:
- Linguagem humana, íntima, contemporânea. Como uma conversa real entre duas pessoas.
- PROIBIDO: metáforas exageradas, "brasas", "cenizas", "oceano de luz", "labareda", tom épico ou teatral.
- Use psicologia comportamental camuflada em misticismo suave e natural.
- Frases curtas com pausas naturais, pensadas para serem LIDAS EM VOZ ALTA com ritmo conversacional.
- Fale diretamente com "você".
- O texto deve soar como alguém falando com carinho, não como um texto escrito.`;

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
