import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyToken } from "@/lib/session";
import { Loader2, Lock, Mail } from "lucide-react";

const GatedApp = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "valid" | "invalid" | "expired">("loading");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }

    verifyToken(token).then((res) => {
      if (res.ok) setState("valid");
      else if (res.reason === "expired") setState("expired");
      else setState("invalid");
    }).catch(() => setState("invalid"));
  }, [token]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-deep">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (state === "invalid" || state === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-light text-foreground mb-3">
            {state === "expired" ? "Acesso expirado" : "Acesso não autorizado"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {state === "expired"
              ? "Seu link de acesso expirou. Solicite um novo link por email."
              : "Seu link de acesso é inválido. Faça o quiz e adquira o plano para desbloquear."}
          </p>

          <a
            href="mailto:suporte@astraapp.com.br?subject=Recuperar%20acesso&body=Olá,%20gostaria%20de%20recuperar%20meu%20acesso%20ao%20conteúdo."
            className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all mb-3"
          >
            <Mail className="w-4 h-4" />
            Recuperar acesso por email
          </a>

          <a
            href="/quiz"
            className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-2xl border border-border text-secondary-foreground font-medium hover:bg-secondary/50 transition-all mb-3"
          >
            Fazer o Quiz
          </a>

          <a href="/support" className="block text-muted-foreground text-xs mt-2 underline">
            Precisa de ajuda?
          </a>
        </div>
      </div>
    );
  }

  // Token valid — render the actual product content
  return (
    <div className="min-h-screen bg-gradient-deep px-5 py-12">
      <div className="max-w-md mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-breathe" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">
            Conteúdo Desbloqueado
          </span>
        </div>

        <h1 className="text-3xl font-light text-foreground mb-6">
          Seu Plano de{" "}
          <span className="text-gradient-spirit font-medium italic">Desbloqueio</span>
        </h1>

        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 mb-6">
          <p className="text-secondary-foreground text-sm leading-relaxed font-light">
            Parabéns! Você desbloqueou o acesso completo ao seu Relatório de Arquétipo e Plano de Quebra de Padrão personalizado. O conteúdo completo está disponível abaixo.
          </p>
        </div>

        {/* TODO: Replace with actual product content */}
        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 space-y-4">
          <h2 className="text-foreground text-lg font-medium">📋 Seu Relatório Completo</h2>
          <p className="text-secondary-foreground text-sm leading-relaxed font-light">
            O conteúdo do produto será exibido aqui. Este é um placeholder que será substituído pelo conteúdo real do programa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GatedApp;
