import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Leaf } from "lucide-react";

const SplashScreen: React.FC<{ autoNavigate?: boolean }> = ({ autoNavigate = true }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    if (autoNavigate) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate, autoNavigate]);

  return (
    <MobileLayout className="flex items-center justify-center bg-primary">
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-700 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-primary-foreground/20 flex items-center justify-center animate-pulse-soft">
            <div className="w-20 h-20 rounded-full bg-primary-foreground flex items-center justify-center">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center">
            <span className="text-primary text-xs">🥬</span>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">
            Taza Taza
          </h1>
          <p className="text-primary-foreground/80 text-lg mt-2 font-medium">
            Delivering Fresh Daily
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-foreground/60"
              style={{
                animation: "bounce-soft 1s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SplashScreen;
