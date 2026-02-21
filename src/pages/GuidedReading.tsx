import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GUIDED_READINGS } from "@/data/guidedReadings";

const stripMarkdown = (md: string) =>
  md.replace(/[#*_~`>[\]()!-]/g, "").replace(/\n+/g, " ").trim();

const GuidedReading = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reading = GUIDED_READINGS.find((r) => r.id === id);

  const fullText = useMemo(() => reading?.paragraphs.join("\n\n") || "", [reading]);
  const words = useMemo(() => stripMarkdown(fullText).split(/\s+/).filter(Boolean), [fullText]);

  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [audioState, setAudioState] = useState<"loading" | "playing" | "paused" | "ended" | "error">("loading");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const progress = audio.currentTime / audio.duration;
    setCurrentWordIndex(Math.floor(progress * words.length));
  }, [words]);

  useEffect(() => {
    if (!reading) return;
    let cancelled = false;

    const fetchAndPlay = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const storageUrl = `${supabaseUrl}/storage/v1/object/public/guided-readings-audio/${reading.id}.mp3`;

        // Try cached audio first
        const headResp = await fetch(storageUrl, { method: "HEAD" });
        let audioUrl: string;

        if (headResp.ok) {
          // Cached file exists — use it directly
          audioUrl = storageUrl;
        } else {
          // Not cached — generate on-the-fly and cache
          const genResp = await fetch(
            `${supabaseUrl}/functions/v1/generate-reading-audio`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({ readingId: reading.id }),
            }
          );
          if (!genResp.ok) throw new Error("audio_fail");
          const data = await genResp.json();
          audioUrl = data.url || storageUrl;
        }

        if (cancelled) return;

        const audio = new Audio(audioUrl);
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
  }, [reading?.id]);

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

  if (!reading) {
    return (
      <div className="flex items-center justify-center min-h-[60dvh]">
        <p className="text-muted-foreground text-sm">Leitura não encontrada.</p>
      </div>
    );
  }

  const showHighlight = audioState === "playing" || audioState === "paused";
  const showAllText = audioState === "ended" || audioState === "error";
  const audioProgress = audioRef.current?.duration
    ? (audioRef.current.currentTime / audioRef.current.duration) * 100
    : 0;

  // Build paragraph-aware rendering
  let wordOffset = 0;
  const paragraphsWithOffsets = reading.paragraphs.map((p) => {
    const pWords = stripMarkdown(p).split(/\s+/).filter(Boolean);
    const start = wordOffset;
    wordOffset += pWords.length;
    return { words: pWords, start, end: wordOffset };
  });

  return (
    <div className="flex flex-col h-full relative">
      {/* Background glow */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[360px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, hsla(270, 60%, 55%, 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="px-5 pt-3 pb-2 relative z-10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              navigate("/forecast");
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center press-scale"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70">
              {reading.category}
            </p>
            <p
              className="text-sm text-foreground/70"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "-0.02em" }}
            >
              {reading.title}
            </p>
          </div>
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground">{reading.duration}</span>
          </div>
        </div>
        <Progress value={showAllText ? 100 : audioProgress} className="h-1 bg-secondary" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <div className="flex flex-col justify-start px-8 pt-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="reading-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {audioState === "loading" && (
                <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Preparando a leitura...</span>
                </div>
              )}

              {(showHighlight || showAllText) &&
                paragraphsWithOffsets.map((para, pIdx) => (
                  <motion.p
                    key={pIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + pIdx * 0.04, duration: 0.4 }}
                    className={`text-[16px] leading-[1.75] ${
                      pIdx === 0 ? "text-foreground font-bold text-[18px]" : "text-foreground/70"
                    }`}
                    style={{ fontWeight: pIdx === 0 ? 700 : 300 }}
                  >
                    {para.words.map((word, wIdx) => {
                      const globalIdx = para.start + wIdx;
                      const isActive = showHighlight && globalIdx === currentWordIndex;
                      const isPast = !showHighlight || showAllText || globalIdx < currentWordIndex;
                      return (
                        <span
                          key={wIdx}
                          className={`transition-all duration-200 ${
                            isPast
                              ? "opacity-100"
                              : isActive
                              ? "text-primary opacity-100"
                              : "opacity-30"
                          }`}
                          style={
                            isActive
                              ? { textShadow: "0 0 8px hsl(var(--primary) / 0.5)" }
                              : undefined
                          }
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </motion.p>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom audio control */}
      <div className="px-8 pb-4 pt-2 relative z-10 shrink-0">
        {(audioState === "playing" || audioState === "paused" || audioState === "ended") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <button
              onClick={toggleAudio}
              className="w-full h-[52px] rounded-xl text-[15px] font-bold press-scale transition-all duration-300 text-primary-foreground flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))",
                boxShadow: "0 0 20px hsla(270, 60%, 70%, 0.25), 0 4px 12px hsla(270, 60%, 70%, 0.15)",
                border: "1px solid hsla(270, 60%, 75%, 0.2)",
              }}
            >
              {audioState === "playing" ? (
                <><VolumeX className="w-4 h-4" /> Pausar áudio</>
              ) : (
                <><Volume2 className="w-4 h-4" /> {audioState === "ended" ? "Ouvir novamente" : "Retomar áudio"}</>
              )}
            </button>
          </motion.div>
        )}

        {audioState === "ended" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/forecast")}
            className="w-full mt-3 text-center text-muted-foreground text-sm py-2 press-scale"
          >
            ← Voltar à previsão
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GuidedReading;
