import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { X, Star, Check } from "lucide-react";

type PlanId = "weekly" | "annual" | "lifetime";

const PLANS: { id: PlanId; name: string; price: string; subtitle: string }[] = [
  { id: "weekly", name: "Semanal", price: "$6.990", subtitle: "semanais" },
  { id: "annual", name: "Anual", price: "$69.990", subtitle: "com pagamento anual" },
  { id: "lifetime", name: "Vitalício", price: "$99.990", subtitle: "pagamento único" },
];

// Placeholder checkout URLs — replace with real CartPanda links
const CHECKOUT_URLS: Record<string, string> = {
  weekly: "https://cartpanda.com/checkout/weekly",
  "weekly-trial": "https://cartpanda.com/checkout/weekly-trial",
  annual: "https://cartpanda.com/checkout/annual",
  lifetime: "https://cartpanda.com/checkout/lifetime",
};

const Plans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("weekly");
  const [trialEnabled, setTrialEnabled] = useState(false);

  const handleContinue = () => {
    const key = selectedPlan === "weekly" && trialEnabled ? "weekly-trial" : selectedPlan;
    const checkoutUrl = CHECKOUT_URLS[key];

    localStorage.setItem(
      "astra_pending_plan",
      JSON.stringify({ plan: selectedPlan, trial: trialEnabled })
    );

    window.location.href = checkoutUrl;
  };

  const ctaLabel =
    selectedPlan === "weekly" && trialEnabled
      ? "Continuar com os 3 dias de teste"
      : "Continuar";

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 safe-top">
        <button
          onClick={() => navigate("/")}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="min-h-[44px] min-w-[44px]" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto no-scrollbar safe-bottom">
        {/* Social proof */}
        <motion.div
          className="text-center mt-4 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Pequenas mudanças, grande impacto
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Amei! Este aplicativo transformou como eu me sinto comigo mesma e com a minha vida.
          </p>
          <p className="text-xs text-primary mt-2">Maria R. ★★★★★</p>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="text-center text-base font-semibold text-foreground mb-4">
            Plano com acesso completo
          </h3>

          <div className="space-y-3">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isWeekly = plan.id === "weekly";

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left rounded-2xl border-2 transition-all press-scale ${
                    isSelected
                      ? "border-primary bg-card/80"
                      : "border-border/50 bg-card/40"
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-[0.9rem] font-medium text-foreground">
                        {isWeekly && trialEnabled
                          ? "3 dias de teste grátis"
                          : plan.name}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-0.5">
                        {isWeekly && trialEnabled
                          ? `depois ${plan.price} semanais`
                          : `${plan.price} ${plan.subtitle}`}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isSelected
                          ? "bg-primary"
                          : "border-2 border-border"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-background" />}
                    </div>
                  </div>

                  {/* Free trial toggle — only on weekly */}
                  {isWeekly && isSelected && (
                    <div className="border-t border-border/50 px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ativar o teste gratuito
                      </span>
                      <Switch
                        checked={trialEnabled}
                        onCheckedChange={(val) => {
                          setTrialEnabled(val);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide bg-primary text-background hover:bg-primary/90 press-scale"
          >
            {ctaLabel}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
            A assinatura é paga semanalmente e renovada automaticamente.
            <br />
            Você pode cancelar a qualquer momento.
          </p>

          <div className="flex justify-center gap-6 mt-4">
            <a href="/terms" className="text-xs text-primary underline underline-offset-4">
              Termos de uso
            </a>
            <button className="text-xs text-primary underline underline-offset-4">
              Política de privacidade
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Plans;
