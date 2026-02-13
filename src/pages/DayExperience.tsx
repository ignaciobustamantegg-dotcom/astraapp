import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type ScreenLine = {
  text: string;
  style?: "serif-lead" | "serif-close" | "body" | "spacer" | "highlight-start" | "highlight-end";
};

type Screen =
  | { type: "text"; lines: ScreenLine[]; button: string }
  | { type: "journal"; title: string; prompt: string; hint: string; button: string };

const SCREENS: Screen[] = [
  {
    type: "text",
    lines: [
      { text: "A veces no elegimos personas.", style: "serif-lead" },
      { text: "Elegimos sensaciones que nos resultan familiares.", style: "body" },
      { text: "", style: "spacer" },
      { text: "La familiaridad puede sentirse como conexión inmediata.", style: "highlight-start" },
      { text: "Como si algo ya estuviera escrito.", style: "highlight-end" },
      { text: "", style: "spacer" },
      { text: "Pero no siempre es destino.", style: "body" },
      { text: "A veces es repetición.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Cada persona desarrolla una forma particular de vincularse.", style: "serif-lead" },
      { text: "", style: "spacer" },
      { text: "Algunas buscan intensidad.", style: "body" },
      { text: "Otras buscan validación.", style: "body" },
      { text: "Otras buscan seguridad.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Y muchas veces, sin notarlo, elegimos vínculos que activan lo que ya conocemos… incluso si eso también nos duele.", style: "body" },
      { text: "", style: "spacer" },
      { text: "No es casualidad.", style: "body" },
      { text: "Es inercia emocional.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "La inercia no significa error.", style: "serif-lead" },
      { text: "Significa hábito.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Tu sistema emocional aprende lo que es familiar,", style: "body" },
      { text: "aunque no siempre sea lo que te hace bien.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Reconocer esto no implica cambiar nada hoy.", style: "body" },
      { text: "Solo implica mirar con honestidad.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Hoy no necesitas tomar decisiones.", style: "serif-lead" },
      { text: "Solo observar.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Pregúntate con calma:", style: "body" },
      { text: "", style: "spacer" },
      { text: "¿Hay un tipo de dinámica que se ha repetido en mis relaciones?", style: "highlight-start" },
      { text: "", style: "highlight-end" },
      { text: "", style: "spacer" },
      { text: "No respondas rápido.", style: "body" },
      { text: "Permítete sentir antes de explicar.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "journal",
    title: "Reflexión",
    prompt: "¿Qué tipo de persona o dinámica ha aparecido más de una vez en tu historia?",
    hint: "(No necesitas tener una conclusión. Solo describe.)",
    button: "Guardar y continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Reconocer es el primer movimiento consciente.", style: "serif-close" },
    ],
    button: "Completar Día 1",
  },
];

const TOTAL_SCREENS = SCREENS.length;

const DayExperience = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(0);

  // Load saved journal from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`astra_day1_journal_${user?.id}`);
    if (saved) setJournalText(saved);
  }, [user?.id]);

  // Auto-save journal
  useEffect(() => {
    if (journalText && user?.id) {
      localStorage.setItem(`astra_day1_journal_${user.id}`, journalText);
    }
  }, [journalText, user?.id]);

  const progress = ((currentScreen + 1) / TOTAL_SCREENS) * 100;

  const handleContinue = () => {
    if (currentScreen < TOTAL_SCREENS - 1) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      await supabase
        .from("audit_progress")
        .update({
          day_1_completed_at: now,
          current_day: 2,
        })
        .eq("user_id", user.id);

      queryClient.invalidateQueries({ queryKey: ["audit_progress", user.id] });
    } catch (e) {
      console.error("Error completing day:", e);
    }

    setShowCompletion(true);
  };

  const screen = SCREENS[currentScreen];

  const dmSerif = "'DM Serif Display', 'Playfair Display', serif";

  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80dvh] px-8"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(270, 60%, 55%, 0.08) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center text-center relative z-10"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, hsl(270, 50%, 35%), hsl(260, 40%, 20%))",
              boxShadow: "0 0 30px hsla(270, 80%, 65%, 0.3)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Star className="w-7 h-7 text-primary" />
            </motion.div>
          </div>

          <h2
            className="text-xl font-medium text-foreground mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Día 1 completado
          </h2>

          <p className="text-sm text-muted-foreground mb-8">
            ¿Cómo fue esta experiencia para ti?
          </p>

          {/* Rating */}
          <div className="flex gap-3 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="press-scale p-1"
              >
                <Star
                  className={`w-7 h-7 transition-all duration-200 ${
                    star <= rating
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/journey")}
            className="w-full max-w-[280px] h-[52px] rounded-xl text-sm font-medium press-scale transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(270, 45%, 30%), hsl(265, 50%, 40%))",
              boxShadow: "0 0 25px hsla(270, 70%, 55%, 0.2), 0 4px 15px hsla(270, 60%, 40%, 0.15)",
              border: "1px solid hsla(270, 60%, 60%, 0.15)",
              color: "hsl(270, 15%, 90%)",
            }}
          >
            Volver al mapa
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-6.5rem)] relative">
      {/* Ambient glow behind text area */}
      <div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(270, 55%, 50%, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="px-5 pt-3 pb-2 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (currentScreen > 0) setCurrentScreen((prev) => prev - 1);
              else navigate("/journey");
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center press-scale"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70">
              Día 1
            </p>
            <p
              className="text-sm font-medium text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Identificación de la Inercia
            </p>
          </div>
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground">3–4 min</span>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-secondary" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-8 pt-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col"
          >
            {screen.type === "text" && (() => {
              // Group lines into segments, collecting highlight blocks
              const rendered: React.ReactNode[] = [];
              let highlightBuffer: ScreenLine[] = [];
              let inHighlight = false;

              screen.lines.forEach((line, i) => {
                if (line.style === "highlight-start") {
                  inHighlight = true;
                  highlightBuffer.push(line);
                  return;
                }
                if (line.style === "highlight-end") {
                  if (line.text) highlightBuffer.push(line);
                  // Render highlight block
                  rendered.push(
                    <motion.div
                      key={`hl-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                      className="rounded-2xl px-6 py-5 my-4"
                      style={{
                        background: "hsla(260, 30%, 14%, 0.7)",
                        borderLeft: "2px solid hsla(270, 60%, 60%, 0.2)",
                      }}
                    >
                      {highlightBuffer.map((hl, j) =>
                        hl.text ? (
                          <p
                            key={j}
                            className="text-[17px] leading-[1.9] text-foreground/90 italic"
                            style={{ fontFamily: dmSerif }}
                          >
                            {hl.text}
                          </p>
                        ) : null
                      )}
                    </motion.div>
                  );
                  highlightBuffer = [];
                  inHighlight = false;
                  return;
                }
                if (inHighlight) {
                  highlightBuffer.push(line);
                  return;
                }

                // Normal lines
                if (line.style === "spacer") {
                  rendered.push(<div key={i} className="h-6" />);
                  return;
                }

                const isLead = line.style === "serif-lead";
                const isClose = line.style === "serif-close";

                rendered.push(
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                    className={`leading-[1.9] ${
                      isLead
                        ? "text-[22px] font-medium text-foreground mb-3"
                        : isClose
                          ? "text-[20px] font-semibold text-foreground mt-3"
                          : "text-[17px] text-foreground/75"
                    }`}
                    style={{
                      fontFamily: isLead || isClose ? dmSerif : undefined,
                    }}
                  >
                    {line.text}
                  </motion.p>
                );
              });

              return <div className="flex flex-col">{rendered}</div>;
            })()}

            {screen.type === "journal" && (
              <div className="space-y-5">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.4 }}
                  className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70"
                >
                  {screen.title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-[17px] leading-[1.85] text-foreground/80"
                >
                  Escribe libremente:
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.4 }}
                  className="text-[18px] leading-[1.85] font-medium text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {screen.prompt}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.29, duration: 0.4 }}
                  className="text-[14px] text-muted-foreground"
                >
                  {screen.hint}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.4 }}
                >
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Escribe aquí..."
                    className="w-full min-h-[160px] rounded-xl p-4 text-[16px] leading-[1.8] text-foreground bg-secondary/40 border border-border/20 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 resize-none transition-all duration-300"
                    style={{ fontSize: "16px" }}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="px-8 pb-7 pt-6 relative z-10">
        <button
          onClick={handleContinue}
          className="w-full h-[52px] rounded-xl text-[15px] font-medium press-scale transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, hsl(270, 45%, 30%), hsl(265, 50%, 40%))",
            boxShadow: "0 0 25px hsla(270, 70%, 55%, 0.2), 0 4px 15px hsla(270, 60%, 40%, 0.15)",
            border: "1px solid hsla(270, 60%, 60%, 0.15)",
            color: "hsl(270, 15%, 90%)",
          }}
        >
          {screen.button}
        </button>
      </div>
    </div>
  );
};

export default DayExperience;
