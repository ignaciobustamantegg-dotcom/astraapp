import Orbs from "./quiz/Orbs";

const JourneyMapSkeleton = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 relative">
      <Orbs />

      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        {/* Concentric spinning circles */}
        <div className="relative w-20 h-20 mb-10">
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow" />
          <div
            className="absolute inset-2 rounded-full border border-accent/20"
            style={{ animation: "spin-slow 6s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary/60 animate-breathe" />
          </div>
        </div>

        <p className="text-secondary-foreground text-base font-light mb-8">
          Preparando sua jornada...
        </p>

        {/* Progress bar */}
        <div className="w-48 h-[3px] bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "60%",
              background: "linear-gradient(90deg, hsl(270 50% 72%), hsl(200 60% 65%))",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyMapSkeleton;
