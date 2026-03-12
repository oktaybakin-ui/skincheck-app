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
      className={`bg-surface rounded-xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] border transition-all duration-150 ${
        selected ? "border-primary shadow-md" : "border-gray-100"
      } ${hoverable || onClick ? "cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.98]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
