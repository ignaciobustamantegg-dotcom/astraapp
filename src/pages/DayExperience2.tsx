import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import DayLoadingScreen, { DAY_TITLES } from "@/components/DayLoadingScreen";

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
      { text: "Nem tudo que te atrai é casual.", style: "serif-lead" },
      { text: "", style: "spacer" },
      { text: "Às vezes o que te move não é a pessoa,", style: "body" },
      { text: "mas o que ela desperta em você.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Pode ser intensidade.", style: "body" },
      { text: "Pode ser calma.", style: "body" },
      { text: "Pode ser aquela sensação de \"finalmente\".", style: "body" },
      { text: "", style: "spacer" },
      { text: "A conexão nem sempre começa no presente.", style: "body" },
      { text: "Às vezes começa em algo que você já conhecia.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Por trás de cada escolha existe uma necessidade.", style: "serif-lead" },
      { text: "", style: "spacer" },
      { text: "Alguns relacionamentos nos fazem sentir vistos.", style: "body" },
      { text: "Outros nos fazem sentir escolhidos.", style: "body" },
      { text: "Outros nos fazem sentir necessários.", style: "body" },
      { text: "", style: "spacer" },
      { text: "E quando uma necessidade é profunda,", style: "body" },
      { text: "a confundimos com destino.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Mas nem tudo que se sente forte", style: "highlight-start" },
      { text: "é necessariamente saudável.", style: "highlight-end" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Quando alguém ativa algo importante em você,", style: "serif-lead" },
      { text: "seu sistema emocional se acende.", style: "body" },
      { text: "", style: "spacer" },
      { text: "O cérebro não busca o melhor.", style: "body" },
      { text: "Busca o conhecido.", style: "body" },
      { text: "E o que reduz a ansiedade no curto prazo.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Por isso certas dinâmicas se repetem.", style: "body" },
      { text: "Não porque você quer sofrer.", style: "body" },
      { text: "Mas porque algo em você tenta resolver algo pendente.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Hoje não vamos analisar a outra pessoa.", style: "serif-lead" },
      { text: "Vamos olhar para você.", style: "body" },
      { text: "", style: "spacer" },
      { text: "Pergunte-se com calma:", style: "body" },
      { text: "", style: "spacer" },
      { text: "Que sensação eu busco quando me conecto com alguém?", style: "highlight-start" },
      { text: "", style: "highlight-end" },
      { text: "", style: "spacer" },
      { text: "Ser validada?", style: "body" },
      { text: "Me sentir segura?", style: "body" },
      { text: "", style: "spacer" },
      { text: "Não responda pela lógica.", style: "body" },
      { text: "Responda pelo corpo.", style: "serif-close" },
    ],
    button: "Continuar",
  },
  {
    type: "journal",
    title: "Reflexão",
    prompt: "Quando me sinto atraída por alguém, que emoção aparece primeiro em mim?",
    hint: "(Não busque a resposta certa. Apenas observe.)",
    button: "Salvar e continuar",
  },
  {
    type: "text",
    lines: [
      { text: "Reconhecer o que você busca é o primeiro passo para escolher com clareza.", style: "serif-lead" },
    ],
    button: "Completar Dia 2",
  },
];

const TOTAL_SCREENS = SCREENS.length;

