"use client";

import { useState, useEffect, ReactNode, CSSProperties } from "react";

interface NeuCardProps {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
  pressed?: boolean;
  onClick?: () => void;
}

export function NeuCard({
  children,
  style,
  delay = 0,
  pressed,
  onClick,
}: NeuCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      style={{
        background: pressed
          ? "linear-gradient(145deg, #142240, #1a2d4a)"
          : "linear-gradient(145deg, #1a2d4a, #142240)",
        borderRadius: 24,
        padding: "20px",
        boxShadow: pressed
          ? "inset 4px 4px 12px rgba(0,0,0,0.4), inset -2px -2px 8px rgba(147,197,253,0.04)"
          : "6px 6px 20px rgba(0,0,0,0.35), -3px -3px 12px rgba(147,197,253,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
