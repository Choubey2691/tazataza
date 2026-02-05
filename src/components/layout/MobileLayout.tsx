import React from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  hideNav = false,
}) => {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div
        className={cn(
          "w-full max-w-[400px] min-h-screen bg-background relative",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface MobileHeaderProps {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  transparent = false,
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between h-14 px-4 safe-area-top",
        transparent ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
      )}
    >
      <div className="w-10">{leftAction}</div>
      {title && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
      <div className="w-10 flex justify-end">{rightAction}</div>
    </header>
  );
};

interface MobileContentProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  children,
  className,
  padded = true,
}) => {
  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto hide-scrollbar",
        padded && "px-4",
        className
      )}
    >
      {children}
    </main>
  );
};
