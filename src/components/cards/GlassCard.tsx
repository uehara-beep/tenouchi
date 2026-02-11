"use client";

import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({
  children,
  style,
  delay = 0,
  onClick,
}: GlassCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 50, y: 50 })}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
        borderRadius: 24,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          transition: "background 0.15s",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
