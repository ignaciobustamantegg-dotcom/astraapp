import { ArrowRight } from "lucide-react";

interface BeforeAfterItem {
  before: string;
  after: string;
}

interface BeforeAfterProps {
  items: BeforeAfterItem[];
}

const BeforeAfter = ({ items }: BeforeAfterProps) => {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-gradient-card-glass border-glass rounded-2xl px-4 py-3 animate-fade-in-up"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-0.5">
              Antes
            </span>
            <p className="text-xs text-secondary-foreground font-light leading-snug line-through decoration-destructive/40">
              {item.before}
            </p>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-primary block mb-0.5">
              Depois
            </span>
            <p className="text-xs text-foreground font-light leading-snug">
              {item.after}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BeforeAfter;
