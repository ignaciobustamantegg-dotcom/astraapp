import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, guide } = await req.json();
    if (!text || !guide) {
      return new Response(JSON.stringify({ error: "text and guide required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Extract userId from auth header
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
      // Only try to get user if token differs from anon key
      if (token !== ANON_KEY) {
        const anonClient = createClient(SUPABASE_URL, ANON_KEY);
        const { data } = await anonClient.auth.getUser(token);
        userId = data?.user?.id ?? null;
      }
    }

    const today = new Date().toISOString().split("T")[0];
    const cachePath = userId ? `forecasts/${userId}/${today}.mp3` : null;

    // Check cache
    if (cachePath) {
      const { data: existing } = await supabase.storage
        .from("guided-readings-audio")
        .download(cachePath);

      if (existing) {
        console.log("Cache hit:", cachePath);
        const buffer = await existing.arrayBuffer();
        return new Response(buffer, {
          headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
        });
      }
    }

    // Generate with ElevenLabs
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY not configured");

    const voice = VOICE_MAP[guide.toLowerCase()] || VOICE_MAP.luana;

    console.log("Generating audio with ElevenLabs for", cachePath || "anonymous");

    const response = await fetch(
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

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Erro ao gerar áudio" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await response.arrayBuffer();

    // Upload to cache (fire-and-forget)
    if (cachePath) {
      supabase.storage
        .from("guided-readings-audio")
        .upload(cachePath, audioBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        })
        .then(({ error }) => {
          if (error) console.error("Cache upload error:", error.message);
          else console.log("Cached:", cachePath);
        });
    }

    return new Response(audioBuffer, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
    });
  } catch (e) {
    console.error("daily-forecast-audio error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
