import { Unlock, Shield, CreditCard } from "lucide-react";
import { trackEvent, getSessionId, getClickIds } from "@/lib/session";
import SocialProofPopup from "./SocialProofPopup";
import ThermometerGauge from "./ThermometerGauge";
import BeforeAfter from "./BeforeAfter";
import BlurredContent from "./BlurredContent";
import BeforeAfterImages from "./BeforeAfterImages";
import SocialProofAvatars from "./SocialProofAvatars";
import UrgencyTimer from "./UrgencyTimer";

import Orbs from "./Orbs";

const CHECKOUT_URL = import.meta.env.VITE_CARTPANDA_CHECKOUT_URL || "";

const ResultsScreen = () => {
  const handleCheckout = () => {
    if (!CHECKOUT_URL) {
      alert("URL de checkout não configurada.");
      return;
    }

    const url = new URL(CHECKOUT_URL);
    url.searchParams.set("sid", getSessionId());

    const utms = JSON.parse(localStorage.getItem("quiz_utms") || "{}");
    for (const [key, val] of Object.entries(utms)) {
      if (val) url.searchParams.set(key, val as string);
    }

    const clickIds = getClickIds();
    for (const [key, val] of Object.entries(clickIds)) {
      if (val) url.searchParams.set(key, val as string);
    }

    trackEvent("initiate_checkout", { url: url.toString() });
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-gradient-deep relative">
      <Orbs />
      <SocialProofPopup initialDelay={5000} interval={8000} />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-breathe" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">
            Resultado da Análise
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-foreground mb-3 leading-tight tracking-tight">
          Detectamos um{" "}
          <span className="text-gradient-spirit font-medium italic">
            Padrão de Repetição
          </span>{" "}
          de Alto Risco.
        </h1>

        <div className="w-12 h-[1px] bg-primary/30 my-8" />

        <div className="bg-gradient-card-glass border-glass rounded-2xl p-5 mb-8 space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            📊 Seu Diagnóstico
          </p>
          <ThermometerGauge label="Padrão de Repetição" value={94} color="danger" />
          <ThermometerGauge label="Bloqueio Emocional" value={87} color="danger" />
          <ThermometerGauge label="Intuição Suprimida" value={72} color="warning" />
          <ThermometerGauge label="Potencial de Desbloqueio" value={96} color="accent" />
        </div>

        <div className="space-y-5 text-secondary-foreground leading-relaxed text-[0.93rem] font-light mb-8">
          <p>
            Suas respostas indicam que você não tem "dedo podre". Você está
            operando sob um{" "}
            <span className="text-foreground font-medium">
              Padrão de Bloqueio Invisível.
            </span>
          </p>
          <p>
            Sua intuição já tentou te avisar, e os ciclos repetitivos que você
            relatou no teste são a prova de que o problema não são os
            homens que você atrai, mas a{" "}
            <span className="text-foreground font-medium">
              frequência energética e subconsciente
            </span>{" "}
            que está ativa em você agora.
          </p>
        </div>

        <div className="mb-8">
          <BeforeAfterImages />
        </div>

        <div className="mb-8">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            ✦ O que muda após quebrar o padrão
          </p>
          <BeforeAfter
            items={[
              { before: "Atrair sempre o mesmo perfil de homem", after: "Atrair conexões genuínas e recíprocas" },
              { before: "Ignorar red flags por medo de ficar sozinha", after: "Reconhecer sinais e escolher com clareza" },
              { before: "Ciclo de vai-e-volta desgastante", after: "Relacionamento estável e evolutivo" },
              { before: "Ansiedade e checagem constante", after: "Segurança emocional e paz interior" },
            ]}
          />
        </div>

        <div className="mb-8">
          <SocialProofAvatars />
        </div>

        <div className="mb-8">
          <BlurredContent onCtaClick={handleCheckout}>
            <div className="bg-gradient-card-glass border-glass rounded-2xl p-5 space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                🗝️ Chave de Descoberta
              </p>
              <p className="text-foreground text-sm leading-relaxed font-light">
                Seu Arquétipo de Bloqueio é o <span className="font-medium">___________</span>. A causa raiz está ligada a um vínculo emocional não resolvido que ativa automaticamente um padrão de autossabotagem sempre que você se aproxima de uma conexão real.
              </p>
              <p className="text-foreground text-sm leading-relaxed font-light">
                O desbloqueio começa quando você identifica o gatilho primário e aplica a técnica de reprogramação específica para o seu arquétipo. Seu plano personalizado de 21 dias foi gerado com base nesse perfil.
              </p>
            </div>
          </BlurredContent>
        </div>

        <div className="bg-gradient-card-glass border-glass rounded-2xl px-5 py-4 mb-8">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs">
              A
            </div>
            <div>
              <span className="text-foreground text-xs font-medium">Ana Carolina, 31</span>
              <span className="text-muted-foreground text-[10px] ml-1.5">— Florianópolis</span>
            </div>
          </div>
          <p className="text-secondary-foreground text-xs leading-relaxed font-light italic">
            "Eu achava que era azar. Fiz o teste por curiosidade e quando vi o relatório, chorei. Era exatamente o que eu vivia. Segui o plano de desbloqueio e em 2 meses conheci alguém que me trata como eu merecia desde sempre."
          </p>
        </div>

        <div className="bg-gradient-card-glass border-glass rounded-3xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-light text-foreground mb-3 tracking-tight">
            O que fazer agora?
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5 font-light">
            Nossa inteligência gerou um{" "}
            <span className="text-foreground font-medium">
              Relatório Completo + Plano de Quebra de Padrão
            </span>{" "}
            específico para o seu perfil.
          </p>

          <button
            onClick={handleCheckout}
            className="flex items-center justify-center gap-2.5 w-full px-8 py-4 rounded-2xl font-medium text-base tracking-wide bg-primary text-primary-foreground glow-button hover:brightness-110 active:scale-[0.97] transition-all duration-300"
          >
            <Unlock className="w-4 h-4" />
            Desbloquear por Apenas R$ 27,00
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Shield className="w-3 h-3" />
              <span>Garantia 7 dias</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <CreditCard className="w-3 h-3" />
              <span>Pagamento seguro</span>
            </div>
          </div>
        </div>

        <div id="urgency-sentinel" className="h-1" />
      </div>

      <UrgencyTimer onCtaClick={handleCheckout} />
    </div>
  );
};

export default ResultsScreen;
