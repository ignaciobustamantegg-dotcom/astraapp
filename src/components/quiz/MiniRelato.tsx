interface MiniRelatoProps {
  name: string;
  age: number;
  city: string;
  text: string;
  leaving?: boolean;
}

const MiniRelato = ({ name, age, city, text, leaving = false }: MiniRelatoProps) => {
  return (
    <div
      className={`bg-gradient-card-glass border-glass rounded-2xl px-5 py-4 glow-soft max-w-sm mx-auto ${
        leaving ? "animate-encouragement-out" : "animate-encouragement-in"
      }`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs">
          {name.charAt(0)}
        </div>
        <div>
          <span className="text-foreground text-xs font-medium">{name}, {age}</span>
          <span className="text-muted-foreground text-[10px] ml-1.5">— {city}</span>
        </div>
      </div>
      <p className="text-secondary-foreground text-xs leading-relaxed font-light italic">
        "{text}"
      </p>
    </div>
  );
};

export default MiniRelato;
