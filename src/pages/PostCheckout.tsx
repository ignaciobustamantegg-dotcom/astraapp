import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyOrder } from "@/lib/api";
import { Shield } from "lucide-react";

const POLL_INTERVAL = 2500;
const POLL_TIMEOUT = 45000;

const PostCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"polling" | "success" | "timeout">("polling");
  const startRef = useRef(Date.now());
  const orderId = searchParams.get("order_id") || searchParams.get("orderId") || "";

  useEffect(() => {
    if (!orderId) {
      setStatus("timeout");
      return;
    }

    const poll = async () => {
      try {
        const res = await verifyOrder(orderId);
        if (res.ok && res.token) {
          setStatus("success");
          navigate(`/app?token=${res.token}`, { replace: true });
          return;
        }
      } catch (e) {
        console.error("Poll error:", e);
      }

      if (Date.now() - startRef.current > POLL_TIMEOUT) {
        setStatus("timeout");
        return;
      }

      setTimeout(poll, POLL_INTERVAL);
    };

    poll();
  }, [orderId, navigate]);

  const handleRetry = () => {
    startRef.current = Date.now();
    setStatus("polling");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
        {status === "polling" && (
          <>
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-2xl font-light text-foreground">Confirmando seu pagamento...</h1>
            <p className="text-muted-foreground text-sm">
              Estamos verificando com o processador. Isso pode levar alguns segundos.
            </p>
          </>
        )}

        {status === "timeout" && (
          <>
            <Shield className="w-12 h-12 text-primary mx-auto" />
            <h1 className="text-2xl font-light text-foreground">Ainda estamos processando</h1>
            <p className="text-muted-foreground text-sm">
              Seu pagamento pode levar um momento para ser confirmado. Tente novamente ou entre em contato com o suporte.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
              >
                Já paguei — Verificar novamente
              </button>
              <button
                onClick={() => navigate("/quiz")}
                className="w-full px-6 py-3 rounded-2xl border border-border text-foreground font-light hover:bg-secondary transition-all"
              >
                Voltar ao início
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCheckout;
