import * as React from "react";
import { cn } from "@/lib/utils";

interface TazaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
}

const TazaCard = React.forwardRef<HTMLDivElement, TazaCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl bg-card text-card-foreground transition-all duration-200",
          variant === "default" && "shadow-soft",
          variant === "elevated" && "shadow-card",
          variant === "outlined" && "border border-border",
          className
        )}
        {...props}
      />
    );
  }
);
TazaCard.displayName = "TazaCard";

const TazaCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
TazaCardHeader.displayName = "TazaCardHeader";

const TazaCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
TazaCardContent.displayName = "TazaCardContent";

export { TazaCard, TazaCardHeader, TazaCardContent };
