import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Volume2, VolumeX, Loader2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import forecastHeroBg from "@/assets/forecast-hero-bg.jpg";
import readingIntuition from "@/assets/reading-intuition.jpg";
import readingSilence from "@/assets/reading-silence.jpg";
import readingSoltar from "@/assets/reading-soltar.jpg";
import { GUIDED_READINGS } from "@/data/guidedReadings";

interface ForecastResultProps {
  forecastText: string;
  savedGuide: string;
}

const stripMarkdown = (md: string) =>
  md.replace(/[#*_~`>[\]()!-]/g, "").replace(/\n+/g, " ").trim();

const READING_IMAGES: Record<string, string> = {
  "reading-intuition": readingIntuition,
  "reading-silence": readingSilence,
  "reading-soltar": readingSoltar,
};

const ForecastResult = ({ forecastText, savedGuide }: ForecastResultProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [audioState, setAudioState] = useState<"loading" | "playing" | "paused" | "ended" | "error">("loading");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const words = useMemo(() => stripMarkdown(forecastText).split(/\s+/).filter(Boolean), [forecastText]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const progress = audio.currentTime / audio.duration;
    setCurrentWordIndex(Math.floor(progress * words.length));
  }, [words]);

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
          setCurrentWordIndex(words.length);
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
  }, []);

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

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <motion.div
      key="s6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="flex-1 flex flex-col gap-5"
    >
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs capitalize">{today}</p>
          <h1 className="text-2xl font-serif text-foreground mt-0.5">Sua Previsão</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Star className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Hero forecast card */}
      <div className="relative rounded-2xl overflow-hidden min-h-[280px]">
        <img
          src={forecastHeroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="relative z-10 p-5 pt-10 flex flex-col justify-end min-h-[280px]">
          <p className="text-[10px] uppercase tracking-[0.15em] text-primary/80 mb-2">
            Previsão do Dia
          </p>

          <div className="text-foreground text-[15px] leading-[1.75] font-light">
            {showHighlight
              ? words.slice(0, Math.min(words.length, 30)).map((word, i) => (
                  <span
                    key={i}
                    className={`inline mr-1 transition-all duration-200 ${
                      i < currentWordIndex
                        ? "opacity-100"
                        : i === currentWordIndex
                        ? "text-primary opacity-100"
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
              ? <span>{words.slice(0, 30).join(" ")}...</span>
              : (
                  <div className="flex items-center gap-2 text-muted-foreground py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Preparando sua leitura...</span>
                  </div>
                )}
          </div>

          {/* Audio control inline */}
          {(audioState === "playing" || audioState === "paused" || audioState === "ended") && (
            <button
              onClick={toggleAudio}
              className="mt-3 flex items-center gap-2 text-primary text-xs font-medium"
            >
              {audioState === "playing" ? (
                <><VolumeX className="w-3.5 h-3.5" /> Pausar</>
              ) : (
                <><Volume2 className="w-3.5 h-3.5" /> {audioState === "ended" ? "Ouvir novamente" : "Retomar"}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Full text card (when ended) */}
      {showAllText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{
            background: "hsla(260, 28%, 15%, 0.6)",
            border: "1px solid hsla(260, 20%, 22%, 0.6)",
          }}
        >
          <div className="text-secondary-foreground text-sm leading-relaxed">
            {words.map((word, i) => (
              <span key={i} className="inline mr-1">{word}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Guided Readings section */}
      <div className="mt-2">
        <h2 className="text-lg font-serif text-foreground mb-3">Leituras Guiadas</h2>

        <div className="flex flex-col gap-3">
          {GUIDED_READINGS.map((reading) => (
            <button
              key={reading.id}
              onClick={() => navigate(`/reading/${reading.id}`)}
              className="flex items-center gap-4 rounded-2xl overflow-hidden press-scale transition-all duration-200"
              style={{
                background: "hsla(260, 28%, 13%, 0.7)",
                border: "1px solid hsla(260, 20%, 22%, 0.5)",
              }}
            >
              <div className="flex-1 p-4 text-left">
                <p className="text-[10px] uppercase tracking-[0.12em] text-primary/70 mb-1">
                  {reading.category}
                </p>
                <p className="text-foreground text-sm font-medium leading-snug">
                  {reading.title}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                  <Play className="w-3 h-3 fill-current" />
                  <span className="text-[11px]">{reading.duration}</span>
                </div>
              </div>
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={READING_IMAGES[reading.image]}
                  alt={reading.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {audioState === "ended" && (
        <p className="text-center text-muted-foreground text-xs mt-1 pb-4">
          ✨ Sua previsão de hoje já foi revelada. A próxima estará disponível amanhã.
        </p>
      )}
    </motion.div>
  );
};

export default ForecastResult;
