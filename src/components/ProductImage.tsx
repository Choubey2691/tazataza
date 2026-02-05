import React from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-full h-full",
};

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className,
  size = "xl",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "object-cover",
        size !== "xl" && sizeClasses[size],
        size !== "xl" && "rounded-lg",
        className
      )}
      loading="lazy"
    />
  );
};
