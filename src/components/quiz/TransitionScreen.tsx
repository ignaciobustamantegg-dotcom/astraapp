import { useEffect, useState, useRef } from "react";
import Orbs from "./Orbs";
import { useQuizSounds } from "@/hooks/useQuizSounds";

interface TransitionScreenProps {
  text: string;
  duration?: number;
  onComplete: () => void;
}

const TransitionScreen = ({ text, duration = 3500, onComplete }: TransitionScreenProps) => {
  const [progress, setProgress] = useState(0);
  const { playSwoosh, playDataPulse } = useQuizSounds();
  const swooshPlayed = useRef(false);

  useEffect(() => {
    if (!swooshPlayed.current) {
      playSwoosh();
      swooshPlayed.current = true;
    }
  }, [playSwoosh]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 2, 100);
        if (next % 10 === 0) playDataPulse(next);
        return next;
      });
    }, duration / 50);

    const timeout = setTimeout(onComplete, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete, playDataPulse]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-deep relative">
      <Orbs />

      <div className="max-w-sm w-full text-center relative z-10 animate-fade-in-up">
        <div className="relative w-20 h-20 mx-auto mb-10">
          <div
            className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow"
          />
          <div
            className="absolute inset-2 rounded-full border border-accent/20"
            style={{ animation: "spin-slow 6s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary/60 animate-breathe" />
          </div>
        </div>

        <p className="text-secondary-foreground text-base leading-relaxed mb-10 font-light">
          {text}
        </p>

        <div className="w-full h-[3px] bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(270 50% 72%), hsl(200 60% 65%))",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
