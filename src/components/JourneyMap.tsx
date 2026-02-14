import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Compass, Eye, Layers, Zap, GitBranch, Scale, Gavel } from "lucide-react";
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
        {/* SVG Path */}
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
                status === "locked" ? "text-muted-foreground/40" : "text-primary/70"
              }`}>
                Dia {item.day}
              </span>

              {status === "completed" ? (
                <button
                  onClick={() => navigate(`/journey/day/${item.day}`)}
                  className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center cursor-pointer press-scale"
                  style={{
                    background: 'hsl(220, 20%, 12%)',
                    border: '3.5px solid hsl(42, 70%, 40%)',
                    boxShadow: '0 0 20px hsla(42, 80%, 50%, 0.15)',
                  }}
                >
                  {/* Outer golden ring */}
                  <div
                    className="absolute inset-[-2px] rounded-full"
                    style={{
                      border: '3.5px solid hsla(45, 60%, 75%, 0.7)',
                    }}
                  />
                  {/* Inner golden circle */}
                  <div
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at center, hsl(45, 100%, 97%), hsl(42, 80%, 65%))',
                      boxShadow: 'inset 0 2px 4px hsla(45, 80%, 90%, 0.5), inset 0 -2px 4px hsla(35, 70%, 35%, 0.2)',
                      border: '2.5px solid hsl(40, 75%, 50%)',
                    }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: 'hsl(35, 50%, 25%)' }} />
                  </div>
                </button>
              ) : status === "unlocked" ? (
                <button
                  onClick={() => navigate(`/journey/day/${item.day}`)}
                  className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center cursor-pointer press-scale"
                  style={{
                    background: 'hsl(220, 20%, 12%)',
                    border: '3.5px solid hsl(220, 10%, 35%)',
                    boxShadow: '0 0 20px hsla(42, 80%, 50%, 0.1)',
                  }}
                >
                  {/* Animated light ring */}
                  <motion.div
                    className="absolute inset-[-3px] rounded-full"
                    style={{
                      border: '3px solid transparent',
                      backgroundImage: 'conic-gradient(from 0deg, transparent 0%, hsla(45, 80%, 75%, 0.8) 15%, transparent 30%, transparent 100%)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'border-box',
                      maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
                      WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {/* Inner golden circle */}
                  <div
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at center, hsl(45, 100%, 97%), hsl(42, 80%, 65%))',
                      boxShadow: 'inset 0 2px 4px hsla(45, 80%, 90%, 0.5), inset 0 -2px 4px hsla(35, 70%, 35%, 0.2), 0 0 15px hsla(42, 80%, 55%, 0.2)',
                      border: '2.5px solid hsl(40, 75%, 50%)',
                    }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: 'hsl(35, 50%, 25%)' }} />
                  </div>
                </button>
              ) : (
                <button
                  disabled
                  className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
                  style={{
                    background: 'hsl(260, 25%, 14%)',
                    border: '2px solid hsl(260, 20%, 20%)',
                  }}
                >
                  <Lock className="w-5 h-5 text-muted-foreground/50" />
                </button>
              )}

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
