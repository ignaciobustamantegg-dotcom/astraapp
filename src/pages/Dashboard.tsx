import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
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

      // Fetch profile & progress
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <nav className="bg-background border-b border-border px-6 h-16 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
          Astra
        </span>
        <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Sign Out
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Welcome & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm text-muted-foreground mb-1">Welcome, {displayName}</p>
          <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-6">
            Your Emotional Audit
          </h1>

          <div className="bg-background rounded-xl border border-border p-6">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Day {currentDay} of 7
              </span>
              <span className="text-xs text-muted-foreground">
                {progressPercent}% Complete
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-border" />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-3">
          {AUDIT_DAYS.map((item, i) => {
            const status = getDayStatus(item.day);
            const isLocked = status === "reserved";

            return (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className={`bg-background rounded-xl border border-border p-6 transition-all ${
                  isLocked ? "opacity-50" : "hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium tracking-[0.1em] uppercase text-accent">
                        Day {item.day}
                      </span>
                      {status === "completed" && (
                        <Badge variant="secondary" className="text-[10px] font-medium tracking-wide">
                          Completed
                        </Badge>
                      )}
                      {status === "unlocked" && (
                        <Badge className="text-[10px] font-medium tracking-wide bg-foreground text-background">
                          Unlocked
                        </Badge>
                      )}
                      {status === "reserved" && (
                        <Badge variant="outline" className="text-[10px] font-medium tracking-wide text-muted-foreground">
                          Reserved
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-light">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex-shrink-0 pt-1">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground/50" />
                    ) : status === "unlocked" ? (
                      <Button size="sm" className="h-9 rounded-full px-5 text-xs font-medium tracking-wide">
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
