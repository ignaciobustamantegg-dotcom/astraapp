import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Map", desc: "Identify invisible behavioral patterns" },
  { number: "02", title: "Analyze", desc: "Decode the architecture beneath" },
  { number: "03", title: "Decide", desc: "Choose Destiny or Inertia" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
            Astra
          </span>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-12 h-[1px] bg-accent mx-auto mb-8" />
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
                className="h-14 px-10 text-base font-medium rounded-full tracking-wide"
              >
                Begin Your Audit
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          className="max-w-3xl mx-auto mt-28 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
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
          <div className="w-8 h-[1px] bg-accent mx-auto mb-6" />
          <p className="text-sm text-muted-foreground tracking-wide">
            Trusted by <span className="text-foreground font-medium">2,400+</span> individuals navigating their emotional architecture
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
