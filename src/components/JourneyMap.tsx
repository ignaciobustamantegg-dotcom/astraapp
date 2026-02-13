import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, CheckCircle2, Compass, Eye, Layers, Zap, GitBranch, Scale, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import JourneyMapSkeleton from "./JourneyMapSkeleton";

const AUDIT_DAYS = [
  { day: 1, title: "Identificación de la Inercia", icon: Compass },
  { day: 2, title: "La Mecánica de la Conexión", icon: GitBranch },
  { day: 3, title: "El Espejo de las Sombras", icon: Eye },
  { day: 4, title: "Auditoría de Vitalidad", icon: Zap },
  { day: 5, title: "Hitos del Destino", icon: Layers },
  { day: 6, title: "El Costo de la Oportunidad", icon: Scale },
  { day: 7, title: "El Veredicto Final", icon: Gavel },
];

const NODE_POSITIONS = [40, 18, 62, 28, 58, 22, 40];

type AuditProgress = {
  current_day: number;
  [key: string]: any;
};

const JourneyMap = () => {
  const { user } = useAuth();
  const pathRef = useRef<SVGSVGElement>(null);

  const { data: profileData } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("display_name").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const { data: progressData, isLoading } = useQuery({
    queryKey: ["audit_progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("audit_progress").select("*").eq("user_id", user!.id).maybeSingle();
      return data as AuditProgress | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const displayName = profileData?.display_name || user?.email?.split("@")[0] || "";
  const progress = progressData ?? null;

  const currentDay = progress?.current_day || 1;

  const getDayStatus = (day: number): "completed" | "unlocked" | "locked" => {
    if (day < currentDay) return "completed";
    if (day === currentDay) return "unlocked";
    return "locked";
  };

  const generatePath = () => {
    const nodeSpacing = 160;
    const topOffset = 40;
    const points = NODE_POSITIONS.map((x, i) => ({
      x: (x / 100) * 400,
      y: topOffset + i * nodeSpacing,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midY = (curr.y + next.y) / 2;
      d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
    }
    return { d, points, totalHeight: topOffset + (points.length - 1) * nodeSpacing + 80 };
  };

  const { d: pathD, points, totalHeight } = generatePath();

  if (isLoading) {
    return <JourneyMapSkeleton />;
  }

  return (
    <>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pt-5 pb-2 text-center"
      >
        <p className="text-xs text-muted-foreground mb-1">Bienvenido, {displayName}</p>
        <h1 className="text-xl font-medium text-foreground">
          Tu Auditoría Emocional
        </h1>
      </motion.div>

      {/* Journey Map */}
      <div className="relative px-3" style={{ height: totalHeight }}>
        {/* SVG Path */}
        <svg
          ref={pathRef}
          className="absolute inset-0 w-full"
          style={{ height: totalHeight }}
          viewBox={`0 0 400 ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          <path
            d={pathD}
            stroke="hsl(260, 30%, 20%)"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            opacity="0.5"
          />
          {currentDay > 1 && (
            <path
              d={pathD}
              stroke="hsl(270, 60%, 65%)"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
              strokeDasharray={`${(currentDay - 1) * 160} 9999`}
            />
          )}
        </svg>

        {/* Nodes */}
        {AUDIT_DAYS.map((item, i) => {
          const status = getDayStatus(item.day);
          const point = points[i];
          const IconComponent = item.icon;

          return (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="absolute flex flex-col items-center"
              style={{
                left: `${(point.x / 400) * 100}%`,
                top: point.y,
                transform: 'translate(-50%, -50%)',
                width: 140,
              }}
            >
              <span className={`text-[10px] font-medium tracking-[0.15em] uppercase mb-2 ${
                status === "locked" ? "text-muted-foreground/40" : "text-primary/70"
              }`}>
                Día {item.day}
              </span>

              <button
                disabled={status === "locked"}
                className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 press-scale ${
                  status === "locked"
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                style={{
                  background: status === "locked"
                    ? 'hsl(260, 25%, 14%)'
                    : status === "completed"
                      ? 'linear-gradient(135deg, hsl(270, 45%, 30%), hsl(270, 40%, 22%))'
                      : 'linear-gradient(135deg, hsl(270, 50%, 35%), hsl(260, 40%, 20%))',
                  boxShadow: status === "unlocked"
                    ? '0 0 30px hsla(270, 80%, 65%, 0.35), 0 0 60px hsla(270, 70%, 55%, 0.15), inset 0 1px 1px hsla(270, 60%, 80%, 0.1)'
                    : status === "completed"
                      ? '0 0 20px hsla(270, 50%, 60%, 0.2), inset 0 1px 1px hsla(270, 60%, 80%, 0.08)'
                      : 'none',
                  border: status === "locked"
                    ? '2px solid hsl(260, 20%, 20%)'
                    : status === "unlocked"
                      ? '2px solid hsl(270, 60%, 55%)'
                      : '2px solid hsl(270, 40%, 35%)',
                }}
              >
                {status === "unlocked" && (
                  <motion.div
                    className="absolute inset-[-4px] rounded-full"
                    style={{
                      border: '1.5px solid hsl(270, 70%, 65%)',
                      opacity: 0.4,
                    }}
                    animate={{
                      scale: [1, 1.12, 1],
                      opacity: [0.4, 0.15, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {status === "locked" ? (
                  <Lock className="w-5 h-5 text-muted-foreground/50" />
                ) : status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-primary/80" />
                ) : (
                  <IconComponent className="w-6 h-6 text-primary" />
                )}
              </button>

              <p className={`text-center text-[13px] font-medium leading-tight mt-2.5 max-w-[130px] ${
                status === "locked"
                  ? "text-muted-foreground/30"
                  : status === "completed"
                    ? "text-foreground/70"
                    : "text-foreground"
              }`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default JourneyMap;
