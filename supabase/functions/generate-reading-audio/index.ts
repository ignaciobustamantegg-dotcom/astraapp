import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VOICE_MAP: Record<string, { id: string; stability: number; similarity_boost: number; style: number; speed: number }> = {
  luana: { id: "pFZP5JQG7iQjIQuC4Bku", stability: 0.45, similarity_boost: 0.80, style: 0.25, speed: 0.95 },
  selene: { id: "cgSgspJ2msm6clMCkdW9", stability: 0.55, similarity_boost: 0.80, style: 0.20, speed: 0.97 },
  rafael: { id: "TX3LPaxmHKxFdv7VOQHJ", stability: 0.50, similarity_boost: 0.78, style: 0.15, speed: 0.98 },
  thiago: { id: "onwK4e9ZLuTAKqWW03F9", stability: 0.60, similarity_boost: 0.85, style: 0.15, speed: 1.00 },
};

// Static reading content (mirrored from guidedReadings.ts)
const READINGS: Record<string, { guide: string; paragraphs: string[] }> = {
  intuicao: {
    guide: "selene",
    paragraphs: [
      "Existe dentro de você uma voz que não precisa de palavras.",
      "Ela se manifesta como uma sensação no peito, um arrepio sutil, uma certeza que nasce antes do pensamento.",
      "É a sua intuição — o canal mais antigo de conexão com você mesma.",
      "Muitas vezes, a vida moderna nos ensina a ignorá-la. Somos treinadas a racionalizar tudo, a buscar provas antes de confiar.",
      "Mas a intuição não precisa de provas. Ela é a prova.",
      "Pense em um momento em que você sentiu algo antes de entender. Talvez um aviso silencioso que você ignorou. Ou uma atração que não fazia sentido lógico, mas era real.",
      "Esses momentos não foram coincidência. Foram sinais da sua inteligência mais profunda.",
      "Para despertar sua intuição, comece pelo silêncio. Não o silêncio vazio — mas o silêncio fértil, onde você permite que as respostas venham sem forçar.",
      "Respire fundo agora. Feche os olhos por um instante.",
      "Pergunte-se: o que eu preciso ouvir hoje? E espere. Sem julgamento, sem pressa.",
      "A resposta pode vir como uma imagem, uma palavra, uma emoção. Confie no que surgir.",
      "Sua intuição nunca esteve adormecida. Ela apenas esperava que você parasse para ouvir.",
    ],
  },
  silencio: {
    guide: "luana",
    paragraphs: [
      "O barulho do mundo é constante. Notificações, conversas, expectativas, pensamentos que não param.",
      "Mas existe um lugar dentro de você que nenhum ruído consegue alcançar.",
      "Um espaço de silêncio que não é ausência — é presença pura.",
      "O silêncio interior não significa parar de pensar. Significa criar um espaço entre você e seus pensamentos.",
      "Um espaço onde você pode observar sem reagir. Sentir sem se perder.",
      "Imagine um lago em uma noite calma. A superfície é um espelho perfeito, refletindo as estrelas.",
      "Cada pensamento é como uma pedra jogada nessa água. Cria ondas, distorce o reflexo.",
      "Mas quando as ondas se acalmam — e elas sempre se acalmam — o reflexo volta. Mais claro que antes.",
      "Esse é o poder do silêncio: ele não apaga suas dores ou dúvidas. Ele permite que você as veja com clareza.",
      "E na clareza, nasce a escolha consciente.",
      "Hoje, permita-se cinco minutos de quietude real. Sem tela, sem música, sem distração.",
      "Apenas você e o ritmo da sua respiração.",
      "Dentro desse silêncio, você vai encontrar algo que estava lá o tempo todo: a sua própria sabedoria.",
    ],
  },
};

const BUCKET = "guided-readings-audio";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { readingId } = await req.json();
    if (!readingId || typeof readingId !== "string" || !/^[a-z0-9-]+$/.test(readingId)) {
      return new Response(JSON.stringify({ error: "readingId inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reading = READINGS[readingId];
    if (!reading) {
      return new Response(JSON.stringify({ error: "Leitura não encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const filePath = `${readingId}.mp3`;

    // Check if already exists
    const { data: existing } = await supabase.storage.from(BUCKET).list("", {
      search: filePath,
    });

    if (existing && existing.some((f) => f.name === filePath)) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
      return new Response(JSON.stringify({ url: publicUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate audio via ElevenLabs
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY not configured");

    const voice = VOICE_MAP[reading.guide] || VOICE_MAP.luana;
    const text = reading.paragraphs.join("\n\n");

    const elevenResp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: voice.stability,
            similarity_boost: voice.similarity_boost,
            style: voice.style,
            use_speaker_boost: true,
            speed: voice.speed,
          },
        }),
      }
    );

    if (!elevenResp.ok) {
      const errText = await elevenResp.text();
      console.error("ElevenLabs error:", elevenResp.status, errText);
      return new Response(JSON.stringify({ error: "Erro ao gerar áudio" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await elevenResp.arrayBuffer();

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Still return the audio even if upload fails
      return new Response(new Uint8Array(audioBuffer), {
        headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
      });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-reading-audio error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
