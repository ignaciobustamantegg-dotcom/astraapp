import { useEffect, useState } from "react";

interface ThermometerGaugeProps {
  label: string;
  value: number;
  color?: "danger" | "warning" | "accent";
  animate?: boolean;
}

const colorMap = {
  danger: {
    bar: "linear-gradient(90deg, hsl(0 70% 55%), hsl(0 84% 60%))",
    glow: "hsl(0 70% 55% / 0.4)",
    text: "hsl(0 84% 65%)",
  },
  warning: {
    bar: "linear-gradient(90deg, hsl(35 90% 55%), hsl(25 85% 50%))",
    glow: "hsl(35 90% 55% / 0.3)",
    text: "hsl(35 90% 60%)",
  },
  accent: {
    bar: "linear-gradient(90deg, hsl(270 50% 72%), hsl(200 60% 65%))",
    glow: "hsl(270 50% 65% / 0.3)",
    text: "hsl(270 50% 78%)",
  },
};

const ThermometerGauge = ({ label, value, color = "danger", animate = true }: ThermometerGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const colors = colorMap[color];

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value, animate]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-secondary-foreground font-light tracking-wide">
          {label}
        </span>
        <span
          className="text-sm font-medium tabular-nums"
          style={{ color: colors.text }}
        >
          {displayValue}%
        </span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-[1.5s] ease-out relative"
          style={{
            width: `${displayValue}%`,
            background: colors.bar,
            boxShadow: `0 0 12px ${colors.glow}`,
          }}
        />
      </div>
    </div>
  );
};

export default ThermometerGauge;
