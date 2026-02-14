import { Zap } from "lucide-react";

const UpsellBanner = () => {
  return (
    <div className="bg-gradient-card-glass border-glass rounded-2xl p-6 text-center glow-soft">
      <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4">
        <Zap className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-light text-foreground mb-2 tracking-tight">
        Protocolo Short-Circuit
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed mb-5 max-w-xs mx-auto">
        Acelere seus resultados em 7 dias com técnicas avançadas de reprogramação subconsciente e áudios exclusivos.
      </p>
      <button className="px-6 py-3 rounded-2xl bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 active:scale-[0.97] transition-all">
        Quero Acelerar — R$ 47,00
      </button>
    </div>
  );
};

export default UpsellBanner;
