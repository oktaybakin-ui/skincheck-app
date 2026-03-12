import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
}

export default function Card({ children, className = "", onClick, selected, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-2xl p-4 shadow-sm border-2 transition-all duration-150 ${
        selected ? "border-primary shadow-primary/20 shadow-md" : "border-transparent"
      } ${hoverable || onClick ? "cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.98]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
