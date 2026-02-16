import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    if (variant === "secondary") {
      return (
        <button
          ref={ref}
          className={cn(
            "w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide bg-foreground text-background hover:bg-foreground/90 press-scale transition-all duration-300",
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "w-full h-[52px] rounded-xl text-[15px] font-bold press-scale transition-all duration-300 text-primary-foreground",
          className
        )}
        style={{
          background:
            "linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))",
          boxShadow:
            "0 0 20px hsla(270, 60%, 70%, 0.25), 0 4px 12px hsla(270, 60%, 70%, 0.15)",
          border: "1px solid hsla(270, 60%, 75%, 0.2)",
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton };
