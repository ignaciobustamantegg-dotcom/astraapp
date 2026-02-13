import { useAuth } from "@/contexts/AuthContext";
import { Moon } from "lucide-react";
import JourneyMap from "@/components/JourneyMap";

const Dashboard = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-[100dvh] relative overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(180deg, 
          hsl(260, 40%, 6%) 0%, 
          hsl(255, 35%, 10%) 30%, 
          hsl(250, 30%, 12%) 60%, 
          hsl(245, 28%, 14%) 85%,
          hsl(30, 20%, 15%) 100%)`
      }}
    >
      {/* Ambient mist layers */}
      <div className="absolute top-[20%] left-0 w-full h-[200px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, hsl(270, 60%, 60%), transparent 70%)' }} />
      <div className="absolute top-[55%] right-0 w-full h-[200px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, hsl(270, 50%, 55%), transparent 70%)' }} />

      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/30 px-4 h-12 flex items-center justify-between safe-top"
        style={{ background: 'hsla(260, 40%, 6%, 0.7)' }}>
        <div className="flex items-center gap-2 min-h-[44px]">
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
            Astra
          </span>
        </div>
        <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
          Salir
        </button>
      </nav>

      <main className="flex-1 relative z-10 no-scrollbar overflow-y-auto safe-bottom">
        <JourneyMap />
      </main>
    </div>
  );
};

export default Dashboard;
