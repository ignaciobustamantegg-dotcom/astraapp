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
      {/* No overlay – imagen clara y brillante */}

      {/* Center content: Logo + tagline */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1
              className="text-4xl text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1 }}
            >
              Astra
            </h1>
            <div
              className="w-7 h-7 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 80%, 65%), hsl(40, 70%, 55%))',
                clipPath: "path('M14 0 A14 14 0 1 1 14 28 A10 10 0 1 0 14 0')",
                boxShadow: '0 0 18px rgba(230, 195, 80, 0.45), 0 0 40px rgba(230, 195, 80, 0.2)',
              }}
            />
          </motion.div>
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
          <button
            className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide press-scale transition-all duration-300 text-primary-foreground"
            style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))' }}
          >
            Começar
          </button>
        </Link>
        <Link to="/login" className="block">
          <Button className="w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 press-scale">
            Já tenho uma conta
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;
