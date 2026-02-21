import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, Cloud, Heart, Flame, Zap, Wind, Droplets, Star, Shield, Eye, Feather, Compass, ArrowRight, Volume2, Loader2 } from "lucide-react";
import Orbs from "@/components/quiz/Orbs";
import { useQuizProfile } from "@/hooks/useQuizProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

/* ── options data ── */
const EMOTIONS = [
  { id: "ansiosa", label: "Ansiosa", icon: Wind },
  { id: "esperancosa", label: "Esperançosa", icon: Sun },
  { id: "cansada", label: "Cansada", icon: Moon },
  { id: "confusa", label: "Confusa", icon: Cloud },
  { id: "apaixonada", label: "Apaixonada", icon: Heart },
  { id: "determinada", label: "Determinada", icon: Flame },
];

const ENERGIES = [
  { id: "fogo", label: "Fogo", icon: Flame, desc: "Ação e coragem" },
  { id: "agua", label: "Água", icon: Droplets, desc: "Fluxo e intuição" },
  { id: "ar", label: "Ar", icon: Wind, desc: "Leveza e liberdade" },
  { id: "terra", label: "Terra", icon: Shield, desc: "Estabilidade e raízes" },
  { id: "luz", label: "Luz", icon: Zap, desc: "Clareza e verdade" },
  { id: "sombra", label: "Sombra", icon: Eye, desc: "Profundidade e cura" },
];

const INTENTIONS = [
  { id: "clareza", label: "Ter clareza sobre meu caminho" },
  { id: "coragem", label: "Encontrar coragem para agir" },
  { id: "paz", label: "Sentir paz interior" },
  { id: "conexao", label: "Me conectar com minha essência" },
  { id: "soltar", label: "Soltar o que não me serve mais" },
];

const GUIDES = [
  { id: "luana", name: "Luana", desc: "Jovem, vibrante e acolhedora", icon: Feather },
  { id: "selene", name: "Selene", desc: "Madura, mística e sábia", icon: Moon },
  { id: "rafael", name: "Rafael", desc: "Jovem, direto e protetor", icon: Shield },
  { id: "thiago", name: "Thiago", desc: "Maduro, filosófico e ancorado", icon: Compass },
];

