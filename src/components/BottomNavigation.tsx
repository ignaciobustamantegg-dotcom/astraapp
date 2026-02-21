import { NavLink, useLocation } from "react-router-dom";
import { Home, Map, Sparkles, MessageCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/journey", label: "Jornada", icon: Map },
  { to: "/forecast", label: "Previsão", icon: Sparkles },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Perfil", icon: User },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="shrink-0 z-50 safe-bottom-fixed px-4 pb-1 pt-2">
      <nav
        className="rounded-2xl border border-border/40"
        style={{
          background: "linear-gradient(135deg, hsl(260 30% 10% / 0.85), hsl(260 35% 8% / 0.9))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow:
            "0 -4px 24px -4px hsl(270 50% 65% / 0.1), 0 0 0 0.5px hsl(260 20% 22% / 0.4), inset 0 1px 0 hsl(270 40% 80% / 0.06)",
        }}
      >
        <div className="flex items-center justify-around h-14">
          {tabs.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all duration-200"
              >
                <div className="relative">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="glow"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute -inset-3 rounded-full pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle, hsl(270 80% 65% / 0.2) 0%, transparent 70%)",
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.div
                    animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? "text-primary drop-shadow-[0_0_6px_hsl(270_60%_70%/0.5)]"
                          : "text-muted-foreground"
                      }`}
                    />
                  </motion.div>
                </div>
                <span
                  className={`text-[10px] font-medium tracking-wide transition-all duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;
