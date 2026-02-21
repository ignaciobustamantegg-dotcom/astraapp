import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ForecastResultProps {
  forecastText: string;
  savedGuide: string;
}

/** Strip markdown syntax to get plain words */
const stripMarkdown = (md: string) =>
  md
    .replace(/[#*_~`>[\]()!-]/g, "")
    .replace(/\n+/g, " ")
    .trim();

const ForecastResult = ({ forecastText, savedGuide }: ForecastResultProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [audioState, setAudioState] = useState<"loading" | "playing" | "paused" | "ended" | "error">("loading");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const words = useMemo(() => stripMarkdown(forecastText).split(/\s+/).filter(Boolean), [forecastText]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const progress = audio.currentTime / audio.duration;
    setCurrentWordIndex(Math.floor(progress * words.length));
  }, [words]);

  // Auto-play on mount
  useEffect(() => {
    let cancelled = false;

    const fetchAndPlay = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/daily-forecast-audio`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ text: forecastText, guide: savedGuide }),
          }
        );
        if (!resp.ok) throw new Error("audio_fail");
        const blob = await resp.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", () => {
          setAudioState("ended");
          setCurrentWordIndex(words.length);
        });

        await audio.play();
        if (!cancelled) setAudioState("playing");
      } catch {
        if (!cancelled) {
          setAudioState("error");
          setCurrentWordIndex(words.length); // show all text
        }
      }
    };

    fetchAndPlay();

    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState === "playing") {
      audio.pause();
      setAudioState("paused");
    } else {
      audio.play();
      setAudioState("playing");
    }
  };

  const showHighlight = audioState === "playing" || audioState === "paused";
  const showAllText = audioState === "ended" || audioState === "error";

  return (
    <motion.div
      key="s6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="flex-1 flex flex-col gap-6"
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-serif text-foreground">Sua Previsão de Hoje</h2>
        <p className="text-muted-foreground text-xs mt-1">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <div className="bg-card/60 border border-border/30 rounded-2xl p-5">
        <div className="text-secondary-foreground text-sm leading-relaxed">
          {showHighlight
            ? words.map((word, i) => (
                <span
                  key={i}
                  className={`inline-block mr-1 transition-all duration-200 ${
                    i < currentWordIndex
                      ? "opacity-100"
                      : i === currentWordIndex
                      ? "text-primary scale-105 opacity-100"
                      : "opacity-30"
                  }`}
                  style={
                    i === currentWordIndex
                      ? { textShadow: "0 0 8px hsl(var(--primary) / 0.5)" }
                      : undefined
                  }
                >
                  {word}
                </span>
              ))
            : showAllText
            ? words.map((word, i) => (
                <span key={i} className="inline-block mr-1">{word}</span>
              ))
            : (
                <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Preparando sua leitura em áudio...</span>
                </div>
              )}
        </div>
      </div>

      {/* Audio control */}
      {(audioState === "playing" || audioState === "paused" || audioState === "ended") && (
        <button
          onClick={toggleAudio}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-colors"
        >
          {audioState === "playing" ? (
            <>
              <VolumeX className="w-4 h-4" />
              Pausar áudio
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              {audioState === "ended" ? "Ouvir novamente" : "Retomar áudio"}
            </>
          )}
        </button>
      )}

      {audioState === "ended" && (
        <p className="text-center text-muted-foreground text-xs mt-2">
          ✨ Sua previsão de hoje já foi revelada. A próxima estará disponível amanhã.
        </p>
      )}
    </motion.div>
  );
};

export default ForecastResult;
