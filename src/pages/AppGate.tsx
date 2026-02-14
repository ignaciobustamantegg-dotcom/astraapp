import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyToken } from "@/lib/api";
import { Lock, Unlock } from "lucide-react";

const AppGate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<"loading" | "valid" | "invalid">("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }

    verifyToken(token)
      .then((res) => {
        setState(res.ok ? "valid" : "invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-background">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
          <Lock className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-light text-foreground">Acesso restrito</h1>
          <p className="text-muted-foreground text-sm">
            Seu token de acesso é inválido ou expirou. Complete a compra para desbloquear o conteúdo.
          </p>
          <button
            onClick={() => navigate("/quiz")}
            className="w-full px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
          >
            Fazer o teste agora
          </button>
        </div>
      </div>
    );
  }

  // VALID — render the product content
  return (
    <div className="min-h-screen bg-background px-5 py-12">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <Unlock className="w-5 h-5 text-primary" />
          <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">
            Conteúdo Desbloqueado
          </span>
        </div>

        <h1 className="text-3xl font-light text-foreground mb-6 tracking-tight">
          Seu Relatório Completo +{" "}
          <span className="text-gradient-spirit font-medium italic">
            Plano de Quebra de Padrão
          </span>
        </h1>

        <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            Parabéns! Você desbloqueou o acesso completo ao seu diagnóstico personalizado e ao plano de 21 dias para quebrar seus padrões de repetição.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            O conteúdo do seu plano personalizado será exibido aqui. Este é o espaço protegido do produto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppGate;
