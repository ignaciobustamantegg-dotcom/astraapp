import { NavLink, useLocation } from "react-router-dom";
import { Home, Map, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Inicio", icon: Home },
  { to: "/journey", label: "Viaje", icon: Map },
  { to: "/profile", label: "Perfil", icon: User },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav
      className="sticky bottom-0 z-50 border-t border-border/30 safe-bottom-fixed"
      style={{ background: "hsla(260, 40%, 6%, 0.85)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors duration-200"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isActive && (
                  <div
                    className="absolute -inset-2 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, hsla(270, 80%, 65%, 0.25) 0%, transparent 70%)",
                    }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
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
  );
};

export default BottomNavigation;
