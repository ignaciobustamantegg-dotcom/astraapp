import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyOrder } from "@/lib/session";
import Orbs from "@/components/quiz/Orbs";
import { Loader2, CheckCircle, AlertCircle, Mail, RotateCcw } from "lucide-react";

const MAX_POLL_MS = 30000;
const POLL_INTERVAL_MS = 2500;

const PostCheckout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"polling" | "success" | "timeout" | "error">("polling");
  const [errorMsg, setErrorMsg] = useState("");
  const orderId = params.get("order_id") || params.get("orderId") || "";

  const startPolling = useCallback(() => {
    if (!orderId) { setStatus("timeout"); return; }
    setStatus("polling");
    setErrorMsg("");

    const start = Date.now();
    const interval = setInterval(async () => {
      if (Date.now() - start > MAX_POLL_MS) {
        clearInterval(interval);
        setStatus("timeout");
        return;
      }
      try {
        const res = await verifyOrder(orderId);
        if (res.ok && res.token) {
          clearInterval(interval);
          setStatus("success");
          setTimeout(() => navigate(`/app?token=${res.token}`, { replace: true }), 1500);
          return;
        }
        if (res.error) {
          clearInterval(interval);
          setErrorMsg(res.error);
          setStatus("error");
        }
      } catch (e: any) {
        clearInterval(interval);
        setErrorMsg(e?.message || "Erro de conexão");
        setStatus("error");
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  useEffect(() => {
    const cleanup = startPolling();
    return cleanup;
  }, [startPolling]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
        {status === "polling" && (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-light text-foreground mb-3">Confirmando seu pagamento...</h1>
            <p className="text-muted-foreground text-sm">Isso pode levar alguns segundos. Não feche esta página.</p>
            <div className="mt-6 w-48 mx-auto h-1 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary animate-pulse rounded-full" style={{ width: "60%" }} />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-light text-foreground mb-3">Pagamento confirmado!</h1>
            <p className="text-muted-foreground text-sm">Redirecionando para o seu conteúdo...</p>
          </>
        )}

        {(status === "timeout" || status === "error") && (
          <>
            <AlertCircle className="w-12 h-12 text-accent mx-auto mb-6" />
            <h1 className="text-2xl font-light text-foreground mb-3">
              {status === "error" ? "Erro na verificação" : "Ainda processando..."}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {status === "error"
                ? "Houve um problema ao verificar seu pagamento. Se já pagou, tente novamente ou entre em contato com o suporte."
                : "O pagamento pode demorar um pouco mais. Se já pagou, clique abaixo para tentar novamente."}
            </p>
            {errorMsg && (
              <p className="text-destructive text-xs mb-4 bg-destructive/10 rounded-xl px-4 py-2">{errorMsg}</p>
            )}
            <button
              onClick={() => startPolling()}
              className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all mb-3"
            >
              <RotateCcw className="w-4 h-4" />
              Verificar novamente
            </button>
            <a
              href="/support"
              className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-2xl border border-border text-secondary-foreground font-medium hover:bg-secondary/50 transition-all mb-3"
            >
              <Mail className="w-4 h-4" />
              Falar com suporte
            </a>
            <a href="/quiz" className="block text-muted-foreground text-xs mt-2 underline">
              Voltar ao início
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCheckout;
