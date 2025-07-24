import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-neutral-100 text-neutral-800",
    todo: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 border border-blue-200",
    done: "bg-green-100 text-green-800 border border-green-200",
    blocked: "bg-red-100 text-red-800 border border-red-200"
  };
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;