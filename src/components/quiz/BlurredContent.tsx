import { Lock } from "lucide-react";

interface BlurredContentProps {
  children: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
}

const BlurredContent = ({
  children,
  ctaText = "Desbloquear Diagnóstico Completo",
  onCtaClick,
}: BlurredContentProps) => {
  return (
    <div className="relative">
      <div className="blur-gate select-none pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-4 animate-breathe">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <p className="text-foreground text-sm font-medium mb-1 text-center px-4">
          Seu Arquétipo foi identificado
        </p>
        <p className="text-muted-foreground text-xs text-center px-6 mb-5">
          Desbloqueie para ver a causa raiz e o plano de quebra de padrão
        </p>
        {onCtaClick && (
          <button
            onClick={onCtaClick}
            className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium glow-button hover:brightness-110 active:scale-[0.97] transition-all"
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default BlurredContent;
