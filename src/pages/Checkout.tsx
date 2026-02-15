import { useEffect } from "react";
import { getSessionId, trackEvent, getClickIds } from "@/lib/session";
import Orbs from "@/components/quiz/Orbs";
import { ExternalLink } from "lucide-react";

const CHECKOUT_URL = import.meta.env.VITE_CARTPANDA_CHECKOUT_URL || localStorage.getItem("CARTPANDA_CHECKOUT_URL") || "";

const Checkout = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("[Checkout] VITE_CARTPANDA_CHECKOUT_URL:", import.meta.env.VITE_CARTPANDA_CHECKOUT_URL ? "SET" : "NOT SET");
      console.warn("[Checkout] Resolved CHECKOUT_URL:", CHECKOUT_URL || "(empty)");
    }
    trackEvent("view_checkout");
  }, []);

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
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />
      <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
        <h1 className="text-3xl font-light text-foreground mb-4">Finalizar Compra</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Você será redirecionada para o ambiente seguro de pagamento.
        </p>
        <button
          onClick={handleCheckout}
          className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl font-medium bg-primary text-primary-foreground glow-button hover:brightness-110 active:scale-[0.97] transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Ir para o pagamento
        </button>
      </div>
    </div>
  );
};

export default Checkout;
