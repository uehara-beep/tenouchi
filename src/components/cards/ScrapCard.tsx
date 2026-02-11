"use client";

import { useState, useEffect, ReactNode, CSSProperties } from "react";

interface ScrapCardProps {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
  tape?: boolean;
  sticker?: string;
  rotate?: number;
}

export function ScrapCard({
  children,
  style,
  delay = 0,
  tape,
  sticker,
  rotate = 0,
}: ScrapCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        background: "rgba(255,248,235,0.07)",
        borderRadius: 4,
        padding: "20px 18px",
        position: "relative",
        border: "1px solid rgba(255,248,235,0.1)",
        boxShadow: "3px 4px 12px rgba(0,0,0,0.25)",
        transform: visible
          ? `rotate(${rotate}deg)`
          : `rotate(${rotate}deg) translateY(30px)`,
        opacity: visible ? 1 : 0,
        transition: "all 0.5s ease",
        ...style,
      }}
    >
      {tape && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "30%",
            width: 60,
            height: 18,
            background: "rgba(255,220,150,0.14)",
            borderRadius: 2,
            transform: "rotate(-2deg)",
            border: "1px solid rgba(255,220,150,0.1)",
          }}
        />
      )}
      {sticker && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `${sticker}15`,
            border: `2px dashed ${sticker}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
          }}
        >
          ✦
        </div>
      )}
      {children}
    </div>
  );
}
