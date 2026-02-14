import { useState } from "react";
import { Shield } from "lucide-react";
import Orbs from "./Orbs";
import SocialProofPopup from "./SocialProofPopup";

interface EmailScreenProps {
  onSubmit: (email: string) => void;
}

const EmailScreen = ({ onSubmit }: EmailScreenProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }
    setError("");
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-gradient-deep relative">
      <Orbs />
      <SocialProofPopup initialDelay={3000} interval={7000} />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-xs tracking-widest uppercase">
              Progresso
            </span>
            <span className="text-primary text-xs font-medium">95%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: "95%" }}
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-breathe">
            <Shield className="w-7 h-7 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-foreground text-center mb-4 leading-tight tracking-tight">
          Análise Final:{" "}
          <span className="text-gradient-spirit font-medium italic">
            Onde devemos salvar o seu perfil?
          </span>
        </h1>

        <p className="text-secondary-foreground text-center text-[0.93rem] font-light leading-relaxed mb-10">
          Suas respostas foram processadas. Para que você possa acessar seu
          diagnóstico completo e o seu{" "}
          <span className="text-foreground font-medium">
            Plano de Desbloqueio
          </span>{" "}
          sempre que precisar, digite seu melhor e-mail abaixo.
        </p>

        <div className="space-y-4 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Seu e-mail mais usado..."
            className="w-full px-5 py-4 rounded-2xl bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center w-full px-8 py-4 rounded-2xl font-medium text-base tracking-wide bg-primary text-primary-foreground glow-button hover:brightness-110 active:scale-[0.97] transition-all duration-300"
        >
          Gerar meu Diagnóstico Agora
        </button>

        <p className="text-muted-foreground text-xs text-center mt-5 tracking-wide">
          🔒 Seus dados estão protegidos. Não enviamos spam.
        </p>

        <div className="bg-gradient-card-glass border-glass rounded-2xl px-5 py-4 mt-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs">
              R
            </div>
            <div>
              <span className="text-foreground text-xs font-medium">Roberta A., 34</span>
              <span className="text-muted-foreground text-[10px] ml-1.5">— Salvador</span>
            </div>
          </div>
          <p className="text-secondary-foreground text-xs leading-relaxed font-light italic">
            "Quase não coloquei meu e-mail. Ainda bem que coloquei. O diagnóstico que recebi era exatamente o que eu precisava ouvir."
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailScreen;
