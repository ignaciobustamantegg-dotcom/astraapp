import { useEffect, useState } from "react";
import { Users, Sparkles, Eye, ShieldCheck, TrendingUp } from "lucide-react";

interface Notification {
  icon: React.ReactNode;
  text: string;
  highlight?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    icon: <Users className="w-4 h-4 text-primary" />,
    text: "Maria S. acabou de completar o teste",
    highlight: "há 2 min",
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-accent" />,
    text: "347 mulheres fizeram o teste",
    highlight: "nas últimas 24h",
  },
  {
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    text: "Ana P. desbloqueou seu relatório",
    highlight: "agora mesmo",
  },
  {
    icon: <Eye className="w-4 h-4 text-accent" />,
    text: "12 pessoas estão fazendo o teste",
    highlight: "neste momento",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
    text: "Juliana R. descobriu seu Arquétipo",
    highlight: "há 5 min",
  },
  {
    icon: <Users className="w-4 h-4 text-accent" />,
    text: "Camila F. acabou de iniciar a análise",
    highlight: "há 1 min",
  },
  {
    icon: <Sparkles className="w-4 h-4 text-primary" />,
    text: "Fernanda L. quebrou seu padrão",
    highlight: "hoje",
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-accent" />,
    text: "93% identificaram um bloqueio ativo",
    highlight: "resultado comum",
  },
];

interface SocialProofPopupProps {
  initialDelay?: number;
  interval?: number;
  maxCount?: number;
}

const SocialProofPopup = ({
  initialDelay = 3000,
  interval = 8000,
  maxCount = 0,
}: SocialProofPopupProps) => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    let showTimeout: ReturnType<typeof setTimeout>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (maxCount > 0 && shownCount >= maxCount) return;

      const randomNotif =
        NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      setCurrent(randomNotif);
      setVisible(true);
      setShownCount((c) => c + 1);

      hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    showTimeout = setTimeout(showNext, shownCount === 0 ? initialDelay : interval);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [shownCount, initialDelay, interval, maxCount]);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs z-50 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-card-glass border-glass rounded-2xl px-4 py-3 flex items-center gap-3 glow-soft">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          {current.icon}
        </div>
        <div className="min-w-0">
          <p className="text-foreground text-sm font-light leading-snug truncate">
            {current.text}
          </p>
          {current.highlight && (
            <p className="text-primary text-xs mt-0.5 font-medium">
              {current.highlight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialProofPopup;
