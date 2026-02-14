import { useEffect, useState } from "react";

const AVATARS = [
  { name: "Marina L.", badge: "Padrão Desbloqueado" },
  { name: "Camila R.", badge: "Padrão Desbloqueado" },
  { name: "Juliana M.", badge: "Padrão Desbloqueado" },
  { name: "Fernanda S.", badge: "Padrão Desbloqueado" },
  { name: "Patrícia L.", badge: "Padrão Desbloqueado" },
  { name: "Beatriz C.", badge: "Padrão Desbloqueado" },
];

const SocialProofAvatars = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= AVATARS.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-card-glass border-glass rounded-2xl p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
        🔓 Quem já desbloqueou seu padrão
      </p>
      <div className="flex flex-wrap gap-3">
        {AVATARS.map((avatar, i) => (
          <div
            key={i}
            className="flex items-center gap-2 transition-all duration-500"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs text-foreground font-medium">
              {avatar.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-xs font-medium">{avatar.name}</span>
              <span className="text-accent text-[10px]">✦ {avatar.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProofAvatars;
