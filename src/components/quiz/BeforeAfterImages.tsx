import { useState, useEffect } from "react";

const BeforeAfterImages = () => {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setShowAfter((v) => !v), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-card-glass border-glass rounded-2xl p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 text-center">
        ✦ Transformação Real
      </p>
      <div className="relative w-full h-48 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
          style={{ opacity: showAfter ? 0 : 1 }}
        >
          <svg viewBox="0 0 120 120" className="w-24 h-24 mb-2">
            <circle cx="60" cy="35" r="18" fill="hsl(0 60% 55% / 0.3)" />
            <path d="M40 60 Q60 90 80 60" stroke="hsl(0 60% 55% / 0.5)" strokeWidth="2" fill="none" />
            <line x1="30" y1="70" x2="50" y2="100" stroke="hsl(0 60% 55% / 0.3)" strokeWidth="2" />
            <line x1="90" y1="70" x2="70" y2="100" stroke="hsl(0 60% 55% / 0.3)" strokeWidth="2" />
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={20 + i * 16}
                y1={20 + (i % 3) * 10}
                x2={30 + i * 14}
                y2={10 + (i % 2) * 20}
                stroke="hsl(0 70% 60% / 0.2)"
                strokeWidth="1"
              />
            ))}
          </svg>
          <span className="text-destructive/70 text-xs font-medium uppercase tracking-widest">
            Antes — Caos Emocional
          </span>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
          style={{ opacity: showAfter ? 1 : 0 }}
        >
          <svg viewBox="0 0 120 120" className="w-24 h-24 mb-2">
            <circle cx="60" cy="35" r="18" fill="hsl(270 50% 72% / 0.3)" />
            <path d="M40 55 Q60 75 80 55" stroke="hsl(270 50% 72% / 0.5)" strokeWidth="2" fill="none" />
            <line x1="35" y1="65" x2="45" y2="100" stroke="hsl(270 50% 72% / 0.3)" strokeWidth="2" />
            <line x1="85" y1="65" x2="75" y2="100" stroke="hsl(270 50% 72% / 0.3)" strokeWidth="2" />
            <circle cx="60" cy="60" r="35" stroke="hsl(200 60% 65% / 0.15)" strokeWidth="1" fill="none" />
            <circle cx="60" cy="60" r="45" stroke="hsl(270 50% 72% / 0.1)" strokeWidth="1" fill="none" />
          </svg>
          <span className="text-primary/80 text-xs font-medium uppercase tracking-widest">
            Depois — Clareza Interior
          </span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterImages;
