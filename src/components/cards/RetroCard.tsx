"use client";

import { useState, useEffect, ReactNode, CSSProperties } from "react";

interface RetroCardProps {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
  glitch?: string;
  onClick?: () => void;
}

export function RetroCard({
  children,
  style,
  delay = 0,
  glitch,
  onClick,
}: RetroCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(8,24,48,0.7)",
        borderRadius: 4,
        padding: "18px 20px",
        border: "1px solid rgba(0,255,200,0.15)",
        boxShadow:
          "0 0 20px rgba(0,255,200,0.05), inset 0 0 30px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          zIndex: 2,
        }}
      />
      {/* Glitch line */}
      {glitch && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${glitch}, transparent)`,
            opacity: 0.25,
            animation: "glitchLine 3s ease-in-out infinite",
            zIndex: 3,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
