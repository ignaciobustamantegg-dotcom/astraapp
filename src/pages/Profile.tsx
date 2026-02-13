import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, TrendingUp, LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const [profileRes, progressRes] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("audit_progress").select("current_day").eq("user_id", user.id).maybeSingle(),
      ]);

      setDisplayName(profileRes.data?.display_name || user.email?.split("@")[0] || "");
      setCurrentDay(progressRes.data?.current_day || 1);
      setLoading(false);
    };

    load();
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-5 pt-8 pb-6">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
          style={{
            background: "linear-gradient(135deg, hsl(270, 45%, 30%), hsl(270, 40%, 22%))",
            border: "2px solid hsl(270, 40%, 35%)",
          }}
        >
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-medium text-foreground">{displayName}</h1>
      </div>

      {/* Info cards */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-border/30"
          style={{ background: "hsla(260, 30%, 12%, 0.6)" }}
        >
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Correo</p>
            <p className="text-sm text-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-border/30"
          style={{ background: "hsla(260, 30%, 12%, 0.6)" }}
        >
          <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Progreso</p>
            <p className="text-sm text-foreground">Día {currentDay} de 7</p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-destructive border border-destructive/30 press-scale transition-colors hover:bg-destructive/10"
        style={{ background: "hsla(0, 72%, 51%, 0.05)" }}
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
      </div>
      )}
    </>
  );
};

export default Profile;
