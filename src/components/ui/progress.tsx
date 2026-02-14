import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    style={{ background: "linear-gradient(90deg, hsl(270, 60%, 65%), hsl(185, 60%, 55%))" }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full flex-1 bg-secondary transition-all"
      style={{
        position: "absolute",
        right: 0,
        width: `${100 - (value || 0)}%`,
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
