import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "safe" | "warning" | "danger" | "info" | "primary" | "secondary" | "muted";
  size?: "sm" | "md";
  className?: string;
}

const badgeVariants = {
  safe: "bg-safe/15 text-safe",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  muted: "bg-gray-100 text-muted",
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({ children, variant = "muted", size = "sm", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${badgeVariants[variant]} ${badgeSizes[size]} ${className}`}>
      {children}
    </span>
  );
}
