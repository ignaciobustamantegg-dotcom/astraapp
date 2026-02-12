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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
              Astra
            </span>
          </div>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-36 pb-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Crescent icon */}
            <motion.div
              className="mx-auto mb-10 w-20 h-20 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary to-primary/70 shadow-[0_0_60px_rgba(217,170,60,0.3)]" style={{
                clipPath: "path('M40 0 A40 40 0 1 1 40 80 A28 28 0 1 0 40 0')"
              }} />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-foreground mb-6">
              Decode the Invisible Architecture of Your Relationships
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 font-light leading-relaxed">
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
                className="h-14 px-10 text-base font-semibold rounded-full tracking-wide bg-foreground text-background hover:bg-foreground/90"
              >
                Begin Your Audit
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          className="max-w-3xl mx-auto mt-28 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {steps.map((step) => (
            <div key={step.number} className="text-center bg-card/60 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
              <step.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">
                Step {step.number}
              </span>
              <h3 className="text-xl font-medium text-foreground mt-2 mb-2">
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
          className="max-w-xl mx-auto mt-28 text-center"
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
