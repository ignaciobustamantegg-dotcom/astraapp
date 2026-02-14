import Orbs from "./Orbs";
import SocialProofPopup from "./SocialProofPopup";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />
      <SocialProofPopup initialDelay={4000} interval={9000} />

      <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
        <div className="mb-10 animate-float">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            className="mx-auto"
          >
            <circle cx="28" cy="28" r="27" stroke="hsl(270 40% 72%)" strokeWidth="1" opacity="0.4" />
            <circle cx="28" cy="28" r="18" stroke="hsl(200 60% 65%)" strokeWidth="0.8" opacity="0.3" />
            <circle cx="28" cy="28" r="4" fill="hsl(270 50% 78%)" opacity="0.7" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-light leading-[1.15] mb-6 tracking-tight text-foreground">
          O Teste do{" "}
          <span className="text-gradient-spirit font-medium italic">
            Padrão Invisível
          </span>
        </h1>

        <p className="text-secondary-foreground text-base leading-relaxed mb-4 font-light">
          Descubra por que a sua história sempre termina do mesmo jeito.
        </p>

        <p className="text-muted-foreground text-sm leading-relaxed mb-12 max-w-sm mx-auto">
          Responda perguntas rápidas para descobrir qual{" "}
          <span className="text-foreground font-medium">Arquétipo de Bloqueio</span>{" "}
          está travando a sua vida amorosa — e como quebrar esse ciclo.
        </p>

        <button
          onClick={onStart}
          className="w-full px-10 py-4 rounded-2xl font-medium text-base tracking-wide bg-primary text-primary-foreground glow-button hover:brightness-110 active:scale-[0.97] transition-all duration-300"
        >
          Iniciar Análise Gratuita
        </button>

        <p className="text-muted-foreground text-xs mt-5 tracking-wide">
          ✦ Leva menos de 3 minutos
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
