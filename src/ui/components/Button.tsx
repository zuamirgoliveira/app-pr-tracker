import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60",

        // Variantes
        variant === "primary" &&
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 hover:shadow-xl hover:shadow-blue-600/50 hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-slate-200 text-slate-800 border border-slate-300 hover:bg-slate-100 hover:border-blue-600 dark:bg-slate-700/80 dark:text-slate-50 dark:border-slate-600",
        variant === "ghost" &&
          "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",

        // Tamanhos
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
