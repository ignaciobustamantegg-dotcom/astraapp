import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Moon, Sparkles, Eye } from "lucide-react";
import landingBg from "@/assets/landing-bg.png";

const steps = [
  { number: "01", title: "Map", desc: "Identify invisible behavioral patterns", icon: Eye },
  { number: "02", title: "Analyze", desc: "Decode the architecture beneath", icon: Sparkles },
  { number: "03", title: "Decide", desc: "Choose Destiny or Inertia", icon: Moon },
];

const Index = () => {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden flex flex-col">
      {/* Background image */}
      <img src={landingBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-background/40 pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/50 safe-top">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 min-h-[44px]">
            <Moon className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
              Astra
            </span>
          </div>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary min-h-[44px] px-4">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-5 pb-8 relative z-10 no-scrollbar overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-16">
          <motion.div
            className="text-center w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Crescent icon */}
            <motion.div
              className="mx-auto mb-6 w-14 h-14 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-primary to-primary/70 shadow-[0_0_40px_rgba(217,170,60,0.3)]" style={{
                clipPath: "path('M28 0 A28 28 0 1 1 28 56 A20 20 0 1 0 28 0')"
              }} />
            </motion.div>

            <h1 className="text-[1.75rem] leading-[1.2] md:text-5xl font-medium tracking-tight text-foreground mb-3">
              Decode the Invisible Architecture of Your Relationships
            </h1>
            <p className="text-[0.9rem] leading-relaxed text-muted-foreground max-w-xs mx-auto mb-6 font-light">
              A 7-day guided emotional audit to reveal hidden patterns and calibrate your destiny.
            </p>

            <Link to="/auth" className="block">
              <Button
                size="lg"
                className="h-[52px] w-full text-[0.9rem] font-semibold rounded-full tracking-wide bg-foreground text-background hover:bg-foreground/90 press-scale"
              >
                Begin Your Audit
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          className="w-full max-w-lg mx-auto space-y-2.5 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4 bg-card/60 border border-border/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[0.65rem] font-medium tracking-[0.15em] text-primary uppercase">
                  Step {step.number}
                </span>
                <h3 className="text-base font-medium text-foreground leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="text-center pb-4 safe-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="w-8 h-[1px] bg-primary/40 mx-auto mb-4" />
          <p className="text-xs text-muted-foreground tracking-wide">
            Trusted by <span className="text-primary font-medium">2,400+</span> individuals
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