const DayExperience2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(0);
  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    const saved = localStorage.getItem(`astra_day2_journal_${user?.id}`);
    if (saved) setJournalText(saved);
  }, [user?.id]);

  useEffect(() => {
    if (journalText && user?.id) {
      localStorage.setItem(`astra_day2_journal_${user.id}`, journalText);
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
      const { data: current } = await supabase
        .from("audit_progress")
        .select("current_day")
        .eq("user_id", user.id)
        .maybeSingle();

      const updateData: Record<string, any> = { day_2_completed_at: now };
      if (!current || current.current_day < 3) {
        updateData.current_day = 3;
      }

      await supabase
        .from("audit_progress")
        .update(updateData)
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["audit_progress", user.id] });
    } catch (e) {
      console.error("Error completing day:", e);
    }
    setShowCompletion(true);
  };

  const screen = SCREENS[currentScreen];

  if (isLoading) {
    return <DayLoadingScreen dayNumber={2} dayTitle={DAY_TITLES[2]} onComplete={handleLoadingComplete} />;
  }

  if (showCompletion) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[80dvh] px-8">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(270, 60%, 55%, 0.08) 0%, transparent 70%)" }} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, hsl(270, 50%, 35%), hsl(260, 40%, 20%))", boxShadow: "0 0 30px hsla(270, 80%, 65%, 0.3)" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>
              <Star className="w-7 h-7 text-primary" />
            </motion.div>
          </div>
          <h2 className="text-xl text-foreground mb-2" style={{ fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Dia 2 completado</h2>
          <p className="text-sm text-muted-foreground mb-8">Como foi essa experiência para você?</p>
          <div className="flex gap-3 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="press-scale p-1">
                <Star className={`w-7 h-7 transition-all duration-200 ${star <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/journey")} className="w-full max-w-[280px] h-[52px] rounded-xl text-sm font-bold press-scale transition-all duration-300 text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))", boxShadow: "0 0 20px hsla(270, 60%, 70%, 0.25), 0 4px 12px hsla(270, 60%, 70%, 0.15)", border: "1px solid hsla(270, 60%, 75%, 0.2)" }}>
            Voltar ao mapa
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[360px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, hsla(270, 60%, 55%, 0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] pointer-events-none" style={{ background: "radial-gradient(circle, hsla(265, 50%, 45%, 0.04) 0%, transparent 65%)" }} />

      <div className="px-5 pt-3 pb-2 relative z-10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { if (currentScreen > 0) setCurrentScreen((prev) => prev - 1); else navigate("/journey"); }} className="min-h-[44px] min-w-[44px] flex items-center justify-center press-scale">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70">Dia 2</p>
            <p className="text-sm text-foreground/70" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>A Mecânica da Conexão</p>
          </div>
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <span className="text-xs text-muted-foreground">3–4 min</span>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-secondary" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <div className="flex flex-col justify-center px-8 pt-6 pb-4 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div key={currentScreen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="flex flex-col">
              {screen.type === "text" && (() => {
                const rendered: React.ReactNode[] = [];
                let highlightBuffer: ScreenLine[] = [];
                let inHighlight = false;
                screen.lines.forEach((line, i) => {
                  if (line.style === "highlight-start") { inHighlight = true; highlightBuffer.push(line); return; }
                  if (line.style === "highlight-end") {
                    if (line.text) highlightBuffer.push(line);
                    rendered.push(
                      <motion.div key={`hl-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.07, duration: 0.4, ease: "easeOut" }} className="rounded-2xl px-6 py-5 my-5" style={{ background: "hsla(260, 28%, 15%, 0.6)", borderLeft: "3px solid hsl(270, 70%, 70%)", boxShadow: "inset 3px 0 12px hsla(270, 70%, 70%, 0.08)" }}>
                        {highlightBuffer.map((hl, j) => hl.text ? <p key={j} className="text-[16px] leading-[1.7] text-foreground/85 italic" style={{ fontWeight: 300 }}>{hl.text}</p> : null)}
                      </motion.div>
                    );
                    highlightBuffer = []; inHighlight = false; return;
                  }
                  if (inHighlight) { highlightBuffer.push(line); return; }
                  if (line.style === "spacer") { rendered.push(<div key={i} className="h-6" />); return; }
                  const isLead = line.style === "serif-lead";
                  const isClose = line.style === "serif-close";
                  rendered.push(
                    <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: "easeOut" }} className={`${isLead ? "text-[20px] text-foreground mb-3 leading-[1.7] font-bold" : isClose ? "text-[16px] text-foreground mt-7 leading-[1.7]" : "text-[16px] text-foreground/70 leading-[1.7]"}`} style={{ fontWeight: isLead ? 700 : isClose ? 500 : 300, letterSpacing: isLead ? "-0.01em" : undefined }}>{line.text}</motion.p>
                  );
                });
                return <div className="flex flex-col">{rendered}</div>;
              })()}

              {screen.type === "journal" && (
                <div className="space-y-5">
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }} className="text-[10px] font-medium tracking-[0.15em] uppercase text-primary/70">{screen.title}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="text-[17px] leading-[1.85] text-foreground/80">Escreva livremente:</motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }} className="text-[18px] leading-[1.7] text-foreground" style={{ fontWeight: 300, letterSpacing: "-0.01em" }}>{screen.prompt}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29, duration: 0.4 }} className="text-[14px] text-muted-foreground">{screen.hint}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.4 }}>
                    <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Escreva aqui..." className="w-full min-h-[160px] rounded-xl p-4 text-[16px] leading-[1.8] text-foreground bg-secondary/40 border border-border/20 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 resize-none transition-all duration-300" style={{ fontSize: "16px" }} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="px-8 pb-4 pt-2 relative z-10 shrink-0">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}>
          <button onClick={handleContinue} className="w-full h-[52px] rounded-xl text-[15px] font-bold press-scale transition-all duration-300 text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))", boxShadow: "0 0 20px hsla(270, 60%, 70%, 0.25), 0 4px 12px hsla(270, 60%, 70%, 0.15)", border: "1px solid hsla(270, 60%, 75%, 0.2)" }}>
            {screen.button}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DayExperience2;
