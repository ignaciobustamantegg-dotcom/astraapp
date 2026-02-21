import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Zap, Eye, Heart, Shield, Loader2 } from "lucide-react";
import { useQuizProfile } from "@/hooks/useQuizProfile";
import { GlowButton } from "@/components/ui/glow-button";

const iconMap: Record<string, React.ReactNode> = {
  "Medo principal": <Heart className="w-4 h-4 text-primary shrink-0" />,
  "Padrão de repetição": <AlertTriangle className="w-4 h-4 text-primary shrink-0" />,
  "Sua intuição": <Eye className="w-4 h-4 text-primary shrink-0" />,
  "Bloqueio energético": <Zap className="w-4 h-4 text-primary shrink-0" />,
  "Bandeiras vermelhas": <Shield className="w-4 h-4 text-primary shrink-0" />,
  "Vínculo emocional": <Heart className="w-4 h-4 text-primary shrink-0" />,
};

const Home = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useQuizProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback for users without quiz data
  if (error || !profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pt-8 pb-6 flex flex-col items-center"
      >
        <h1 className="text-2xl font-medium text-foreground text-center mb-3">
          Seu resultado
        </h1>
        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[320px] mb-8">
          Você tem um perfil de alta sensibilidade emocional com tendência à autoexigência.
          Seu padrão dominante é a evitação do conflito interno, o que gera ciclos de
          esgotamento e desconexão. A auditoria de 7 dias vai te ajudar a identificar e
          transformar esses padrões.
        </p>
        <GlowButton onClick={() => navigate("/journey")} className="max-w-[300px]">
          Começar minha jornada
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </GlowButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-5 pt-8 pb-10 flex flex-col items-center max-w-lg mx-auto"
    >
      {/* Section 1: Archetype title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center mb-6"
      >
        <p className="text-xs uppercase tracking-widest text-primary mb-2 font-medium">
          Seu Perfil
        </p>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {profile.archetype}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mx-auto">
          {profile.archetypeSubtitle}
        </p>
      </motion.div>

      {/* Section 2: Personalized summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full rounded-2xl p-5 mb-6"
        style={{
          background: "hsla(270, 30%, 15%, 0.4)",
          border: "1px solid hsla(270, 40%, 30%, 0.3)",
        }}
      >
        <p className="text-xs uppercase tracking-wider text-primary mb-3 font-medium">
          Resumo personalizado
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {profile.summary}
        </p>
      </motion.div>

      {/* Section 3: Key insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="w-full mb-8"
      >
        <p className="text-xs uppercase tracking-wider text-primary mb-4 font-medium text-center">
          Pontos marcados na sua leitura
        </p>
        <div className="space-y-3">
          {profile.highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
              className="rounded-xl p-4 flex gap-3 items-start"
              style={{
                background: "hsla(270, 25%, 12%, 0.5)",
                border: "1px solid hsla(270, 30%, 25%, 0.25)",
              }}
            >
              {iconMap[h.label] || <Zap className="w-4 h-4 text-primary shrink-0" />}
              <div className="min-w-0">
                <p className="text-xs text-primary font-medium mb-1">{h.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Closing + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-full text-center"
      >
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[300px] mx-auto">
          Isso não é falta de sorte. É um padrão. E padrões podem ser quebrados.
          A auditoria de 7 dias vai te mostrar exatamente como.
        </p>
        <GlowButton onClick={() => navigate("/journey")} className="max-w-[320px] mx-auto">
          Começar minha jornada de desbloqueio
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </GlowButton>
      </motion.div>
    </motion.div>
  );
};

export default Home;
