const Orbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
    <div
      className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full animate-breathe"
      style={{
        background:
          "radial-gradient(circle, hsl(270 50% 50% / 0.18) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full animate-breathe-slow"
      style={{
        background:
          "radial-gradient(circle, hsl(200 60% 45% / 0.12) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(250 35% 30% / 0.06) 0%, transparent 60%)",
      }}
    />
  </div>
);

export default Orbs;
