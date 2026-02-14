import { useEffect } from "react";
import { getSessionId, getUtms } from "@/lib/session";
import { trackEvent } from "@/lib/api";

const CARTPANDA_CHECKOUT_URL = import.meta.env.VITE_CARTPANDA_CHECKOUT_URL || "";

const Checkout = () => {
  useEffect(() => {
    const sid = getSessionId();
    const utms = getUtms();

    if (sid) {
      trackEvent(sid, "click_checkout");
    }

    // Build Cartpanda URL
    const url = new URL(CARTPANDA_CHECKOUT_URL || window.location.origin);
    if (sid) url.searchParams.set("sid", sid);
    if (utms.utm_source) url.searchParams.set("utm_source", utms.utm_source);
    if (utms.utm_medium) url.searchParams.set("utm_medium", utms.utm_medium);
    if (utms.utm_campaign) url.searchParams.set("utm_campaign", utms.utm_campaign);

    // Redirect
    if (CARTPANDA_CHECKOUT_URL) {
      window.location.href = url.toString();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">
          Redirecionando para o checkout seguro...
        </p>
        {!CARTPANDA_CHECKOUT_URL && (
          <p className="text-destructive text-xs mt-4">
            URL de checkout não configurada. Configure VITE_CARTPANDA_CHECKOUT_URL.
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
