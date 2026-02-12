import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Moon, Sparkles, Eye } from "lucide-react";

const steps = [
  { number: "01", title: "Map", desc: "Identify invisible behavioral patterns", icon: Eye },
  { number: "02", title: "Analyze", desc: "Decode the architecture beneath", icon: Sparkles },
  { number: "03", title: "Decide", desc: "Choose Destiny or Inertia", icon: Moon },
];

const Index = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-primary/5 blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/50 safe-top">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
              Astra
            </span>
          </div>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary min-h-[44px] min-w-[44px]">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-28 md:pt-36 pb-16 md:pb-20 px-5 md:px-6 relative z-10 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Crescent icon */}
            <motion.div
              className="mx-auto mb-8 md:mb-10 w-16 h-16 md:w-20 md:h-20 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-primary to-primary/70 shadow-[0_0_40px_rgba(217,170,60,0.3)] md:shadow-[0_0_60px_rgba(217,170,60,0.3)]" style={{
                clipPath: "path('M40 0 A40 40 0 1 1 40 80 A28 28 0 1 0 40 0')"
              }} />
            </motion.div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium leading-[1.15] tracking-tight text-foreground mb-4 md:mb-6">
              Decode the Invisible Architecture of Your Relationships
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 md:mb-10 font-light leading-relaxed">
              A 7-day guided emotional audit to reveal hidden patterns and calibrate your destiny.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="h-14 w-full md:w-auto px-10 text-base font-semibold rounded-full tracking-wide bg-foreground text-background hover:bg-foreground/90"
              >
                Begin Your Audit
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          className="w-full max-w-3xl mx-auto mt-16 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {steps.map((step) => (
            <div key={step.number} className="text-center bg-card/60 border border-border/50 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
              <step.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">
                Step {step.number}
              </span>
              <h3 className="text-lg md:text-xl font-medium text-foreground mt-2 mb-1.5">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="max-w-xl mx-auto mt-16 md:mt-28 text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="w-8 h-[1px] bg-primary/40 mx-auto mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide">
            Trusted by <span className="text-primary font-medium">2,400+</span> individuals navigating their emotional architecture
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
