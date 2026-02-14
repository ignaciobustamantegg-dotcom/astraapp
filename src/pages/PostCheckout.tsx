import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyOrder } from "@/lib/session";
import Orbs from "@/components/quiz/Orbs";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const PostCheckout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"polling" | "success" | "timeout">("polling");
  const orderId = params.get("order_id") || params.get("orderId") || "";

  useEffect(() => {
    if (!orderId) { setStatus("timeout"); return; }

    let attempts = 0;
    const maxAttempts = 15; // ~37.5s
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await verifyOrder(orderId);
        if (res.ok && res.token) {
          clearInterval(interval);
          setStatus("success");
          setTimeout(() => navigate(`/app?token=${res.token}`, { replace: true }), 1500);
          return;
        }
      } catch {}
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus("timeout");
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
        {status === "polling" && (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-light text-foreground mb-3">Confirmando seu pagamento...</h1>
            <p className="text-muted-foreground text-sm">Isso pode levar alguns segundos. Não feche esta página.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-light text-foreground mb-3">Pagamento confirmado!</h1>
            <p className="text-muted-foreground text-sm">Redirecionando para o seu conteúdo...</p>
          </>
        )}
        {status === "timeout" && (
          <>
            <AlertCircle className="w-12 h-12 text-accent mx-auto mb-6" />
            <h1 className="text-2xl font-light text-foreground mb-3">Ainda processando...</h1>
            <p className="text-muted-foreground text-sm mb-6">O pagamento pode demorar um pouco mais. Se já pagou, clique abaixo para tentar novamente.</p>
            <button
              onClick={() => { setStatus("polling"); window.location.reload(); }}
              className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-medium glow-button hover:brightness-110 transition-all"
            >
              Verificar novamente
            </button>
            <a href="/quiz" className="block text-muted-foreground text-xs mt-4 underline">
              Voltar ao início
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCheckout;
