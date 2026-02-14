import { useState, useEffect } from "react";
import { Clock, Unlock } from "lucide-react";

interface UrgencyTimerProps {
  onCtaClick?: () => void;
}

const TIMER_KEY = "urgency_timer_start";
const DURATION = 300;

const UrgencyTimer = ({ onCtaClick }: UrgencyTimerProps) => {
  const [remaining, setRemaining] = useState(DURATION);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let start = sessionStorage.getItem(TIMER_KEY);
    if (!start) {
      start = String(Date.now());
      sessionStorage.setItem(TIMER_KEY, start);
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - Number(start)) / 1000);
      setRemaining(Math.max(0, DURATION - elapsed));
    };
    tick();
    const interval = setInterval(tick, 1000);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    const sentinel = document.getElementById("urgency-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  if (!visible) return null;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining < 60;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 animate-fade-in-up ${
        isUrgent ? "animate-pulse-urgent" : ""
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isUrgent ? "text-destructive" : "text-primary"}`} />
          <span className={`text-sm font-medium ${isUrgent ? "text-destructive" : "text-foreground"}`}>
            {remaining <= 0
              ? "Oferta quase expirando!"
              : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`}
          </span>
          <span className="text-muted-foreground text-xs hidden sm:inline">
            para garantir R$ 27
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium glow-button hover:brightness-110 active:scale-[0.97] transition-all"
        >
          <Unlock className="w-3 h-3" />
          Desbloquear
        </button>
      </div>
    </div>
  );
};

export default UrgencyTimer;
