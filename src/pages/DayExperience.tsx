import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const SCREENS = [
  {
    type: "text" as const,
    content: [
      "A veces no elegimos personas.",
      "Elegimos sensaciones que nos resultan familiares.",
      "",
      "La familiaridad puede sentirse como conexión inmediata.",
      "Como si algo ya estuviera escrito.",
      "",
      "Pero no siempre es destino.",
      "A veces es repetición.",
    ],
    button: "Continuar",
  },
  {
    type: "text" as const,
    content: [
      "Cada persona desarrolla una forma particular de vincularse.",
      "",
      "Algunas buscan intensidad.",
      "Otras buscan validación.",
      "Otras buscan seguridad.",
      "",
      "Y muchas veces, sin notarlo, elegimos vínculos que activan lo que ya conocemos… incluso si eso también nos duele.",
      "",
      "No es casualidad.",
      "Es inercia emocional.",
    ],
    button: "Continuar",
  },
  {
    type: "text" as const,
    content: [
      "La inercia no significa error.",
      "Significa hábito.",
      "",
      "Tu sistema emocional aprende lo que es familiar,",
      "aunque no siempre sea lo que te hace bien.",
      "",
      "Reconocer esto no implica cambiar nada hoy.",
      "Solo implica mirar con honestidad.",
    ],
    button: "Continuar",
  },
  {
    type: "text" as const,
    content: [
      "Hoy no necesitas tomar decisiones.",
      "Solo observar.",
      "",
      "Pregúntate con calma:",
      "",
      "¿Hay un tipo de dinámica que se ha repetido en mis relaciones?",
      "",
      "No respondas rápido.",
      "Permítete sentir antes de explicar.",
    ],
    button: "Continuar",
  },
  {
    type: "journal" as const,
    title: "Reflexión",
    prompt: "¿Qué tipo de persona o dinámica ha aparecido más de una vez en tu historia?",
    hint: "(No necesitas tener una conclusión. Solo describe.)",
    button: "Guardar y continuar",
  },
  {
    type: "text" as const,
    content: [
      "Reconocer es el primer movimiento consciente.",
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

  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80dvh] px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center text-center"
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
            className="w-full max-w-[280px] h-12 rounded-xl text-sm font-medium text-primary-foreground press-scale transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(150, 50%, 40%), hsl(150, 45%, 35%))",
              boxShadow: "0 4px 20px hsla(150, 60%, 40%, 0.3)",
            }}
          >
            Volver al mapa
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-6.5rem)]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
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
      <div className="flex-1 flex flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col"
          >
            {screen.type === "text" && (
              <div className="space-y-1">
                {screen.content.map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-4" />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                      className="text-[15px] leading-relaxed text-foreground/90"
                    >
                      {line}
                    </motion.p>
                  )
                )}
              </div>
            )}

            {screen.type === "journal" && (
              <div className="space-y-4">
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70">
                  {screen.title}
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  Escribe libremente:
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {screen.prompt}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {screen.hint}
                </p>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Escribe aquí..."
                  className="w-full min-h-[160px] rounded-xl p-4 text-[15px] leading-relaxed text-foreground bg-secondary/50 border border-border/30 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-6 pt-4">
        <button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl text-sm font-medium text-primary-foreground press-scale transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, hsl(150, 50%, 40%), hsl(150, 45%, 35%))",
            boxShadow: "0 4px 20px hsla(150, 60%, 40%, 0.3)",
          }}
        >
          {screen.button}
        </button>
      </div>
    </div>
  );
};

export default DayExperience;