/* ── animation variants ── */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const DailyForecast = () => {
  const [step, setStep] = useState(-1); // -1 = loading check
  const [emotion, setEmotion] = useState("");
  const [energy, setEnergy] = useState("");
  const [intention, setIntention] = useState("");
  const [guide, setGuide] = useState("");
  const [forecastText, setForecastText] = useState("");
  const [savedGuide, setSavedGuide] = useState("");
  const [generating, setGenerating] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { profile } = useQuizProfile();
  const { toast } = useToast();

  // Check for existing forecast today on mount
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setStep(0); return; }

        const today = new Date().toISOString().split("T")[0];
        const { data } = await supabase
          .from("daily_forecasts" as any)
          .select("forecast_text, guide")
          .eq("user_id", user.id)
          .eq("forecast_date", today)
          .maybeSingle();

        if ((data as any)?.forecast_text) {
          setForecastText((data as any).forecast_text);
          setSavedGuide((data as any).guide || "luana");
          setStep(6);
        } else {
          setStep(0);
        }
      } catch {
        setStep(0);
      }
    };
    checkExisting();
  }, []);

  const generateForecast = useCallback(async () => {
    setGenerating(true);
    setStep(5); // transition screen

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/daily-forecast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            emotion,
            energy,
            intention,
            guide,
            profile: profile
              ? {
                  archetype: profile.archetype,
                  sentimento: profile.sentimento,
                  medoPrincipal: profile.medoPrincipal,
                  bloqueio: profile.bloqueio,
                }
              : null,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao gerar previsão");
      }

      const data = await resp.json();
      setForecastText(data.text);
      setSavedGuide(data.guide || guide);

      // Wait a bit on transition before showing result
      setTimeout(() => {
        setStep(6);
        setGenerating(false);
      }, 2500);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      setStep(4);
      setGenerating(false);
    }
  }, [emotion, energy, intention, guide, profile, toast]);

  const playAudio = async () => {
    if (playingAudio && audioRef.current) {
      audioRef.current.pause();
      setPlayingAudio(false);
      return;
    }

    setLoadingAudio(true);
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

      if (!resp.ok) throw new Error("Erro ao gerar áudio");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlayingAudio(false);
      await audio.play();
      setPlayingAudio(true);
    } catch (e: any) {
      toast({ title: "Erro", description: "Não foi possível reproduzir o áudio.", variant: "destructive" });
    } finally {
      setLoadingAudio(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);

  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative">
        <Orbs />
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Orbs />
      <div className="relative z-10 min-h-screen flex flex-col px-5 py-8 pb-24">
        <AnimatePresence mode="wait">
          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <motion.div key="s0" {...pageVariants} className="flex-1 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-serif text-foreground">Previsão do Dia</h1>
              <p className="text-secondary-foreground text-sm leading-relaxed max-w-xs">
                Descubra as energias que guiam o seu dia com uma previsão personalizada, feita só para você.
              </p>
              <button
                onClick={nextStep}
                className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                Começar minha previsão <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 1 — Emotion */}
          {step === 1 && (
            <motion.div key="s1" {...pageVariants} className="flex-1 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Passo 1 de 4</p>
                <h2 className="text-xl font-serif text-foreground">Como você está se sentindo?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {EMOTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setEmotion(id); nextStep(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                      emotion === id
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-card/50 hover:border-primary/40"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-foreground text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Energy */}
          {step === 2 && (
            <motion.div key="s2" {...pageVariants} className="flex-1 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Passo 2 de 4</p>
                <h2 className="text-xl font-serif text-foreground">Qual energia te chama hoje?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {ENERGIES.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => { setEnergy(id); nextStep(); }}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all duration-200 ${
                      energy === id
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-card/50 hover:border-primary/40"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-foreground text-sm font-medium">{label}</span>
                    <span className="text-muted-foreground text-[10px]">{desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Intention */}
          {step === 3 && (
            <motion.div key="s3" {...pageVariants} className="flex-1 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Passo 3 de 4</p>
                <h2 className="text-xl font-serif text-foreground">Qual é sua intenção para hoje?</h2>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                {INTENTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => { setIntention(id); nextStep(); }}
                    className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                      intention === id
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-card/50 hover:border-primary/40"
                    }`}
                  >
                    <span className="text-foreground text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Guide */}
          {step === 4 && (
            <motion.div key="s4" {...pageVariants} className="flex-1 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Passo 4 de 4</p>
                <h2 className="text-xl font-serif text-foreground">Escolha seu guia espiritual</h2>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                {GUIDES.map(({ id, name, desc, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setGuide(id); generateForecast(); }}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border/30 bg-card/50 hover:border-primary/40 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-foreground text-sm font-medium">{name}</p>
                      <p className="text-muted-foreground text-xs">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Transition */}
          {step === 5 && (
            <motion.div key="s5" {...pageVariants} className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-xs">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-2 rounded-full border border-accent/20" style={{ animation: "spin 4s linear infinite reverse" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse" />
                  </div>
                </div>
                <p className="text-secondary-foreground text-sm leading-relaxed font-light">
                  Conectando com as energias do universo para revelar sua previsão...
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 6 — Result */}
          {step === 6 && (
            <motion.div key="s6" {...pageVariants} className="flex-1 flex flex-col gap-6">
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
                <div className="text-secondary-foreground text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{forecastText}</ReactMarkdown>
                </div>
              </div>

              <button
                onClick={playAudio}
                disabled={loadingAudio}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-colors disabled:opacity-50"
              >
                {loadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                {playingAudio ? "Pausar áudio" : "Ouvir minha previsão"}
              </button>

              <p className="text-center text-muted-foreground text-xs mt-2">
                ✨ Sua previsão de hoje já foi revelada. A próxima estará disponível amanhã.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyForecast;
