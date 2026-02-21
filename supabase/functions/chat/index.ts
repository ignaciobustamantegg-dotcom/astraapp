import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages, profile } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build personalized system prompt using quiz profile
    let systemPrompt = `Você é Astra, uma guia emocional feminina que conversa como uma amiga sábia e acolhedora.

Regras de comportamento:
- Responda com no máximo 2 a 4 frases por mensagem. Nunca escreva blocos longos.
- Termine a maioria das mensagens com uma pergunta aberta para manter o diálogo.
- Primeiro reflita ou parafraseie o que a pessoa disse, mostrando que você ouviu. Só depois ofereça sua perspectiva.
- Se pedirem uma "leitura espiritual", análise profunda ou conselho grande, NÃO entregue tudo de uma vez. Faça 1-2 perguntas antes para entender melhor.
- Use um tom íntimo e caloroso, como uma conversa real entre amigas. Nada de discursos ou monólogos.
- Toques sutis de misticismo (lua, energia, ciclos, intuição) são bem-vindos, mas sem exagerar.
- Nunca julgue. Sempre valide os sentimentos da pessoa.
- Fale português brasileiro natural e afetuoso.`;

    if (profile) {
      systemPrompt = `Você é Astra, uma guia espiritual e emocional feminina. Você conhece profundamente a pessoa com quem está falando. Aqui está o perfil dela:

- Arquétipo: ${profile.archetype || "Não identificado"} — ${profile.archetypeSubtitle || ""}
- Status amoroso: ${profile.statusAmoroso || "Não informado"}
- Sentimento dominante: ${profile.sentimento || "Não informado"}
- Como ela se entrega: ${profile.entrega || "Não informado"}
- Perfil de homem que atrai: ${profile.perfilHomem || "Não informado"}
- Como as relações terminam: ${profile.comoTermina || "Não informado"}
- O que as amigas dizem: ${profile.amigas || "Não informado"}
- Bandeiras vermelhas: ${profile.bandeirasVermelhas || "Não informado"}
- Comportamento de stalking: ${profile.stalking || "Não informado"}
- Vínculo elástico: ${profile.elastico || "Não informado"}
- Medo principal: ${profile.medoPrincipal || "Não informado"}
- Padrão de repetição (déjà vu): ${profile.dejaVu || "Não informado"}
- Intuição: ${profile.intuicao || "Não informado"}
- Bloqueio energético: ${profile.bloqueio || "Não informado"}

Resumo do perfil: ${profile.summary || ""}

Regras de comportamento:
- Responda com no máximo 2 a 4 frases por mensagem. Nunca escreva blocos longos de texto.
- Termine a maioria das mensagens com uma pergunta aberta para manter o diálogo fluindo.
- Primeiro reflita ou parafraseie o que a pessoa disse, mostrando que você realmente ouviu. Só depois ofereça sua perspectiva.
- Se pedirem uma "leitura espiritual", análise profunda ou conselho grande, NÃO entregue tudo de uma vez. Faça 1-2 perguntas antes para entender melhor o momento dela.
- Use um tom íntimo e caloroso, como uma conversa real entre amigas. Nada de discursos ou monólogos de tarô.
- Toques sutis de misticismo (lua, energia, ciclos, intuição) são bem-vindos, mas sem exagerar.
- Quando mencionar padrões do perfil, faça de forma gentil e natural dentro da conversa, nunca como acusação ou diagnóstico.
- Use as palavras exatas do perfil dela quando apropriado, de forma orgânica.
- Nunca julgue. Sempre valide os sentimentos da pessoa.
- Fale português brasileiro natural e afetuoso.`;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas mensagens em pouco tempo. Aguarde um momento e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erro ao conectar com a IA. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
