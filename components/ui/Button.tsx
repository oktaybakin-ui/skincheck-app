import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark active:scale-[0.98]",
  secondary: "bg-secondary text-white hover:bg-secondary-light active:scale-[0.98]",
  outline: "border border-primary text-primary hover:bg-primary/10 active:scale-[0.98]",
  ghost: "text-muted hover:text-primary hover:bg-primary/5",
  danger: "bg-danger text-white hover:bg-red-600 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3.5 text-lg rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Yükleniyor...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
