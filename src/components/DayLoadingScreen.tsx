import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DayLoadingScreenProps {
  dayNumber: number;
  dayTitle: string;
  onComplete: () => void;
}

const DAY_TITLES: Record<number, string> = {
  1: "Identificação da Inércia",
  2: "A Mecânica da Conexão",
  3: "O Espelho Interno",
  4: "Revisão de Energia",
  5: "Momentos Decisivos",
  6: "O Custo da Oportunidade",
  7: "Sua Nova Perspectiva",
};

const DayLoadingScreen = ({ dayNumber, dayTitle, onComplete }: DayLoadingScreenProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center h-full relative"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(270, 60%, 55%, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Breathing circle */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: [0.6, 1, 0.85],
            opacity: [0, 1, 0.9],
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="relative mb-10"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsla(270, 60%, 65%, 0.15), hsla(185, 50%, 55%, 0.1))",
              border: "1px solid hsla(270, 60%, 70%, 0.2)",
              boxShadow: "0 0 40px hsla(270, 60%, 65%, 0.15), inset 0 0 30px hsla(270, 60%, 65%, 0.05)",
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(270, 60%, 70%), hsl(185, 55%, 55%))",
                boxShadow: "0 0 12px hsla(270, 60%, 70%, 0.4)",
              }}
            />
          </div>

          {/* Orbit ring */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: [0, 0.4, 0.4], rotate: 360 }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute inset-[-12px] rounded-full"
            style={{
              border: "1px solid hsla(270, 60%, 70%, 0.12)",
            }}
          />
        </motion.div>

        {/* Day label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary/60 mb-2"
        >
          Dia {dayNumber}
        </motion.p>

        {/* Day title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-xl text-foreground text-center px-8"
          style={{ fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.3 }}
        >
          {dayTitle}
        </motion.h2>

        {/* Subtle line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-12 h-[1px] mt-6"
          style={{
            background: "linear-gradient(90deg, transparent, hsla(270, 60%, 70%, 0.3), transparent)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export { DAY_TITLES };
export default DayLoadingScreen;
