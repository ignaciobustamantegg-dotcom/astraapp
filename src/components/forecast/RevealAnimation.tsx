import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MYSTIC_PHRASES = [
  "Sintonizando as energias...",
  "As estrelas se alinham...",
  "Sua previsão está pronta...",
];

const RevealAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => onComplete(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.3 } }}
      className="flex-1 flex items-center justify-center"
    >
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* Concentric pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-primary/30"
            initial={{ width: 40, height: 40, opacity: 0.8 }}
            animate={{
              width: [40, 200 + i * 40],
              height: [40, 200 + i * 40],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Floating particles converging */}
        {phase >= 1 &&
          Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const r = 120;
            return (
              <motion.div
                key={`p-${i}`}
                className="absolute w-2 h-2 rounded-full bg-primary/70"
                initial={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 0.6] }}
                transition={{ duration: 1.4, delay: i * 0.08, ease: "easeIn" }}
              />
            );
          })}

        {/* Central orb */}
        <motion.div
          className="absolute rounded-full bg-primary/25"
          initial={{ width: 20, height: 20 }}
          animate={{
            width: phase >= 2 ? 160 : phase >= 1 ? 60 : 30,
            height: phase >= 2 ? 160 : phase >= 1 ? 60 : 30,
            opacity: phase >= 2 ? 0 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Flash on final phase */}
        {phase >= 2 && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/40"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2.5] }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Core glow */}
        <motion.div
          className="w-4 h-4 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Mystic text */}
      <div className="absolute bottom-1/4 left-0 right-0 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-secondary-foreground text-sm font-light"
          >
            {MYSTIC_PHRASES[Math.min(phase, MYSTIC_PHRASES.length - 1)]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RevealAnimation;
