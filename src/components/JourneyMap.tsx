import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Check, Compass, Eye, Layers, Zap, GitBranch, Scale, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import JourneyMapSkeleton from "./JourneyMapSkeleton";

const AUDIT_DAYS = [
  { day: 1, title: "Identificação da Inércia", icon: Compass },
  { day: 2, title: "A Mecânica da Conexão", icon: GitBranch },
  { day: 3, title: "O Espelho Interno", icon: Eye },
  { day: 4, title: "Revisão de Energia", icon: Zap },
  { day: 5, title: "Momentos Decisivos", icon: Layers },
  { day: 6, title: "O Custo da Oportunidade", icon: Scale },
  { day: 7, title: "Sua Nova Perspectiva", icon: Gavel },
];

const NODE_POSITIONS = [37, 15, 59, 25, 55, 19, 37];

type AuditProgress = {
  current_day: number;
  [key: string]: any;
};

const JourneyMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        <p className="text-xs text-muted-foreground mb-1">Bem-vindo(a), {displayName}</p>
        <h1 className="text-xl font-medium text-foreground">
          Seu mapa de 7 dias
        </h1>
      </motion.div>

      {/* Journey Map */}
      <div className="relative px-3" style={{ height: totalHeight }}>
        <svg
          ref={pathRef}
          className="absolute inset-0 w-full"
          style={{ height: totalHeight }}
          viewBox={`0 0 400 ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
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
                status === "locked" ? "text-muted-foreground/30" : status === "completed" ? "text-primary/60" : "text-primary/80"
              }`}>
                Dia {item.day}
              </span>

              <button
                disabled={status === "locked"}
                onClick={() => {
                  if (status !== "locked") navigate(`/journey/day/${item.day}`);
                }}
                className={`relative flex items-center justify-center press-scale ${
                  status === "locked" ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ width: 82, height: 82 }}
              >
                {/* === COMPLETED STATE === */}
                {status === "completed" && (
                  <>
                    {/* Outer glow ring */}
                    <div
                      className="absolute inset-[-5px] rounded-full"
                      style={{
                        background: "linear-gradient(135deg, hsla(45, 80%, 60%, 0.25), hsla(35, 70%, 50%, 0.2))",
                        border: "2px solid hsla(45, 70%, 55%, 0.4)",
                      }}
                    />
                    {/* Main circle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(145deg, hsl(42, 65%, 52%), hsl(35, 55%, 40%))",
                        boxShadow: "0 4px 20px hsla(42, 70%, 50%, 0.3), inset 0 2px 4px hsla(45, 80%, 75%, 0.2)",
                      }}
                    />
                    {/* Check icon */}
                    <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsla(0, 0%, 100%, 0.18)" }}>
                      <Check className="w-5 h-5" style={{ color: "hsl(0, 0%, 100%)" }} strokeWidth={3} />
                    </div>
                  </>
                )}

                {/* === UNLOCKED (CURRENT) STATE === */}
                {status === "unlocked" && (
                  <>
                    {/* Animated outer pulse */}
                    <motion.div
                      className="absolute inset-[-8px] rounded-full"
                      style={{
                        border: "2px solid hsla(270, 70%, 75%, 0.3)",
                        background: "hsla(270, 60%, 65%, 0.05)",
                      }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 0.1, 0.6],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Static outer ring */}
                    <div
                      className="absolute inset-[-4px] rounded-full"
                      style={{
                        border: "2.5px solid hsla(270, 65%, 70%, 0.5)",
                        background: "transparent",
                      }}
                    />
                    {/* Bright main circle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(145deg, hsl(270, 65%, 68%), hsl(265, 55%, 55%))",
                        boxShadow: "0 0 30px hsla(270, 70%, 65%, 0.4), 0 0 60px hsla(270, 60%, 55%, 0.15), inset 0 2px 6px hsla(270, 80%, 85%, 0.2)",
                      }}
                    />
                    {/* Shimmer overlay */}
                    <motion.div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <div
                        className="absolute w-full h-full"
                        style={{
                          background: "conic-gradient(from 0deg, transparent 0%, hsla(0, 0%, 100%, 0.08) 15%, transparent 30%)",
                        }}
                      />
                    </motion.div>
                    {/* Icon */}
                    <IconComponent className="w-7 h-7 relative z-10" style={{ color: "hsl(0, 0%, 100%)" }} />
                  </>
                )}

                {/* === LOCKED STATE === */}
                {status === "locked" && (
                  <>
                    {/* Outer ring */}
                    <div
                      className="absolute inset-[-3px] rounded-full"
                      style={{
                        border: "2px solid hsla(260, 20%, 22%, 0.8)",
                        background: "transparent",
                      }}
                    />
                    {/* Dark main circle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(145deg, hsl(260, 22%, 16%), hsl(260, 25%, 12%))",
                        boxShadow: "inset 0 2px 6px hsla(260, 30%, 8%, 0.5), inset 0 -1px 3px hsla(260, 20%, 25%, 0.2)",
                      }}
                    />
                    {/* Lock icon */}
                    <Lock className="w-5 h-5 relative z-10 text-muted-foreground/35" />
                  </>
                )}
              </button>

              <p className={`text-center text-[13px] font-medium leading-tight mt-2.5 max-w-[130px] ${
                status === "locked"
                  ? "text-muted-foreground/25"
                  : status === "completed"
                    ? "text-foreground/60"
                    : "text-foreground/90"
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
