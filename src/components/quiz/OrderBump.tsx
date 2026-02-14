import { useState } from "react";
import { Zap } from "lucide-react";

interface OrderBumpProps {
  onToggle?: (selected: boolean) => void;
}

const OrderBump = ({ onToggle }: OrderBumpProps) => {
  const [selected, setSelected] = useState(false);

  const toggle = () => {
    const next = !selected;
    setSelected(next);
    onToggle?.(next);
  };

  return (
    <div
      onClick={toggle}
      className={`cursor-pointer bg-gradient-card-glass border-glass rounded-2xl p-5 transition-all duration-300 ${
        selected ? "ring-2 ring-primary/50 glow-soft" : "hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40"
          }`}
        >
          {selected && <span className="text-xs">✓</span>}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-foreground text-sm font-medium">
              Protocolo Acelerado
            </span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Desbloqueie os 21 dias de uma vez + áudios de reprogramação exclusivos.
          </p>
          <p className="text-primary text-sm font-medium mt-2">+ R$ 17,00</p>
        </div>
      </div>
    </div>
  );
};

export default OrderBump;
