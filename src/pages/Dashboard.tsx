import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Moon, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const AUDIT_DAYS = [
  { day: 1, title: "Identification of Inertia", desc: "Mapping automatic patterns that govern your connections" },
  { day: 2, title: "The Mechanics of Connection", desc: "Invisible forces that bind or dissolve union" },
  { day: 3, title: "The Mirror of Shadows", desc: "Projections, blind spots, and hidden reflections" },
  { day: 4, title: "Vitality Audit", desc: "Energy leaks versus authentic soul growth" },
  { day: 5, title: "Threads of Destiny", desc: "Identifying real alignment beyond comfort" },
  { day: 6, title: "Opportunity Cost", desc: "What is sacrificed by staying in inertia" },
  { day: 7, title: "The Final Verdict", desc: "Resolution and the emergence of a new path" },
];

type AuditProgress = {
  current_day: number;
  [key: string]: any;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<AuditProgress | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const [profileRes, progressRes] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("audit_progress").select("*").eq("user_id", session.user.id).maybeSingle(),
      ]);

      setDisplayName(profileRes.data?.display_name || session.user.email?.split("@")[0] || "");
      setProgress(progressRes.data as AuditProgress | null);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const currentDay = progress?.current_day || 1;
  const completedDays = Math.max(0, currentDay - 1);
  const progressPercent = Math.round((completedDays / 7) * 100);

  const getDayStatus = (day: number): "completed" | "unlocked" | "reserved" => {
    if (day < currentDay) return "completed";
    if (day === currentDay) return "unlocked";
    return "reserved";
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Moon className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[200px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50 px-4 h-12 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2 min-h-[44px]">
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
            Astra
          </span>
        </div>
        <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
          Sign Out
        </button>
      </nav>

      <main className="flex-1 px-4 py-5 relative z-10 no-scrollbar overflow-y-auto safe-bottom">
        {/* Welcome & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <p className="text-xs text-muted-foreground mb-0.5">Welcome, {displayName}</p>
          <h1 className="text-xl font-medium text-foreground mb-4">
            Your Emotional Audit
          </h1>

          <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-4">
            <div className="flex items-baseline justify-between mb-2.5">
              <span className="text-sm font-medium text-foreground">
                Day {currentDay} of 7
              </span>
              <span className="text-xs text-primary font-medium">
                {progressPercent}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-secondary" />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-2.5 pb-4">
          {AUDIT_DAYS.map((item, i) => {
            const status = getDayStatus(item.day);
            const isLocked = status === "reserved";

            return (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className={`bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-4 transition-all press-scale ${
                  isLocked ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-primary">
                        Day {item.day}
                      </span>
                      {status === "completed" && (
                        <Badge className="text-[10px] font-medium tracking-wide bg-primary/15 text-primary border-0 gap-1 h-5">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </Badge>
                      )}
                      {status === "unlocked" && (
                        <Badge className="text-[10px] font-medium tracking-wide bg-primary text-background border-0 gap-1 h-5">
                          <Sparkles className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
                      {status === "reserved" && (
                        <Badge variant="outline" className="text-[10px] font-medium tracking-wide text-muted-foreground border-border/50 h-5">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-[0.9rem] font-medium text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex-shrink-0 pt-0.5">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground/40" />
                    ) : status === "unlocked" ? (
                      <Button size="sm" className="h-9 rounded-full px-5 text-xs font-semibold tracking-wide bg-primary text-background hover:bg-primary/90 press-scale">
                        Begin
                      </Button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
