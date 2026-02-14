import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import landingBg from "@/assets/landing-bg.png";

const Index = () => {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden flex flex-col">
      {/* Background image */}
      <img
        src={landingBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-background/30 pointer-events-none" />

      {/* Center content: Logo + tagline */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-4 w-16 h-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-b from-primary to-primary/70 shadow-[0_0_50px_rgba(217,170,60,0.35)]"
              style={{
                clipPath:
                  "path('M32 0 A32 32 0 1 1 32 64 A22 22 0 1 0 32 0')",
              }}
            />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1">
            Astra
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Protocolo de Auditoria Emocional
          </p>
        </motion.div>
      </div>

      {/* Bottom buttons */}
      <motion.div
        className="relative z-10 px-6 pb-8 space-y-3 safe-bottom"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link to="/plans" className="block">
          <Button className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 press-scale">
            Começar
          </Button>
        </Link>
        <Link to="/login" className="block">
          <button
            className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide press-scale transition-all duration-300 text-primary-foreground"
            style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))' }}
          >
            Já tenho uma conta
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;
